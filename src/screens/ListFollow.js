import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { IconButton, FAB } from 'react-native-paper';
import followStyles from '../styles/followStyles';
import homeStyles from '../styles/homeStyles';
import { theme } from '../styles/theme';

// Mock data for followers and following
const MOCK_FOLLOWERS = [
    {
        id: '1',
        name: 'Follower User 1',
        username: '@follower1',
        avatar: '../../assets/img/logoTWBlack.jpg',
        isFollowing: true,
    },
    {
        id: '2',
        name: 'Follower User 2',
        username: '@follower2',
        avatar: '../../assets/img/logoTWBlack.jpg',
        isFollowing: false,
    },
];

const MOCK_FOLLOWING = [
    {
        id: '1',
        name: 'Following User 1',
        username: '@following1',
        avatar: '../../assets/img/logoTWBlack.jpg',
        isFollowing: true,
    },
    {
        id: '2',
        name: 'Following User 2',
        username: '@following2',
        avatar: '../../assets/img/logoTWBlack.jpg',
        isFollowing: false,
    },
];

export default function ListFollow({ route, navigation }) {
    const { initialTab = 'followers' } = route.params || {};
    const [activeTab, setActiveTab] = useState(initialTab);

    const currentData = activeTab === 'followers' ? MOCK_FOLLOWERS : MOCK_FOLLOWING;

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={followStyles.userItem}
            onPress={() => console.log('View profile of', item.username)}
        >
            <Image
                source={{ uri: item.avatar }}
                style={followStyles.avatar}
                defaultSource={require('../assets/img/logoTWBlack.jpg')}
            />
            <View style={followStyles.userInfo}>
                <Text style={followStyles.userName}>{item.name}</Text>
                <Text style={followStyles.userUsername}>{item.username}</Text>
            </View>
            <TouchableOpacity
                style={[
                    followStyles.followButton,
                    item.isFollowing && followStyles.followingButton,
                ]}
                onPress={() => console.log('Toggle follow for', item.username)}
            >
                <Text
                    style={[
                        followStyles.followButtonText,
                        item.isFollowing && followStyles.followingButtonText,
                    ]}>
                    {item.isFollowing ? 'Followed' : 'Follow'}
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
                    onPress={() => navigation.navigate('Profile')}
                />

                <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 8 }}>
                    <Text style={followStyles.headerTitle}>Official Twins</Text>
                    <Text style={followStyles.headerSubtitle}>@twins</Text>
                </View>

                {/* Empty space to balance the layout */}
                <View style={{ width: 40 }} />
            </View>

            {/* TABS */}
            <View style={followStyles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        followStyles.tab,
                        activeTab === 'followers' && followStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('followers')}>
                    <Text
                        style={[
                            followStyles.tabText,
                            activeTab === 'followers' && followStyles.activeTabText,
                        ]}>
                        Followers
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        followStyles.tab,
                        activeTab === 'following' && followStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('following')}>
                    <Text
                        style={[
                            followStyles.tabText,
                            activeTab === 'following' && followStyles.activeTabText,
                        ]}>
                        Following
                    </Text>
                </TouchableOpacity>
            </View>

            {/* USERS LIST */}
            <FlatList
                data={currentData}
                keyExtractor={item => item.id}
                renderItem={renderUserItem}
                ListEmptyComponent={
                    <View style={followStyles.emptyContainer}>
                        <Text style={followStyles.emptyText}>
                            {activeTab === 'followers'
                                ? 'No followers yet.'
                                : 'Not following anyone yet.'}
                        </Text>
                    </View>
                }
                contentContainerStyle={followStyles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}