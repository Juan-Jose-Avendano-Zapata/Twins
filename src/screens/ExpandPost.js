import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert, ScrollView, RefreshControl } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import homeStyles from "../styles/homeStyles";
import { postService } from "../firebase/services/postService";
import Video from "react-native-video";

export default function ExpandPost({ navigation, route }) {
    const { postId } = route.params;
    const [item, setItem] = useState({
        id: "",
        authorAvatar: "",
        authorName: "",
        authorUsername: "",
        time: "",
        content: "",
        mediaUrl: "",
        state: {
            comments: 0,
            likes: 0,
            retweets: 0,
        },
        userLiked: false,
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [commentLoading, setCommentLoading] = useState(false);

    // Load specific post
    const loadPost = async () => {
        try {
            setLoading(true);
            const result = await postService.getPostById(postId);

            if (result.success) {
                setItem(result.data);
            } else {
                Alert.alert("Error", result.error || "Failed to load post");
            }
        } catch (error) {
            console.error("Error loading post:", error);
            Alert.alert("Error", "An error occurred while loading the post");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load comments for the post
    const loadComments = async () => {
        try {
            const result = await postService.getCommentsByPostId(postId);
            if (result.success) {
                const commentsWithAuthorInfo = await Promise.all(
                    result.data.map(async (comment) => {
                        const authorInfo = await postService.getAuthorInfo(comment.authorId);
                        return {
                            ...comment,
                            ...authorInfo,
                            userLiked: false,
                        };
                    })
                );
                setComments(commentsWithAuthorInfo);
            } else {
                Alert.alert("Error", result.error || "Failed to load comments");
            }
        } catch (error) {
            console.error("Error loading comments:", error);
            Alert.alert("Error", "An error occurred while loading comments");
        }
    };

    // Handle refresh
    const onRefresh = () => {
        setRefreshing(true);
        loadPost();
        loadComments();
    };

    // Load post and comments on component mount
    useEffect(() => {
        loadPost();
        loadComments();
    }, [postId]);

    // Handle like/unlike for post
    const handleLike = async (postId, isCurrentlyLiked) => {
        try {
            let result;
            if (isCurrentlyLiked) {
                result = await postService.unlikePost(postId);
            } else {
                result = await postService.likePost(postId);
            }

            if (result.success) {
                setItem(prevItem => {
                    const likeChange = result.action === 'liked' ? 1 : -1;
                    return {
                        ...prevItem,
                        userLiked: result.action === 'liked',
                        state: {
                            ...prevItem.state,
                            likes: (prevItem.state?.likes || 0) + likeChange
                        }
                    };
                });
            } else {
                Alert.alert("Error", result.error || "Failed to update like");
            }
        } catch (error) {
            console.error("Error handling like:", error);
            Alert.alert("Error", "An error occurred while updating the like");
        }
    };

    // Handle add comment
    const handleAddComment = async () => {
        if (commentText.trim() === "") {
            Alert.alert("Error", "Comment cannot be empty");
            return;
        }

        try {
            setCommentLoading(true);
            const result = await postService.createComment(postId, commentText.trim());

            if (result.success) {
                setCommentText("");
                await loadComments();
                
                setItem(prevItem => ({
                    ...prevItem,
                    state: {
                        ...prevItem.state,
                        comments: (prevItem.state?.comments || 0) + 1
                    }
                }));

                Alert.alert("Success", "Comment added successfully");
            } else {
                Alert.alert("Error", result.error || "Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            Alert.alert("Error", "An error occurred while adding the comment");
        } finally {
            setCommentLoading(false);
        }
    };

    // Get avatar source
    const getAvatarSource = (avatar) => {
        if (avatar && avatar !== "" && avatar !== "~") {
            return { uri: avatar };
        }
        return require("../assets/img/logoTWBlack.jpg");
    };

    // Check if media is video
    const isVideo = (url) => {
        return url && (url.includes("video") || url.includes(".mp4") || url.includes(".mov") || url.includes(".avi"));
    };

    if (loading) {
        return (
            <View style={[homeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading post...</Text>
            </View>
        );
    }

    return (
        <View style={homeStyles.container}>
            {/* Header */}
            <View style={homeStyles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
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

            <ScrollView 
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Post */}
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

                        {/* Media display */}
                        {item.mediaUrl ? (
                            isVideo(item.mediaUrl) ? (
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
                                        marginTop: 10,
                                    }}
                                    resizeMode="cover"
                                />
                            )
                        ) : null}

                        <View style={homeStyles.actions}>
                            <View style={homeStyles.actionItem}>
                                <IconButton
                                    icon="comment-outline"
                                    size={20}
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

                {/* Comments section */}
                <View style={[homeStyles.post, { borderTopWidth: 1, borderTopColor: '#e0e0e0', backgroundColor: homeStyles.backgroundColor }]}>
                    <View style={homeStyles.postContent}>
                        <Text style={[homeStyles.name, { marginBottom: 16 }]}>Comments ({comments.length})</Text>
                        
                        {/* Comment Input */}
                        <View style={{ marginBottom: 20 }}>
                            <TextInput
                                mode="outlined"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChangeText={setCommentText}
                                style={{ backgroundColor: homeStyles.input }}
                                multiline
                                disabled={commentLoading}
                                right={
                                    <TextInput.Icon 
                                        icon={commentLoading ? "clock-outline" : "send"} 
                                        onPress={handleAddComment}
                                        disabled={commentText.trim() === "" || commentLoading}
                                    />
                                }
                            />
                        </View>

                        {/* Comments List */}
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <View key={comment.id} style={[homeStyles.post, { marginBottom: 12, padding: 12, backgroundColor: homeStyles.backgroundColor }]}>
                                    <Image
                                        source={getAvatarSource(comment.authorAvatar)}
                                        style={homeStyles.avatar}
                                    />
                                    <View style={homeStyles.postContent}>
                                        <View style={homeStyles.postHeader}>
                                            <Text style={homeStyles.name}>{comment.authorName}</Text>
                                            <Text style={homeStyles.username}>@{comment.authorUsername} · {comment.time}</Text>
                                        </View>
                                        <Text style={homeStyles.text}>{comment.content}</Text>
                                        
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={[homeStyles.post, { padding: 20, alignItems: 'center', backgroundColor: homeStyles.backgroundColor }]}>
                                <Text style={[homeStyles.text, { textAlign: 'center', color: '#666' }]}>
                                    No comments yet. Be the first to comment!
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}