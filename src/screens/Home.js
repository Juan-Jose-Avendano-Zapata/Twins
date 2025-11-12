import React, { useState, useRef, useEffect } from "react";
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

export default function Home( {navigation} ) {
    const [activeTab, setActiveTab] = useState("For you");
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    // Load user data and posts
    useEffect(() => {
        loadUserData();
        setupPostsListener();
    }, []);

    const loadUserData = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                const profile = await authService.getUserProfile(currentUser.uid);
                if (profile.success) {
                    setUserProfile(profile.data);
                }
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    // Configure real-time listener for posts
    const setupPostsListener = () => {
        try {
            const unsubscribe = postService.getPostsRealtime((postsData) => {
                setPosts(postsData);
                setLoading(false);
            });
            
            return unsubscribe;
        } catch (error) {
            console.error("Error setting up posts listener:", error);
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Reload posts and user data
        loadUserData().then(() => {
            setRefreshing(false);
        });
    };

    const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    // Handle like action
    const handleLike = async (postId) => {
        try {
            const result = await postService.likePost(postId);
            if (!result.success) {
                Alert.alert("Error", "The post could not be liked: " + result.error);
            }
        } catch (error) {
            Alert.alert("Error", "Error liking post");
        }
    };

    const renderPost = ({ item }) => (
        <View style={homeStyles.post}>
            <Image 
                source={ item.authorAvatar } 
                style={homeStyles.avatar}
            />
            <View style={homeStyles.postContent}>
                <View style={homeStyles.postHeader}>
                    <Text style={homeStyles.name}>{item.authorName}</Text>
                    <Text style={homeStyles.username}>@{item.authorUsername} · {item.time}</Text>
                </View>
                <Text style={homeStyles.text}>{item.content}</Text>
                {item.image && item.image !== "" && (
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
                            onPress={() => navigation.navigate('Comments', { postId: item.id })}
                        />
                        <Text style={homeStyles.actionText}>{item.state?.comments || 0}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="repeat-variant" size={20} />
                        <Text style={homeStyles.actionText}>{item.state?.retweets || 0}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton 
                            icon={item.userLiked ? "heart" : "heart-outline"} 
                            size={20} 
                            onPress={() => handleLike(item.id)}
                            color={item.userLiked ? "red" : undefined}
                        />
                        <Text style={homeStyles.actionText}>{item.state?.likes || 0}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="share-outline" size={20} />
                    </View>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[homeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#9e3d9c" />
                <Text style={{ color: 'white', marginTop: 10 }}>Loading posts...</Text>
            </View>
        );
    }

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
                    <TouchableOpacity onPress={() => setActiveTab("For you")}>
                        <Text style={[homeStyles.tab, activeTab === "For you" && homeStyles.activeTab]}>
                            For you
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("Following")}>
                        <Text style={[homeStyles.tab, activeTab === "Following" && homeStyles.activeTab]}>
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Feed */}
                <FlatList
                    ref={flatListRef}
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    contentContainerStyle={homeStyles.feed}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={homeStyles.emptyState}>
                            <Text style={homeStyles.emptyStateText}>No posts yet</Text>
                            <Text style={homeStyles.emptyStateSubtext}>Be the first to post something</Text>
                        </View>
                    }
                />
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
                <IconButton icon="bell-outline" size={24} />
                <IconButton icon="email-outline" size={24} />
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