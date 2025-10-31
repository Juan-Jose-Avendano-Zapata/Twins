import React, { useState, useRef } from "react";
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity, RefreshControl, } from "react-native";
import { IconButton, FAB } from "react-native-paper";
import profileStyles from "../styles/profileStyles";

// Mock post data
const profilePosts = [
    {
        id: "1",
        name: "Official Twins",
        username: "@twins",
        time: "2h",
        content: "Welcome to Twins, the new social media app for everyone! 🚀🎉",
        image: "https://placekitten.com/400/300",
        comments: 5,
        retweets: 3,
        likes: 24,
    },
    {
        id: "2",
        name: "Official Twins",
        username: "@twins",
        time: "2h",
        content: "Welcome to Twins, the new social media app for everyone! 🚀🎉",
        image: "https://placekitten.com/400/300",
        comments: 5,
        retweets: 3,
        likes: 24,
    },
];

export default function Profile() {
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const renderPost = ({ item }) => (
        <View style={profileStyles.post}>
            <Image 
                source={require('../assets/img/logoTWBlack.jpg')} 
                style={profileStyles.avatar} 
            />
            <View style={profileStyles.postContent}>
                <View style={profileStyles.postHeader}>
                    <Text style={profileStyles.name}>{item.name}</Text>
                    <Text style={profileStyles.username}> {item.username} · {item.time}</Text>
                </View>
                <Text style={profileStyles.text}>{item.content}</Text>
                {item.image && (
                    <Image 
                        source={require('../assets/img/logoTWBlack.jpg')} 
                        style={profileStyles.postImage} 
                    />
                )}
                <View style={profileStyles.actions}>
                    <View style={profileStyles.actionItem}>
                        <IconButton icon="comment-outline" size={20} />
                        <Text style={profileStyles.actionText}>{item.comments}</Text>
                    </View>
                    <View style={profileStyles.actionItem}>
                        <IconButton icon="repeat-variant" size={20} />
                        <Text style={profileStyles.actionText}>{item.retweets}</Text>
                    </View>
                    <View style={profileStyles.actionItem}>
                        <IconButton icon="heart-outline" size={20} />
                        <Text style={profileStyles.actionText}>{item.likes}</Text>
                    </View>
                    <View style={profileStyles.actionItem}>
                        <IconButton icon="share-outline" size={20} />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={profileStyles.container}>
            <ScrollView 
                style={profileStyles.scrollView}
                showsVerticalScrollIndicator={false}
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
                            <IconButton icon="arrow-left" size={24} />
                            <IconButton icon="cog-outline" size={24} />
                        </View>
                    </View>

                    {/* Profile Info Section */}
                    <View style={profileStyles.profileInfoContainer}>
                        {/* Profile Picture */}
                        <View style={profileStyles.profileImageContainer}>
                            <Image 
                                source={require('../assets/img/logoTWBlack.jpg')} 
                                style={profileStyles.profileImage} 
                            />
                        </View>

                        {/* Edit Profile Button */}
                        <View style={profileStyles.editProfileButton}>
                            <TouchableOpacity style={profileStyles.editProfileTouchable}>
                                <Text style={profileStyles.editProfileText}>Edit profile</Text>
                            </TouchableOpacity>
                        </View>

                        {/* User Info */}
                        <View style={profileStyles.userInfoContainer}>
                            <Text style={profileStyles.userName}>Official Twins</Text>
                            <Text style={profileStyles.userUsername}>@twins</Text>
                            
                            {/* Additional Info */}
                            <View style={profileStyles.additionalInfoContainer}>
                                <View style={profileStyles.infoItem}>
                                    <IconButton icon="cake" size={16} />
                                    <Text style={profileStyles.infoText}>Born October 19, 2025</Text>
                                </View>
                                <View style={profileStyles.infoItem}>
                                    <IconButton icon="calendar" size={16} />
                                    <Text style={profileStyles.infoText}>Joined octubre de 2025</Text>
                                </View>
                            </View>

                            {/* Follow Stats */}
                            <View style={profileStyles.followStatsContainer}>
                                <TouchableOpacity style={profileStyles.followStat}>
                                    <Text style={profileStyles.followCount}>17</Text>
                                    <Text style={profileStyles.followLabel}>Siguiendo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={profileStyles.followStat}>
                                    <Text style={profileStyles.followCount}>1</Text>
                                    <Text style={profileStyles.followLabel}>Seguidor</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Divider */}
                            <View style={profileStyles.dividerContainer}>
                                <View style={profileStyles.dividerLine} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Posts Feed */}
                <FlatList
                    ref={flatListRef}
                    data={profilePosts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    scrollEnabled={false}
                    contentContainerStyle={profileStyles.feed}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />

            </ScrollView>

            {/* Floating button to create */}
            <FAB
                icon="feather"
                color="white"
                style={profileStyles.fabCreate}
                onPress={() => console.log("Create thread")}
            />
        </View>
    );
}