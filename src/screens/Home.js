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
import Video from "react-native-video";

export default function Home({ navigation }) {
    const [activeTab, setActiveTab] = useState("For you");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    // Get avatar source
    const getAvatarSource = (avatar) => {
        if (avatar && avatar !== "" && avatar !== "~") {
            return { uri: avatar };
        }
        return require("../assets/img/logoTWBlack.jpg");
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        loadPosts(tab);
    };

    // Handle like/unlike
    const handleLike = async (postId, isCurrentlyLiked) => {
        try {
            let result;
            if (isCurrentlyLiked) {
                result = await postService.unlikePost(postId);
            } else {
                result = await postService.likePost(postId);
            }

            if (result.success) {
                // Update local state
                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post.id === postId) {
                            const likeChange = result.action === 'liked' ? 1 : -1;
                            return {
                                ...post,
                                userLiked: result.action === 'liked',
                                state: {
                                    ...post.state,
                                    likes: (post.state?.likes || 0) + likeChange
                                }
                            };
                        }
                        return post;
                    })
                );
            } else {
                Alert.alert("Error", result.error || "Failed to update like");
            }
        } catch (error) {
            console.error("Error handling like:", error);
            Alert.alert("Error", "An error occurred while updating the like");
        }
    };

    // Load posts based on active tab
    const loadPosts = async (tab = activeTab) => {
        try {
            setLoading(true);
            let result;

            if (tab === "For you") {
                result = await postService.getPosts();
            } else {
                // For Following tab, you'll need to implement getFollowingPosts in postService
                result = await postService.getFollowingPosts();
            }

            if (result.success) {
                setPosts(result.data);
            } else {
                Alert.alert("Error", result.error || "Failed to load posts");
                setPosts([]);
            }
        } catch (error) {
            console.error("Error loading posts:", error);
            Alert.alert("Error", "An error occurred while loading posts");
            setPosts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh function
    const onRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    // Initial load
    useEffect(() => {
        loadPosts();
    }, []);

    // Render individual post
    const renderPost = ({ item }) => (
        <View style={homeStyles.post}>
            <Image
                source={getAvatarSource(item.authorAvatar)}
                style={homeStyles.avatar}
            />
            <View style={homeStyles.postContent}>
                <View style={homeStyles.postHeader}>
                    <Text style={homeStyles.name}>{item.authorName}</Text>
                    <Text style={homeStyles.username}> @{item.authorUsername} · {item.time}</Text>
                </View>
                <Text style={homeStyles.text}>{item.content}</Text>

                {/* Here we show the average */}
                {item.image ? (
                    item.image.includes("video") ? (
                        <Video
                            source={{ uri: item.image }}
                            style={{ width: "100%", height: 250, borderRadius: 12, marginTop: 10 }}
                            controls
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: "100%", height: 250, borderRadius: 12, marginTop: 10 }}
                        />
                    )
                ) : null}

                <View style={homeStyles.actions}>
                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon="comment-outline"
                            size={20}
                            onPress={() => navigation.navigate('ExpandPost', { postId: item.id })}
                        />
                        <Text style={homeStyles.actionText}>{item.state?.comments || 0}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon="repeat-variant"
                            size={20}
                            onPress={() => Alert.alert("Repost", "Repost functionality is not implemented yet.")}
                        />
                        <Text style={homeStyles.actionText}>{item.state?.retweets || 0}</Text>
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