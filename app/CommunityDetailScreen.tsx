import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

type Community = {
    id: string;
    title: string;
    description: string;
    icon: string;
};

type Post = {
    id: string;
    author: string;
    content: string;
    upvotes: number;
    replies: Reply[];
    isHelpful?: boolean;
};

type Reply = {
    id: string;
    author: string;
    content: string;
};

type RootStackParamList = {
    CommunityDetail: { community: Community };
};

type CommunityDetailProps = NativeStackScreenProps<RootStackParamList, 'CommunityDetail'>;

// Hardcoded data for demonstration
const HARDCODED_POSTS: Post[] = [
    { id: '1', author: 'Sarah J.', content: 'Just started my first job in a tech startup and feeling a bit of imposter syndrome. Any advice on how to handle it?', upvotes: 28, replies: [
        { id: 'r1', author: 'Dr. Evelyn Reed', content: "That's completely normal! Focus on your small wins and remember that everyone learns at their own pace. You've got this!" },
        { id: 'r2', author: 'Aisha K.', content: 'I found that keeping a "brag document" of my accomplishments really helped boost my confidence.' }
    ], isHelpful: true },
    { id: '2', author: 'Emily R.', content: 'How do you all approach asking for a raise? I feel like I deserve one but I\'m nervous to bring it up.', upvotes: 45, replies: [
        { id: 'r3', author: 'Maria G.', content: 'Come prepared with data! List your key achievements and the value you brought to the company. Practice your pitch beforehand.' }
    ]},
];

const CommunityDetailScreen: React.FC<CommunityDetailProps> = ({ route }) => {
    const { community } = route.params;
    const [posts, setPosts] = useState(HARDCODED_POSTS);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, []);

    const handleAddPost = () => {
        if (newPost.trim()) {
            setLoading(true);
            setTimeout(() => {
                const newPostData: Post = {
                    id: (posts.length + 1).toString(),
                    author: 'You',
                    content: newPost,
                    upvotes: 0,
                    replies: []
                };
                setPosts([newPostData, ...posts]);
                setNewPost('');
                setLoading(false);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 1200);
            }, 600);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Feather name={community.icon as any} size={24} color={COLORS.primary} />
                <Text style={styles.headerTitle}>{community.title}</Text>
            </View>
            <Text style={styles.headerDescription}>{community.description}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Share your thoughts or ask a question..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={newPost}
                    onChangeText={setNewPost}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleAddPost} disabled={loading || !newPost.trim()}>
                    {loading ? <ActivityIndicator size={18} color={COLORS.white} /> : <Feather name="send" size={20} color={COLORS.white} />}
                </TouchableOpacity>
            </View>
            {success && (
                <View style={styles.successBox}>
                    <Feather name="check-circle" size={18} color={COLORS.success} />
                    <Text style={styles.successText}>Post sent!</Text>
                </View>
            )}
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <FlatList
                    data={posts}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Animated.View style={styles.postCard}>
                            <View style={styles.postHeader}>
                                <View style={styles.avatar}><Feather name="user" size={20} color={COLORS.secondary} /></View>
                                <Text style={styles.postAuthor}>{item.author}</Text>
                            </View>
                            <Text style={styles.postContent}>{item.content}</Text>
                        </Animated.View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 8,
    },
    headerDescription: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingHorizontal: 10,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 16,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: 10,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.success,
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    successText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    postCard: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    postAuthor: {
        fontWeight: 'bold',
        color: COLORS.secondary,
        fontSize: 15,
    },
    postContent: {
        color: COLORS.text,
        fontSize: 15,
        marginTop: 2,
    },
});

export default CommunityDetailScreen; 