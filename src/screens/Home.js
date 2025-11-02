import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { IconButton, FAB } from "react-native-paper";
import homeStyles from "../styles/homeStyles";

// Mock post data
const posts = [
    {
        id: "1",
        name: "Official Twins",
        username: "@twins",
        time: "2h",
        content: "Welcome to Twins, the new social media app for everyone! 🚀🎉",
        image: "https://placekitten.com/400/300",
        comments: 12,
        retweets: 8,
        likes: 42,
    },
    {
        id: "2",
        name: "Dev Twins 1",
        username: "@devtwins1",
        time: "4h",
        content: "Let's go",
        image: null,
        comments: 4,
        retweets: 2,
        likes: 18,
    },
];

export default function Home( {navigation} ) {
    const [activeTab, setActiveTab] = useState("For you");
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const renderPost = ({ item }) => (
        <View style={homeStyles.post}>
            <Image source={require('../assets/img/logoTW.png')} style={homeStyles.avatar} />
            <View style={homeStyles.postContent}>
                <View style={homeStyles.postHeader}>
                    <Text style={homeStyles.name}>{item.name}</Text>
                    <Text style={homeStyles.username}> {item.username} · {item.time}</Text>
                </View>
                <Text style={homeStyles.text}>{item.content}</Text>
                {item.image && (
                    <Image source={require('../assets/img/logoTWBlack.jpg')} style={homeStyles.postImage} />
                )}
                <View style={homeStyles.actions}>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="comment-outline" size={20} />
                        <Text style={homeStyles.actionText}>{item.comments}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="repeat-variant" size={20} />
                        <Text style={homeStyles.actionText}>{item.retweets}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="heart-outline" size={20} />
                        <Text style={homeStyles.actionText}>{item.likes}</Text>
                    </View>
                    <View style={homeStyles.actionItem}>
                        <IconButton icon="share-outline" size={20} />
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
                    <IconButton icon="account-circle-outline" size={30} onPress={ () => navigation.navigate('Profile')}/>
                    <Image
                        source={require("../assets/img/logoTW.png")}
                        style={homeStyles.logo}
                    />
                    <IconButton icon="cog-outline" size={30} onPress={ () => navigation.navigate('Settings')}/>
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
                />
            </ScrollView>

            {/* Bottom menu */}
            <View style={homeStyles.menu}>
                <IconButton icon="home" size={24} onPress={ () => navigation.navigate('Home')}/>
                <IconButton icon="magnify" size={24} onPress={ () => navigation.navigate('Search')}/>
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