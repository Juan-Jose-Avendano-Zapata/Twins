import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    doc,
    getDoc,
    Timestamp,
    addDoc,
    updateDoc,
    deleteDoc,
    increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { authService } from './authService';

export const postService = {
    // Get posts excluding current user's posts
    async getPosts() {
        try {
            const currentUser = await authService.getCurrentUser();

            if (!currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            const postsRef = collection(db, 'posts');
            const q = query(
                postsRef,
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);

            // Use Promise.all to fetch author info and like status in parallel
            const postsPromises = querySnapshot.docs
                .filter(doc => doc.data().authorId !== currentUser.uid)
                .map(async (doc) => {
                    const postData = doc.data();
                    
                    const [authorInfo, userLiked] = await Promise.all([
                        this.getAuthorInfo(postData.authorId),
                        this.checkUserLiked(doc.id, currentUser.uid)
                    ]);
                    
                    return {
                        id: doc.id,
                        ...postData,
                        ...authorInfo,
                        createdAt: postData.createdAt?.toDate?.(),
                        updatedAt: postData.updatedAt?.toDate?.(),
                        time: this.formatTime(postData.createdAt?.toDate?.()),
                        userLiked: userLiked
                    };
                });

            const posts = await Promise.all(postsPromises);

            return { success: true, data: posts };
        } catch (error) {
            console.error('Error getting posts:', error);
            return { success: false, error: error.message };
        }
    },

    // Get author information
    async getAuthorInfo(authorId) {
        try {
            const userProfile = await authService.getUserProfile(authorId);
            if (userProfile.success) {
                return {
                    authorName: userProfile.data.profile?.name || 'User',
                    authorUsername: userProfile.data.username || 'user',
                    authorAvatar: userProfile.data.profile?.avatar || null
                };
            }
        } catch (error) {
            console.error('Error getting author info:', error);
        }

        return {
            authorName: 'User',
            authorUsername: 'user',
            authorAvatar: null
        };
    },

    // Format time difference
    formatTime(date) {
        if (!date) return '';

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
            return `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else {
            return `${days}d`;
        }
    },

    async likePost(postId) {
        try {
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            // Validate if the user has already liked the post
            const likesRef = collection(db, 'likes');
            const q = query(
                likesRef,
                where('postId', '==', postId),
                where('authorId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);

            // If already liked, remove the like
            if (!querySnapshot.empty) {
                return await this.unlikePost(postId);
            }

            // If not liked yet, add a new like
            await addDoc(collection(db, 'likes'), {
                postId: postId,
                authorId: currentUser.uid,
                authorRef: `users/${currentUser.uid}`,
                createdAt: Timestamp.now()
            });

            // Update like count in the post
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                'state.likes': increment(1)
            });

            return { success: true, action: 'liked' };
        } catch (error) {
            console.error('Error liking post:', error);
            return { success: false, error: error.message };
        }
    },

    async getFollowingPosts() {
        try {
            const currentUser = await authService.getCurrentUser();

            if (!currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            // Get current user's profile to retrieve following list
            const currentUserProfile = await authService.getUserProfile(currentUser.uid);
            
            if (!currentUserProfile.success) {
                return { success: false, error: 'Error getting user profile' };
            }

            const following = currentUserProfile.data.following || [];
            
            // If not following anyone, return empty array
            if (following.length === 0) {
                return { success: true, data: [] };
            }

            const postsRef = collection(db, 'posts');
            const allPostsDocs = [];
            const chunkSize = 10;

            // Iterate over the 'following' array in chunks of 10 UIDs
            for (let i = 0; i < following.length; i += chunkSize) {
                const chunk = following.slice(i, i + chunkSize);

                const q = query(
                    postsRef,
                    where('authorId', 'in', chunk),
                    orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                allPostsDocs.push(...querySnapshot.docs);
            }

            // Use Promise.all to get author info and likes in parallel
            const postsPromises = allPostsDocs.map(async (doc) => {
                const postData = doc.data();
                
                const [authorInfo, userLiked] = await Promise.all([
                    this.getAuthorInfo(postData.authorId),
                    this.checkUserLiked(doc.id, currentUser.uid)
                ]);
                
                return {
                    id: doc.id,
                    ...postData,
                    ...authorInfo,
                    createdAt: postData.createdAt?.toDate?.(),
                    updatedAt: postData.updatedAt?.toDate?.(),
                    time: this.formatTime(postData.createdAt?.toDate?.()),
                    userLiked: userLiked
                };
            });

            let posts = await Promise.all(postsPromises);

            // Re-sort by creation date after combining results
            posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            return { success: true, data: posts };
        } catch (error) {
            console.error('Error getting following posts:', error);
            return { success: false, error: error.message };
        }
    },

    async unlikePost(postId) {
        try {
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            // Find the user's like
            const likesRef = collection(db, 'likes');
            const q = query(
                likesRef,
                where('postId', '==', postId),
                where('authorId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { success: false, error: 'Like not found' };
            }

            // Remove the like
            const likeDoc = querySnapshot.docs[0];
            await deleteDoc(doc(db, 'likes', likeDoc.id));

            // Update like count in the post
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                'state.likes': increment(-1)
            });

            return { success: true, action: 'unliked' };
        } catch (error) {
            console.error('Error removing like:', error);
            return { success: false, error: error.message };
        }
    },

    async createPost(content, image = "") {
        try {
            const currentUser = await authService.getCurrentUser();

            if (!currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            const userProfile = await authService.getUserProfile(currentUser.uid);

            if (!userProfile.success) {
                return { success: false, error: 'Error getting user profile' };
            }

            const newPost = {
                authorId: currentUser.uid,
                authorRef: `users/${currentUser.uid}`,
                content: content,
                image: image,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                state: {
                    comments: 0,
                    likes: 0,
                    retweets: 0
                }
            };

            const docRef = await addDoc(collection(db, 'posts'), newPost);

            return {
                success: true,
                data: {
                    id: docRef.id,
                    ...newPost,
                    createdAt: newPost.createdAt.toDate(),
                    updatedAt: newPost.updatedAt.toDate()
                }
            };
        } catch (error) {
            console.error('Error creating post:', error);
            return { success: false, error: error.message };
        }
    }
};