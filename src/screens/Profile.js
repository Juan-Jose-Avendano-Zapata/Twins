import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { IconButton, FAB } from "react-native-paper";
import profileStyles from "../styles/profileStyles";
import followStyles from "../styles/followStyles";
import { userService } from "../firebase/services/userService";
import { postService } from "../firebase/services/postService";
import { authService } from "../firebase/services/authService";
import Video from "react-native-video";

export default function Profile({ navigation, route }) {
    const { userId } = route.params || {};
    const [refreshing, setRefreshing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        avatar: "",
        createdAt: "",
        followingCount: 0,
        followersCount: 0,
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const flatListRef = useRef(null);

    // Check if current user is following this profile
    const checkIfFollowing = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser || !userId || userId === currentUser.uid) return;

            const result = await userService.getFollowingList(currentUser.uid);
            if (result.success) {
                const isUserFollowing = result.data.some(user => user.id === userId);
                setIsFollowing(isUserFollowing);
            }
        } catch (error) {
            console.error("Error checking follow status:", error);
        }
    };

    // Load profile data
    const loadProfileData = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            let uid = userId;
            if (!uid) {
                if (!currentUser) return;
                uid = currentUser.uid;
            }

            const userProfile = await userService.getUserProfile(uid);
            if (!userProfile.success) return;

            const data = userProfile.data;
            const profile = data.profile || {};
            const stats = data.stats || {};

            let createdAt = "";
            if (profile.createdAt?.toDate) {
                createdAt = profile.createdAt.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                });
            }

            setProfileData({
                name: profile.name || "",
                username: data.username || "",
                avatar: profile.avatar || "",
                createdAt: createdAt,
                followingCount: stats.followingCount ?? data.following?.length ?? 0,
                followersCount: stats.followersCount ?? data.followers?.length ?? 0,
            });

        } catch (error) {
            console.error("Error loading profile data:", error);
            Alert.alert("Error", "Failed to load profile data");
        }
    };

    // Load posts
    const loadPosts = async () => {
        try {
            setLoading(true);
            let postsResult;
            const currentUser = authService.getCurrentUser();
            if (userId && userId !== currentUser.uid) {
                postsResult = await postService.getPostsByUser(userId);
            } else {
                postsResult = await postService.getPostsOwnPosts();
            }

            if (postsResult.success) {
                setPosts(postsResult.data);
            } else {
                Alert.alert("Error", postsResult.error || "Failed to load posts");
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

    // Handle follow/unfollow
    const toggleFollow = async () => {
        try {
            setFollowLoading(true);
            const currentUser = authService.getCurrentUser();
            
            if (!currentUser) {
                Alert.alert("Error", "You must be logged in to follow users");
                return;
            }

            if (isFollowing) {
                await userService.unfollowUser(userId);
                setIsFollowing(false);
                // Update followers count
                setProfileData(prev => ({
                    ...prev,
                    followersCount: Math.max(0, prev.followersCount - 1)
                }));
            } else {
                await userService.followUser(userId);
                setIsFollowing(true);
                // Update followers count
                setProfileData(prev => ({
                    ...prev,
                    followersCount: prev.followersCount + 1
                }));
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            Alert.alert("Error", "Failed to update follow status");
        } finally {
            setFollowLoading(false);
        }
    };

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        Promise.all([loadProfileData(), loadPosts(), checkIfFollowing()]).finally(() => setRefreshing(false));
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

    // Get avatar source
    const getAvatarSource = (avatar) => {
        if (avatar && avatar !== "" && avatar !== "~") {
            return { uri: avatar };
        }
        return require("../assets/img/logoTWBlack.jpg");
    };

    // Initial load
    useEffect(() => {
        loadProfileData();
        loadPosts();
        
        if (userId) {
            checkIfFollowing();
        } else {
            // Clean user data only for own profile
            const cleanData = async () => {
                const current = authService.getCurrentUser();
                if (current) {
                    await userService.cleanUserFollowData(current.uid);
                    console.log("Clean Data");
                }
            };
            cleanData();
        }
    }, [userId]);

    // Render individual post
    const renderPost = ({ item }) => (
        <View style={profileStyles.post}>
            <Image
                source={getAvatarSource(item.authorAvatar)}
                style={profileStyles.avatar}
            />
            <View style={profileStyles.postContent}>
                <View style={profileStyles.postHeader}>
                    <Text style={profileStyles.name}>{item.authorName}</Text>
                    <Text style={profileStyles.username}> @{item.authorUsername} · {item.time}</Text>
                </View>
                <Text style={profileStyles.text}>{item.content}</Text>

                {item.mediaUrl ? (
                    item.mediaUrl.includes("video") ? (
                        <Video
                            source={{ uri: item.mediaUrl }}
                            style={{ width: "100%", height: 250, borderRadius: 12, marginTop: 10 }}
                            controls
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={{ uri: item.mediaUrl }}
                            style={{ width: "100%", height: 250, borderRadius: 12, marginTop: 10 }}
                        />
                    )
                ) : null}

                <View style={profileStyles.actions}>
                    <View style={profileStyles.actionItem}>
                        <IconButton
                            icon="comment-outline"
                            size={20}
                            onPress={() => navigation.navigate('ExpandPost', { postId: item.id })}
                        />
                        <Text style={profileStyles.actionText}>{item.state?.comments || 0}</Text>
                    </View>
                    <View style={profileStyles.actionItem}>
                        <IconButton
                            icon="repeat-variant"
                            size={20}
                            onPress={() => Alert.alert("Repost", "Repost functionality is not implemented yet.")}
                        />
                        <Text style={profileStyles.actionText}>{item.state?.retweets || 0}</Text>
                    </View>
                    <View style={profileStyles.actionItem}>
                        <IconButton
                            icon={item.userLiked ? "heart" : "heart-outline"}
                            size={20}
                            color={item.userLiked ? "red" : undefined}
                            onPress={() => handleLike(item.id, item.userLiked)}
                        />
                        <Text style={profileStyles.actionText}>{item.state?.likes || 0}</Text>
                    </View>
                    <View style={profileStyles.actionItem}>
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

    const currentUser = authService.getCurrentUser();
    const isOwnProfile = !userId || userId === currentUser?.uid;

    return (
        <View style={profileStyles.container}>
            <ScrollView
                style={profileStyles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Profile Header */}
                <View style={profileStyles.headerContainer}>
                    {/* Cover Photo and Back Button */}
                    <View style={profileStyles.coverPhotoContainer}>
                        <Image
                            source={require('../assets/img/logoTWBlack.jpg')}
                            style={profileStyles.coverPhoto}
                        />
                        <View style={profileStyles.headerActions}>
                            <IconButton
                                icon="arrow-left"
                                size={24}
                                onPress={() => navigation.goBack()}
                                style={profileStyles.headerButton}
                            />
                            {!userId && (
                                <IconButton
                                    icon="cog-outline"
                                    size={24}
                                    onPress={() => navigation.navigate('Settings')}
                                    style={profileStyles.headerButton}
                                />
                            )}
                        </View>
                    </View>

                    {/* Profile Info Section */}
                    <View style={profileStyles.profileInfoContainer}>
                        <View style={profileStyles.profileImageContainer}>
                            <Image
                                source={getAvatarSource(profileData.avatar)}
                                style={profileStyles.profileImage}
                            />
                        </View>

                        {/* Edit Profile or Follow Button */}
                        <View style={profileStyles.editProfileButton}>
                            {isOwnProfile ? (
                                <TouchableOpacity
                                    style={profileStyles.editProfileTouchable}
                                    onPress={() => navigation.navigate('EditProfile')}
                                >
                                    <Text style={profileStyles.editProfileText}>Edit profile</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        followStyles.followButton,
                                        isFollowing && followStyles.followingButton,
                                    ]}
                                    onPress={toggleFollow}
                                    disabled={followLoading}
                                >
                                    <Text
                                        style={[
                                            followStyles.followButtonText,
                                            isFollowing && followStyles.followingButtonText,
                                        ]}
                                    >
                                        {followLoading ? "Loading..." : (isFollowing ? "Followed" : "Follow")}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={profileStyles.userInfoContainer}>
                            <Text style={profileStyles.userName}>{profileData.name}</Text>
                            <Text style={profileStyles.userUsername}>@{profileData.username}</Text>

                            <View style={profileStyles.additionalInfoContainer}>
                                <View style={profileStyles.infoItem}>
                                    <IconButton icon="calendar" size={16} />
                                    <Text style={profileStyles.infoText}>Joined {profileData.createdAt}</Text>
                                </View>
                            </View>

                            <View style={profileStyles.followStatsContainer}>
                                <TouchableOpacity
                                    style={profileStyles.followStat}
                                    onPress={() => navigation.navigate('ListFollow', { initialTab: 'followers', userId: userId || currentUser?.uid })}
                                >
                                    <Text style={profileStyles.followCount}>{profileData.followersCount}</Text>
                                    <Text style={profileStyles.followLabel}>Followers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={profileStyles.followStat}
                                    onPress={() => navigation.navigate('ListFollow', { initialTab: 'following', userId: userId || currentUser?.uid })}
                                >
                                    <Text style={profileStyles.followCount}>{profileData.followingCount}</Text>
                                    <Text style={profileStyles.followLabel}>Following</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={profileStyles.dividerContainer}>
                                <View style={profileStyles.dividerLine} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Posts Feed */}
                {loading ? (
                    <View style={profileStyles.loadingContainer}>
                        <Text>Loading posts...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPost}
                        scrollEnabled={false}
                        contentContainerStyle={profileStyles.feed}
                        ListEmptyComponent={
                            <View style={profileStyles.emptyContainer}>
                                <Text style={profileStyles.emptyText}>No posts yet</Text>
                                <Text style={profileStyles.emptySubtext}>When you create posts, they'll appear here.</Text>
                            </View>
                        }
                    />
                )}

            </ScrollView>

            {/* Floating button to create (only for own profile) */}
            {isOwnProfile && (
                <FAB
                    icon="feather"
                    color="white"
                    style={profileStyles.fabCreate}
                    onPress={() => navigation.navigate('CreatePost')}
                />
            )}
        </View>
    );
}