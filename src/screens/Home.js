import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Modal,
} from "react-native";
import { IconButton, FAB } from "react-native-paper";
import homeStyles from "../styles/homeStyles";
import followStyles from "../styles/followStyles";

const initialPosts = [
    {
        id: "1",
        name: "Official Twins",
        username: "@twins",
        time: "19 Oct 25",
        content: "Welcome to Twins, the new social media app for everyone! 🚀🎉",
        image: require("../assets/img/logoTWBlack.jpg"),
        comments: 12,
        retweets: 8,
        likes: 42,
        isFollowing: true,
    },
    {
        id: "2",
        name: "Dev Twin s 1",
        username: "@devtwins1",
        time: "20 Oct 25",
        content: "Let's go build something amazing today 💻✨",
        image: null,
        comments: 4,
        retweets: 2,
        likes: 18,
        isFollowing: false,
    },
];

export default function Home({ navigation }) {
    const [activeTab, setActiveTab] = useState("For you");
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState(initialPosts);
    const [selectedPost, setSelectedPost] = useState(null);
    const flatListRef = useRef(null);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const toggleFollow = (postId) => {
        const updated = posts.map((post) =>
            post.id === postId ? { ...post, isFollowing: !post.isFollowing } : post
        );
        setPosts(updated);
        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost({ ...selectedPost, isFollowing: !selectedPost.isFollowing });
        }
    };

    const renderPost = ({ item }) => (
        <View style={homeStyles.post}>
            <Image source={require("../assets/img/logoTW.png")} style={homeStyles.avatar} />

            <View style={homeStyles.postContent}>
                <View style={homeStyles.postHeader}>
                    <Text style={homeStyles.name}>{item.name}</Text>
                    <Text style={homeStyles.username}>
                        {" "}{item.username} · {item.time}
                    </Text>
                </View>

                {/* Only this area opens the modal */}
                <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedPost(item)}>
                    <Text style={homeStyles.text}>{item.content}</Text>
                    {item.image && <Image source={item.image} style={homeStyles.postImage} />}
                </TouchableOpacity>

                {/* Action buttons remain functional */}
                <View style={homeStyles.actions}>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="comment-outline" size={20} onPress={() => console.log("Comment", item.id)} />
                        <Text style={homeStyles.actionText}>{item.comments}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="repeat-variant" size={20} onPress={() => console.log("Retweet", item.id)} />
                        <Text style={homeStyles.actionText}>{item.retweets}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="heart-outline" size={20} onPress={() => console.log("Like", item.id)} />
                        <Text style={homeStyles.actionText}>{item.likes}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="share-outline" size={20} onPress={() => console.log("Share", item.id)} />
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
                {/* Header */}
                <View style={homeStyles.header}>
                    <IconButton
                        icon="account-circle-outline"
                        size={30}
                        onPress={() => navigation.navigate("Profile")}
                    />
                    <Image
                        source={require("../assets/img/logoTW.png")}
                        style={homeStyles.logo}
                    />
                    <IconButton
                        icon="cog-outline"
                        size={30}
                        onPress={() => navigation.navigate("Settings")}
                    />
                </View>

                {/* Tabs */}
                <View style={homeStyles.tabBar}>
                    <TouchableOpacity onPress={() => setActiveTab("For you")}>
                        <Text
                            style={[
                                homeStyles.tab,
                                activeTab === "For you" && homeStyles.activeTab,
                            ]}
                        >
                            For you
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("Following")}>
                        <Text
                            style={[
                                homeStyles.tab,
                                activeTab === "Following" && homeStyles.activeTab,
                            ]}
                        >
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
                />
            </ScrollView>

            {/* Bottom Menu */}
            <View style={homeStyles.menu}>
                <IconButton icon="home" size={24} onPress={() => navigation.navigate("Home")} />
                <IconButton icon="magnify" size={24} onPress={() => navigation.navigate("Search")} />
                <IconButton icon="bell-outline" size={24} />
            </View>

            {/* Floating Button */}
            <FAB
                icon="feather"
                color="white"
                style={homeStyles.fabCreate}
                onPress={() => navigation.navigate("CreatePost")}
            />

            {/* Post Detail Modal (uses same homeStyles) */}
            <Modal
                visible={!!selectedPost}
                animationType="slide"
                onRequestClose={() => setSelectedPost(null)}
            >
                <View style={homeStyles.container}>
                    {/* Header */}
                    <View style={homeStyles.header}>
                        <IconButton
                            icon="arrow-left"
                            size={28}
                            onPress={() => setSelectedPost(null)}
                        />
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Text style={homeStyles.name}>Post</Text>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    {selectedPost && (
                        <ScrollView
                            style={homeStyles.scrollView}
                            contentContainerStyle={{ padding: 16 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* User Info */}
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                <Image
                                    source={require("../assets/img/logoTW.png")}
                                    style={homeStyles.avatar}
                                />
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Text style={homeStyles.name}>{selectedPost.name}</Text>
                                    <Text style={homeStyles.username}>{selectedPost.username}</Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        followStyles.followButton,
                                        selectedPost.isFollowing && followStyles.followingButton,
                                    ]}
                                    onPress={() => toggleFollow(selectedPost.id)}
                                >
                                    <Text
                                        style={[
                                            followStyles.followButtonText,
                                            selectedPost.isFollowing && followStyles.followingButtonText,
                                        ]}
                                    >
                                        {selectedPost.isFollowing ? "Following" : "Follow"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Content */}
                            <Text style={homeStyles.text}>{selectedPost.content}</Text>

                            {selectedPost.image && (
                                <Image
                                    source={selectedPost.image}
                                    style={homeStyles.postImage}
                                />
                            )}

                            {/* Time */}
                            <Text style={[homeStyles.username, { marginTop: 8 }]}>
                                {selectedPost.time}
                            </Text>

                            {/* Divider */}
                            <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#ccc", marginVertical: 10 }} />

                            {/* Actions with same style */}
                            <View style={homeStyles.actions}>
                                <View style={homeStyles.actionItem}>
                                    <IconButton icon="comment-outline" size={22} />
                                    <Text style={homeStyles.actionText}>{selectedPost.comments}</Text>
                                </View>
                                <View style={homeStyles.actionItem}>
                                    <IconButton icon="repeat-variant" size={22} />
                                    <Text style={homeStyles.actionText}>{selectedPost.retweets}</Text>
                                </View>
                                <View style={homeStyles.actionItem}>
                                    <IconButton icon="heart-outline" size={22} />
                                    <Text style={homeStyles.actionText}>{selectedPost.likes}</Text>
                                </View>
                                <View style={homeStyles.actionItem}>
                                    <IconButton icon="share-outline" size={22} />
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
}
