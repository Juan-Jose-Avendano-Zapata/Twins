import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    addDoc,
    increment,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { authService } from "./authService";
import { userService } from "./userService";

const postService = {
    // Auxiliary Methods


    // Format Time Difference
    formatTime(date) {
        if (!date) return '';

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
            return `${minutes} min`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else {
            return `${days}d`;
        }
    },

    // Get author information
    async getAuthorInfo(authorId) {
        try {
            const userProfile = await userService.getUserProfile(authorId);
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

    // Check if the user liked the post
    async checkUserLiked(postId, currentauthorId) {
        try {
            if (!postId || !currentauthorId) {
                return false;
            }

            const likesRef = collection(db, 'likes');
            const q = query(
                likesRef,
                where('postId', '==', postId),
                where('authorId', '==', currentauthorId)
            );

            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (e) {
            console.error('Error checking if user  liked  post', e);
            return false;
        }
    },


    // Main Methods

    // Create post
    async createPost(content, mediaUrl = "") {
        try {
            const currentUser = authService.getCurrentUser();

            if (!currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            const userProfile = await userService.getUserProfile(currentUser.uid);

            if (!userProfile.success) {
                return { success: false, error: 'Error getting user profile' };
            }

            const newPost = {
                authorId: currentUser.uid,
                authorRef: `users/${currentUser.uid}`,
                content: content,
                mediaUrl: mediaUrl,
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
        } catch (e) {
            console.error('Error creating post:', e);
            return { success: false, error: e.message };
        }
    },

    // Get posts excluiding current user's posts
    async getPosts() {
        try {
            const currentUser = authService.getCurrentUser();

            if (!currentUser) {
                throw new Error("User not authenticated");
            }

            const postRef = collection(db, "posts");
            const q = query(
                postRef,
                orderBy("updatedAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const posts = await Promise.all(querySnapshot.docs
                .filter(doc => doc.data().authorId !== currentUser.uid)
                .map(async (doc) => {
                    const postData = doc.data();
                    const authorData = await this.getAuthorInfo(postData.authorId);
                    const userLiked = await this.checkUserLiked(doc.id, currentUser.uid);
                    return {
                        id: doc.id,
                        ...postData,
                        ...authorData,
                        time: this.formatTime(postData.updatedAt?.toDate?.()),
                        userLiked: userLiked
                    }
                }));

            return { success: true, data: posts };
        } catch (e) {
            console.error('Error getting posts', e);
            return { success: false, error: e.message };
        }
    },

    //Get post By Id
    async getPostById(postId) {
        try {
            const currentUser = authService.getCurrentUser();

            if (!currentUser) {
                throw new Error("User not authenticated");
            }

            const postRef = doc(db, "posts", postId);
            const postDoc = await getDoc(postRef);

            if (!postDoc.exists()) {
                throw new Error("Post not found");
            }

            const postData = postDoc.data();

            const authorData = await this.getAuthorInfo(postData.authorId);
            const userLiked = await this.checkUserLiked(postId, currentUser.uid);

            const post = {
                id: postDoc.id,
                ...postData,
                ...authorData,
                authorId: postData.authorId, // Asegúrate de incluir esto
                time: this.formatTime(postData.updatedAt?.toDate?.()),
                userLiked: userLiked
            };

            return { success: true, data: post };
        } catch (e) {
            console.error('Error getting post by ID', e);
            return { success: false, error: e.message };
        }
    },

    // Get your own Posts
    async getPostsOwnPosts() {
        try {
            const currentUser = authService.getCurrentUser();

            if (!currentUser) {
                throw new Error("User not authenticated");
            }

            const postRef = collection(db, "posts");
            const q = query(
                postRef,
                where("authorId", "==", currentUser.uid),
                orderBy("updatedAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const posts = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const postData = doc.data();
                const authorData = await this.getAuthorInfo(postData.authorId);
                const userLiked = await this.checkUserLiked(doc.id, currentUser.uid);
                return {
                    id: doc.id,
                    ...postData,
                    ...authorData,
                    time: this.formatTime(postData.updatedAt?.toDate?.()),
                    userLiked: userLiked
                }
            }));

            return { success: true, data: posts };
        } catch (e) {
            console.error('Error getting posts', e);
            return { success: false, error: e.message };
        }
    },

    async getPostsByUser(userId) {
        try {
            const currentUser = authService.getCurrentUser();
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, where('authorId', '==', userId), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const posts = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const postData = doc.data();
                const authorData = await this.getAuthorInfo(postData.authorId);
                const userLiked = await this.checkUserLiked(doc.id, currentUser.uid);
                return {
                    id: doc.id,
                    ...postData,
                    ...authorData,
                    time: this.formatTime(postData.updatedAt?.toDate?.()),
                    userLiked: userLiked
                }
            }));

            return { success: true, data: posts };
        } catch (error) {
            console.error('Error getting posts by user:', error);
            return { success: false, error: error.message };
        }
    },

    // Get the follower posts
    async getFollowingPosts() {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) throw new Error("User not authenticated");

            const currentUserProfile = await userService.getUserProfile(currentUser.uid);
            if (!currentUserProfile.success)
                return { success: false, error: "Error getting user profile" };

            const rawFollowing = currentUserProfile.data.following || [];
            const following = rawFollowing.map(id => id.trim());

            if (following.length === 0) {
                return { success: true, data: [] };
            }

            const postRef = collection(db, "posts");
            const q = query(postRef, orderBy("updatedAt", "desc"));
            const querySnapshot = await getDocs(q);

            const filteredDocs = querySnapshot.docs.filter(doc => {
                const authorId = doc.data().authorId?.trim();
                return following.includes(authorId);
            });

            const posts = await Promise.all(
                filteredDocs.map(async (doc) => {
                    const postData = doc.data();
                    const authorData = await this.getAuthorInfo(postData.authorId);
                    const userLiked = await this.checkUserLiked(doc.id, currentUser.uid);

                    return {
                        id: doc.id,
                        ...postData,
                        ...authorData,
                        time: this.formatTime(postData.updatedAt?.toDate?.()),
                        userLiked,
                    };
                })
            );

            return { success: true, data: posts };

        } catch (e) {
            console.error("Error getting following posts", e);
            return { success: false, error: e.message };
        }
    }
    ,

    // Like user post
    async likePost(postId) {
        try {
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) {
                return { success: false, error: 'User not  authenticated' };
            }

            const likesRef = collection(db, 'likes');
            const q = query(
                likesRef,
                where('postId', '==', postId),
                where('authorId', '==', currentUser.uid)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                return await this.unlikePost(postId);
            }

            await addDoc(collection(db, 'likes'), {
                postId: postId,
                authorId: currentUser.uid,
                authorRef: `users/${currentUser.uid}`,
                createdAt: Timestamp.now()
            });

            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                'state.likes': increment(1)
            });

            return { success: true, action: 'liked' };
        } catch (e) {
            console.error('Error liking post:', e);
            return { success: false, error: e.message };
        }
    },

    // Unlike user post 
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
        } catch (e) {
            console.error('Error removing like:', e);
            return { success: false, error: e.message };
        }
    },



    async createComment(postId, content) {
        try {
            const currentUser = authService.getCurrentUser();

            if (!currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            const newComment = {
                authorId: currentUser.uid,
                authorRef: `users/${currentUser.uid}`,
                postId: postId,
                postRef: `posts/${postId}`,
                content: content,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            const commentRef = await addDoc(collection(db, 'comments'), newComment);


            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                'state.comments': increment(1)
            });

            return {
                success: true,
                data: {
                    id: commentRef.id,
                    ...newComment,
                    createdAt: newComment.createdAt.toDate(),
                    updatedAt: newComment.updatedAt.toDate()
                }
            };
        } catch (e) {
            console.error('Error creating comment:', e);
            return { success: false, error: e.message };
        }
    },

    async getCommentsByPostId(postId) {
        try {
            const commentsRef = collection(db, 'comments');
            const q = query(
                commentsRef,
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);

            const filteredComments = querySnapshot.docs.filter(doc =>
                doc.data().postId === postId 
            );

            const comments = filteredComments.map(doc => ({
                id: doc.id,
                ...doc.data(),
                time: this.formatTime(doc.data().createdAt?.toDate?.()),
            }));

            return { success: true, data: comments };
        } catch (e) {
            console.error('Error getting comments:', e);
            return { success: false, error: e.message };
        }
    }
}

export { postService };