import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
    ActivityIndicator
} from "react-native";
import { IconButton, FAB } from "react-native-paper";
import homeStyles from "../styles/homeStyles";
import { authService } from "../firebase/services/authService";
import { postService } from "../firebase/services/postService";

export default function Home({ navigation }) {
    const [activeTab, setActiveTab] = useState("For you");
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    useEffect(() => {
        const initializeData = async () => {
            await loadUserData();
            await loadPosts();
        };
        initializeData();
    }, []);

    // Effect to load posts when active tab changes
    useEffect(() => {
        if (userProfile) { // Only load posts if we already have user profile
            loadPosts();
        }
    }, [activeTab, userProfile]);

    const loadUserData = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const profile = await authService.getUserProfile(currentUser.uid);
                if (profile) {
                    setUserProfile(profile.data);
                }
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    // Load posts based on active tab
    const loadPosts = async () => {
        try {
            setLoading(true);
            let result;
            
            if (activeTab === "For you") {
                result = await postService.getPosts();
            } else {
                result = await postService.getFollowingPosts();
            }
            
            if (result.success) {
                setPosts(result.data);
            } else {
                console.error("Error loading posts:", result.error);
                Alert.alert("Error", "Could not load posts");
            }
        } catch (error) {
            console.error("Error in loadPosts:", error);
            Alert.alert("Error", "Error loading posts");
        } finally {
            setLoading(false);
        }
    };

    // Refresh feed - reloads posts based on active tab
    const onRefresh = async () => {
        setRefreshing(true);
        await loadPosts();
        setRefreshing(false);
    };

    // Handle like/unlike
    const handleLike = async (postId, currentlyLiked) => {
        try {
            let result;
            if (currentlyLiked) {
                result = await postService.unlikePost(postId);
            } else {
                result = await postService.likePost(postId);
            }

            if (result.success) {
                // Reload posts to reflect changes
                await loadPosts();
            } else {
                Alert.alert("Error", result.error);
            }
        } catch (error) {
            console.error("Error handling like:", error);
            Alert.alert("Error", "Could not process like");
        }
    };

    // Switch between tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getAvatarSource = (avatar) => {
        if (avatar && avatar !== "" && avatar !== "-") {
            return { uri: avatar };
        }
        return require("../assets/img/logoTWBlack.jpg");
    };

    const renderPost = ({ item }) => (
        <View style={homeStyles.post}>
            <Image
                source={getAvatarSource(item.authorAvatar)}
                style={homeStyles.avatar}
            />
            <View style={homeStyles.postContent}>
                <View style={homeStyles.postHeader}>
                    <Text style={homeStyles.name}>{item.authorName}</Text>
                    <Text style={homeStyles.username}>@{item.authorUsername} · {item.time}</Text>
                </View>
                <Text style={homeStyles.text}>{item.content}</Text>
                {item.image && item.image !== "" && item.image !== "~" && (
                    <Image
                        source={{ uri: item.image }}
                        style={homeStyles.postImage}
                    />
                )}
                <View style={homeStyles.actions}>
                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon="comment-outline"
                            size={20}
                        // onPress={navigation.navigate('expandPost', {postId: item.id})}
                        />
                        <Text style={homeStyles.actionText}>{item.state?.comments || 0}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon="repeat-variant"
                            size={20}
                            onPress={() => Alert.alert("Repost", "Repost functionality is not implemented yet.")}
                        />
                        <Text style={homeStyles.actionText}>0</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon={item.userLiked ? "heart" : "heart-outline"}
                            size={20}
                            color={item.userLiked ? "red" : undefined}
                            onPress={() => handleLike(item.id, item.userLiked)}
                        />
                        <Text style={homeStyles.actionText}>{item.state?.likes || 0}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon="share-outline"
                            size={20}
                            onPress={() => Alert.alert("Share", "Share functionality is not implemented yet.")}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={homeStyles.container}>
            <ScrollView
                style={homeStyles.scrollView}
                contentContainerStyle={homeStyles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with centered logo */}
                <View style={homeStyles.header}>
                    <IconButton
                        icon="account-circle-outline"
                        size={30}
                        onPress={() => navigation.navigate('Profile')}
                    />
                    <Image
                        source={require("../assets/img/logoTW.png")}
                        style={homeStyles.logo}
                    />
                    <IconButton
                        icon="cog-outline"
                        size={30}
                        onPress={() => navigation.navigate('Settings')}
                    />
                </View>

                {/* NavBar "For you" / "Following" */}
                <View style={homeStyles.tabBar}>
                    <TouchableOpacity onPress={() => handleTabChange("For you")}>
                        <Text style={[
                            homeStyles.tab, 
                            activeTab === "For you" && homeStyles.activeTab
                        ]}>
                            For you
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabChange("Following")}>
                        <Text style={[
                            homeStyles.tab, 
                            activeTab === "Following" && homeStyles.activeTab
                        ]}>
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Message when there are no posts in "Following" */}
                {activeTab === "Following" && posts.length === 0 && !loading && (
                    <View style={homeStyles.emptyFollowing}>
                        <Text style={homeStyles.emptyFollowingTitle}>
                            No posts from people you follow
                        </Text>
                        <Text style={homeStyles.emptyFollowingText}>
                            When you follow people, you'll see their posts here.
                        </Text>
                        <TouchableOpacity 
                            style={homeStyles.exploreButton}
                            onPress={() => setActiveTab("For you")}
                        >
                            <Text style={homeStyles.exploreButtonText}>
                                Explore posts
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Feed */}
                {loading ? (
                    <ActivityIndicator size="large" color="#9e3d9c" style={{ marginVertical: 20 }} />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPost}
                        contentContainerStyle={homeStyles.feed}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#9e3d9c']}
                                tintColor="#9e3d9c"
                            />
                        }
                        ListEmptyComponent={
                            activeTab === "For you" ? (
                                <View style={homeStyles.emptyState}>
                                    <Text style={homeStyles.text}>No posts yet</Text>
                                    <Text style={homeStyles.text}>Be the first to post something</Text>
                                </View>
                            ) : null
                        }
                    />
                )}
            </ScrollView>

            {/* Bottom menu */}
            <View style={homeStyles.menu}>
                <IconButton
                    icon="home"
                    size={24}
                    color="#9e3d9c"
                    onPress={() => navigation.navigate('Home')}
                />
                <IconButton
                    icon="magnify"
                    size={24}
                    onPress={() => navigation.navigate('Search')}
                />
                <IconButton
                    icon="bell-outline"
                    size={24}
                />
                <IconButton
                    icon="email-outline"
                    size={24}
                />
            </View>

            {/* Floating button to create thread */}
            <FAB
                icon="feather"
                color="white"
                style={homeStyles.fabCreate}
                onPress={() => navigation.navigate('CreatePost')}
            />
        </View>
    );
}