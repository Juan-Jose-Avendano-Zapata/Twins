import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import followStyles from '../styles/followStyles';
import homeStyles from '../styles/homeStyles';
import { theme } from '../styles/theme';

import { authService } from '../firebase/services/authService';
import { userService } from '../firebase/services/userService';

export default function ListFollow({ route, navigation }) {
    const { initialTab = 'followers' } = route.params || {};
    const { userId = 'userId'} = route.params || {}; 
    const [activeTab, setActiveTab] = useState(initialTab);
    const [usersList, setUsersList] = useState([]);
    const [currentFollowing, setCurrentFollowing] = useState([]);
    const [profileHeader, setProfileHeader] = useState({
        name: "",
        username: "",
    });
    const [loading, setLoading] = useState(true);

    const USERS_PER_PAGE = 10;
    const [page, setPage] = useState(1);

    const paginatedUsers = usersList.slice(
        (page - 1) * USERS_PER_PAGE,
        page * USERS_PER_PAGE
    );

    // Load list of followers / following
    const loadFollowData = async () => {
        try {
            setLoading(true);
            const current = authService.getCurrentUser();
            if (!current) {
                console.log("There is no current user");
                return;
            }

            // Use new methods
            let result;
            if (activeTab === "followers") {
                result = await userService.getFollowersList(userId);
            } else {
                result = await userService.getFollowingList(userId);
            }

            if (result.success) {
                setUsersList(result.data);
            } else {
                console.log("Error loading list:", result.error);
                setUsersList([]);
            }

            const userProfile = await userService.getUserProfile(userId);
            if (userProfile.success) {
                const data = userProfile.data;
                const profile = data.profile || {};

                setProfileHeader({
                    name: profile.name || "",
                    username: data.username || "",
                });
            }

        } catch (err) {
            console.log("Error loading follow data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Follow / Unfollow user
    const toggleFollow = async (userId, isFollowing) => {
        const currentUser = authService.getCurrentUser();
        try {
            if (isFollowing &&  userId != currentUser.uid) {
                await userService.unfollowUser(userId);
            } else {
                if(userId != currentUser.uid) {
                await userService.followUser(userId);
                }
            }
            // Reload list
            loadFollowData();
        } catch (err) {
            console.log("Error toggling follow:", err);
        }
    };

    useEffect(() => {
        loadFollowData();
    }, [activeTab]);

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={followStyles.userItem}
            onPress={() => navigation.navigate('Profile', { userId: item.id})}
        >
            <Image
                source={
                    item.avatar
                        ? { uri: item.avatar }
                        : require('../assets/img/logoTWBlack.jpg')
                }
                style={followStyles.avatar}
            />
            <View style={followStyles.userInfo}>
                <Text style={followStyles.userName}>{item.name}</Text>
                <Text style={followStyles.userUsername}>@{item.username}</Text>
            </View>
            <TouchableOpacity
                style={[
                    followStyles.followButton,
                    item.isFollowing && followStyles.followingButton,
                ]}
                onPress={() => toggleFollow(item.id, item.isFollowing)}
                disabled={loading}
            >
                <Text
                    style={[
                        followStyles.followButtonText,
                        item.isFollowing && followStyles.followingButtonText,
                    ]}
                >
                    {item.isFollowing ? "Followed" : "Follow"}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={followStyles.container}>
            {/* HEADER */}
            <View style={homeStyles.header}>
                <IconButton
                    icon="arrow-left"
                    size={28}
                    onPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={followStyles.headerTitle}>{profileHeader.name}</Text>
                    <Text style={followStyles.headerSubtitle}>@{profileHeader.username}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* TABS */}
            <View style={followStyles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        followStyles.tab,
                        activeTab === 'followers' && followStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('followers')}
                >
                    <Text
                        style={[
                            followStyles.tabText,
                            activeTab === 'followers' && followStyles.activeTabText,
                        ]}
                    >
                        Followers
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        followStyles.tab,
                        activeTab === 'following' && followStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('following')}
                >
                    <Text
                        style={[
                            followStyles.tabText,
                            activeTab === 'following' && followStyles.activeTabText,
                        ]}
                    >
                        Following
                    </Text>
                </TouchableOpacity>
            </View>

            {/* USERS LIST */}
            <FlatList
                data={paginatedUsers}
                keyExtractor={(item) => item.id}
                renderItem={renderUserItem}
                contentContainerStyle={followStyles.listContent}
                ListEmptyComponent={
                    <View style={followStyles.emptyContainer}>
                        <Text style={followStyles.emptyText}>
                            {loading
                                ? "Loading..."
                                : activeTab === "followers"
                                    ? "No followers yet."
                                    : "Not following anyone yet."}
                        </Text>
                    </View>
                }
            />

            <View style={followStyles.paginationContainer}>

            {/* PREVIOUS */}
            <TouchableOpacity
                disabled={page === 1}
                onPress={() => setPage(prev => prev - 1)}
                style={[
                    followStyles.paginationButton,
                    page === 1 && followStyles.paginationButtonDisabled
                ]}
            >
                <Text
                    style={[
                        followStyles.paginationButtonText,
                        page === 1 && followStyles.paginationButtonTextDisabled
                    ]}
                >
                    Previous
                </Text>
            </TouchableOpacity>

            {/* PAGE NUMBER */}
            <Text style={followStyles.paginationText}> Page {page}</Text>

            {/* NEXT */}
            <TouchableOpacity
                disabled={page * USERS_PER_PAGE >= usersList.length}
                onPress={() => setPage(prev => prev + 1)}
                style={[
                    followStyles.paginationButton,
                    page * USERS_PER_PAGE >= usersList.length &&
                    followStyles.paginationButtonDisabled
                ]}
            >
                <Text
                    style={[
                        followStyles.paginationButtonText,
                        page * USERS_PER_PAGE >= usersList.length &&
                        followStyles.paginationButtonTextDisabled
                    ]}
                >
                    Next
                </Text>
            </TouchableOpacity>

        </View>
        </View>
    );
}
