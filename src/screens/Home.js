import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    ActivityIndicator
} from "react-native";
import { IconButton, FAB } from "react-native-paper";
import homeStyles from "../styles/homeStyles";
import { postService } from "../firebase/services/postService";
import Video from "react-native-video";
import { authService } from "../firebase/services/authService";

export default function Home({ navigation }) {
    const [activeTab, setActiveTab] = useState("For you");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    const POSTS_PER_PAGE = 10;
    const [page, setPage] = useState(1);

    // Avatar handler
    const getAvatarSource = (avatar) => {
        if (avatar && avatar !== "" && avatar !== "~") {
            return { uri: avatar };
        }
        return require("../assets/img/logoTWBlack.jpg");
    };

    // Change tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
        loadPosts(tab);
    };

    // Like/unlike
    const handleLike = async (postId, isCurrentlyLiked) => {
        try {
            const result = isCurrentlyLiked
                ? await postService.unlikePost(postId)
                : await postService.likePost(postId);

            if (result.success) {
                setPosts(prev =>
                    prev.map(post =>
                        post.id === postId
                            ? {
                                ...post,
                                userLiked: result.action === "liked",
                                state: {
                                    ...post.state,
                                    likes:
                                        (post.state?.likes || 0) +
                                        (result.action === "liked" ? 1 : -1)
                                }
                            }
                            : post
                    )
                );
            } else {
                Alert.alert("Error", result.error || "Failed to update like");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while updating the like");
        }
    };

    // Load posts
    const loadPosts = async (tab = activeTab) => {
        try {
            setLoading(true);

            let result =
                tab === "For you"
                    ? await postService.getPosts()
                    : await postService.getFollowingPosts();

            if (result.success) setPosts(result.data);
            else setPosts([]);
        } catch (e) {
            setPosts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh
    const onRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    // Paginated posts
    const paginatedPosts = posts.slice(
        (page - 1) * POSTS_PER_PAGE,
        page * POSTS_PER_PAGE
    );

    useEffect(() => {
        loadPosts();
    }, []);

    // Render each post
    const renderPost = ({ item }) => (
        <View style={homeStyles.post}>
            <Image
                source={getAvatarSource(item.authorAvatar)}
                style={homeStyles.avatar}
            />

            <View style={homeStyles.postContent}>
                <View style={homeStyles.postHeader}>
                    <Text style={homeStyles.name}>{item.authorName}</Text>
                    <Text style={homeStyles.username}>
                        @{item.authorUsername} · {item.time}
                    </Text>
                </View>

                <Text style={homeStyles.text}>{item.content}</Text>

                {/* Media */}
                {item.mediaUrl &&
                    (item.mediaUrl.includes("video") ? (
                        <Video
                            source={{ uri: item.mediaUrl }}
                            style={{
                                width: "100%",
                                height: 250,
                                borderRadius: 12,
                                marginTop: 10
                            }}
                            controls
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={{ uri: item.mediaUrl }}
                            style={{
                                width: "100%",
                                height: 250,
                                borderRadius: 12,
                                marginTop: 10
                            }}
                        />
                    ))}

                {/* Buttons */}
                <View style={homeStyles.actions}>
                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon="comment-outline"
                            size={20}
                            onPress={() =>
                                navigation.navigate("ExpandPost", {
                                    postId: item.id
                                })
                            }
                        />
                        <Text style={homeStyles.actionText}>
                            {item.state?.comments || 0}
                        </Text>
                    </View>

                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon="repeat-variant"
                            size={20}
                            onPress={() => Alert.alert("Repost", "Repost functionality is not implemented yet.")}
                        />
                        <Text style={homeStyles.actionText}>
                            {item.state?.retweets || 0}
                        </Text>
                    </View>

                    <View style={homeStyles.actionItem}>
                        <IconButton
                            icon={item.userLiked ? "heart" : "heart-outline"}
                            size={20}
                            color={item.userLiked ? "red" : undefined}
                            onPress={() =>
                                handleLike(item.id, item.userLiked)
                            }
                        />
                        <Text style={homeStyles.actionText}>
                            {item.state?.likes || 0}
                        </Text>
                    </View>

                    <View style={homeStyles.actionItem}>
                        <IconButton icon="share-outline" 
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
            {/* Main FlatList */}
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#9e3d9c"
                    style={{ marginTop: 30 }}
                />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={paginatedPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={homeStyles.feed}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#9e3d9c"]}
                            tintColor="#9e3d9c"
                        />
                    }
                    ListHeaderComponent={
                        <>
                            {/* Header */}
                            <View style={homeStyles.header}>
                                <IconButton
                                    icon="account-circle-outline"
                                    size={30}
                                    onPress={() =>
                                        navigation.navigate("Profile", { userId: authService.getCurrentUser().uid })
                                    }
                                />
                                <Image
                                    source={require("../assets/img/logoTW.png")}
                                    style={homeStyles.logo}
                                />
                                <IconButton
                                    icon="cog-outline"
                                    size={30}
                                    onPress={() =>
                                        navigation.navigate("Settings")
                                    }
                                />
                            </View>

                            {/* Tabs */}
                            <View style={homeStyles.tabBar}>
                                <TouchableOpacity
                                    onPress={() => handleTabChange("For you")}
                                >
                                    <Text
                                        style={[
                                            homeStyles.tab,
                                            activeTab === "For you" &&
                                            homeStyles.activeTab
                                        ]}
                                    >
                                        For you
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        handleTabChange("Following")
                                    }
                                >
                                    <Text
                                        style={[
                                            homeStyles.tab,
                                            activeTab === "Following" &&
                                            homeStyles.activeTab
                                        ]}
                                    >
                                        Following
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Empty Following */}
                            {activeTab === "Following" &&
                                posts.length === 0 && (
                                    <View style={homeStyles.emptyFollowing}>
                                        <Text
                                            style={
                                                homeStyles.emptyText
                                            }
                                        >
                                            No posts from people you follow
                                        </Text>
                                        <Text
                                            style={
                                                homeStyles.emptyFollowingText
                                            }
                                        >
                                            When you follow people, you'll see
                                            their posts here.
                                        </Text>
                                        <TouchableOpacity
                                            style={homeStyles.exploreButton}
                                            onPress={() =>
                                                setActiveTab("For you")
                                            }
                                        >
                                            <Text
                                                style={
                                                    homeStyles.exploreButtonText
                                                }
                                            >
                                                Explore posts
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                        </>
                    }
                    ListFooterComponent={
                        <View style={homeStyles.paginationContainer}>
                            {/* Previous */}
                            <TouchableOpacity
                                disabled={page === 1}
                                onPress={() => setPage((prev) => prev - 1)}
                                style={[
                                    homeStyles.paginationButton,
                                    page === 1 &&
                                    homeStyles.paginationButtonDisabled
                                ]}
                            >
                                <Text
                                    style={[
                                        homeStyles.paginationButtonText,
                                        page === 1 &&
                                        homeStyles.paginationButtonTextDisabled
                                    ]}
                                >
                                    Previous
                                </Text>
                            </TouchableOpacity>

                            <Text style={homeStyles.paginationText}>
                                Page {page}
                            </Text>

                            {/* Next */}
                            <TouchableOpacity
                                disabled={
                                    page * POSTS_PER_PAGE >= posts.length
                                }
                                onPress={() => setPage((prev) => prev + 1)}
                                style={[
                                    homeStyles.paginationButton,
                                    page * POSTS_PER_PAGE >= posts.length &&
                                    homeStyles.paginationButtonDisabled
                                ]}
                            >
                                <Text
                                    style={[
                                        homeStyles.paginationButtonText,
                                        page * POSTS_PER_PAGE >= posts.length &&
                                        homeStyles.paginationButtonTextDisabled
                                    ]}
                                >
                                    Next
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            {/* Bottom menu */}
            <View style={homeStyles.menu}>
                <IconButton
                    icon="home"
                    size={24}
                    color="#9e3d9c"
                    onPress={() => navigation.navigate("Home")}
                />
                <IconButton
                    icon="magnify"
                    size={24}
                    onPress={() => navigation.navigate("Search")}
                />
                <IconButton icon="bell-outline" size={24} 
                    onPress={() => Alert.alert("Notifications", "Notifications functionality is not implemented yet.")}
                />
                <IconButton icon="email-outline" size={24} 
                    onPress={() => Alert.alert("Message", "Message functionality is not implemented yet.")}
                />
            </View>

            {/* Floating Button */}
            <FAB
                icon="feather"
                color="white"
                style={homeStyles.fabCreate}
                onPress={() => navigation.navigate("CreatePost")}
            />
        </View>
    );
}
