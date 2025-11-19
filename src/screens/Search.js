import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Keyboard,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { TextInput, IconButton, FAB } from 'react-native-paper';
import searchStyles from '../styles/searchStyles';
import homeStyles from '../styles/homeStyles';
import { theme } from '../styles/theme';
import { userService } from '../firebase/services/userService';
import { authService } from '../firebase/services/authService';

export default function Search({ navigation }) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
    const inputRef = useRef(null);

    // Load the list of users that the current user follows
    const loadCurrentUserFollowing = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) return;

            const userProfile = await userService.getUserProfile(currentUser.uid);
            if (userProfile.success) {
                const following = userProfile.data.following || [];
                setCurrentUserFollowing(following.map(id => id.trim()));
            }
        } catch (error) {
            console.error("Error loading current user following:", error);
        }
    };

    // Search users in real time
    const searchUsers = async (searchText) => {
        if (!searchText.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            const result = await userService.searchUsers(searchText);

            if (result.success) {
                // Enrich data with follow information
                const enrichedResults = result.data.map(user => ({
                    id: user.id,
                    name: user.profile?.name || "User",
                    username: user.username,
                    avatar: user.profile?.avatar || "",
                    isFollowing: currentUserFollowing.includes(user.id.trim())
                }));

                setSearchResults(enrichedResults);
            } else {
                console.error("Search error:", result.error);
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Follow/Unfollow user
    const toggleFollow = async (userId, isCurrentlyFollowing) => {
        try {
            if (isCurrentlyFollowing) {
                await userService.unfollowUser(userId);
                // Update local state
                setCurrentUserFollowing(prev => prev.filter(id => id !== userId));
                setSearchResults(prev =>
                    prev.map(user =>
                        user.id === userId
                            ? { ...user, isFollowing: false }
                            : user
                    )
                );
            } else {
                await userService.followUser(userId);
                // Update local state
                setCurrentUserFollowing(prev => [...prev, userId]);
                setSearchResults(prev =>
                    prev.map(user =>
                        user.id === userId
                            ? { ...user, isFollowing: true }
                            : user
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    // Effect to search when text changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchUsers(query);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Load user's following when component mounts
    useEffect(() => {
        loadCurrentUserFollowing();
    }, []);

    // Reset search state when canceling
    const handleCancelSearch = () => {
        setIsFocused(false);
        Keyboard.dismiss();
        inputRef.current?.blur();
        setQuery('');
        setSearchResults([]);
    };

    // Navigate to user profile
    const navigateToUserProfile = (userId) => {
        navigation.navigate('Profile', { userId });
    };

    // Get avatar source
    const getAvatarSource = (avatar) => {
        if (avatar && avatar !== "" && avatar !== "~") {
            return { uri: avatar };
        }
        return require('../assets/img/logoTWBlack.jpg');
    };

    // Render user item
    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={searchStyles.userItem}
            onPress={() => navigateToUserProfile(item.id)}
        >
            <Image
                source={getAvatarSource(item.avatar)}
                style={searchStyles.avatar}
            />
            <View style={searchStyles.userInfo}>
                <Text style={searchStyles.userName}>{item.name}</Text>
                <Text style={searchStyles.userUsername}>@{item.username}</Text>
            </View>
            <TouchableOpacity
                style={[
                    searchStyles.followButton,
                    item.isFollowing && searchStyles.followingButton,
                ]}
                onPress={() => toggleFollow(item.id, item.isFollowing)}
                disabled={loading}
            >
                <Text
                    style={[
                        searchStyles.followButtonText,
                        item.isFollowing && searchStyles.followingButtonText,
                    ]}
                >
                    {item.isFollowing ? "Following" : "Follow"}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={searchStyles.container}>
            {/* HEADER */}
            <View style={homeStyles.header}>
                {/* Profile icon or back arrow */}
                {isFocused ? (
                    <IconButton
                        icon="arrow-left"
                        size={28}
                        onPress={handleCancelSearch}
                    />
                ) : (
                    <IconButton
                        icon="account-circle-outline"
                        size={30}
                        onPress={() => navigation.navigate('Profile', { userId: authService.getCurrentUser().uid })}
                    />
                )}

                {/* Search bar */}
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                    <TextInput
                        ref={inputRef}
                        placeholder="Search users"
                        mode="outlined"
                        value={query}
                        onChangeText={setQuery}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        left={<TextInput.Icon icon="magnify" />}
                        style={searchStyles.input}
                        outlineStyle={searchStyles.inputOutline}
                        theme={{
                            colors: {
                                primary: theme.Colors.primaryLight,
                                text: theme.Colors.text.primary,
                                placeholder: theme.Colors.text.secondary,
                            },
                        }}
                    />
                </View>

                {/* Settings icon - only shown when not searching */}
                {!isFocused && (
                    <IconButton
                        icon="cog-outline"
                        size={30}
                        onPress={() => navigation.navigate('Settings')}
                    />
                )}
            </View>

            {/* SEARCH RESULTS */}
            {loading ? (
                <View style={searchStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.Colors.primary} />
                    <Text style={searchStyles.loadingText}>Searching...</Text>
                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={item => item.id}
                    renderItem={renderUserItem}
                    ListEmptyComponent={
                        <View style={searchStyles.emptyContainer}>
                            <Text style={searchStyles.noResults}>
                                {query
                                    ? 'No users found.'
                                    : 'Start typing to search users.'}
                            </Text>
                        </View>
                    }
                    contentContainerStyle={searchStyles.listContent}
                />
            )}

            {/* FAB: hidden when the input is focused or there's text */}
            {!isFocused && query.length === 0 && (
                <FAB
                    icon="feather"
                    color="white"
                    style={homeStyles.fabCreate}
                    onPress={() => navigation.navigate('CreatePost')}
                />
            )}

            {/* BOTTOM MENU */}
            <View style={homeStyles.menu}>
                <IconButton
                    icon="home"
                    size={24}
                    onPress={() => navigation.navigate('Home')}
                />
                <IconButton
                    icon="magnify"
                    size={24}
                    onPress={() => navigation.navigate('Search')}
                />
                <IconButton icon="bell-outline" size={24}
                    onPress={() => Alert.alert("Notifications", "Notifications functionality is not implemented yet.")}
                />
                <IconButton icon="email-outline" size={24}
                    onPress={() => Alert.alert("Message", "Message functionality is not implemented yet.")}
                />
            </View>
        </View>
    );
}