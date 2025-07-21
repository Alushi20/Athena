import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { database, config } from '../lib/appwrite';
import { Query } from 'react-native-appwrite';
import MentorCard, { Mentor } from '../components/MentorCard';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Models } from 'react-native-appwrite';
import { useNavigation } from '@react-navigation/native';
import { account } from '../lib/appwrite';

// Define the screen params for type safety
type RootStackParamList = {
    MentorDirectory: undefined;
    MentorProfile: { mentorId: string };
};

type MentorDirectoryProps = NativeStackScreenProps<RootStackParamList, 'MentorDirectory'>;

// Mock Data for UI development
const MOCK_MENTORS: Mentor[] = [
  { $id: '1', name: 'Dr. Evelyn Reed', bio: 'AI researcher with 10+ years at Google. Passionate about guiding young women in tech.', skills: ['AI', 'Machine Learning', 'Python'], profilePic: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { $id: '2', name: 'Aisha Khan', bio: 'Biotech pioneer, specializing in gene editing. Loves to help students navigate the world of biotech.', skills: ['Biotech', 'CRISPR', 'Genetics'], profilePic: 'https://randomuser.me/api/portraits/women/69.jpg' },
  { $id: '3', name: 'Maria Garcia', bio: 'Software Engineer at Microsoft. Focused on cloud computing and scalable systems.', skills: ['Azure', 'Databases', 'C#'], profilePic: 'https://randomuser.me/api/portraits/women/70.jpg' },
];


const MentorDirectoryScreen: React.FC<MentorDirectoryProps> = ({ navigation }) => {
    const [mentors, setMentors] = useState<Models.Document[]>([]);
    const [currentUser, setCurrentUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!isMounted) return;
            setLoading(true);
            try {
                const [userRes, mentorsRes] = await Promise.all([
                    account.get(),
                    database.listDocuments(config.dbId, config.col.usersCol, [Query.equal('role', 'mentor')])
                ]);
                if (isMounted) {
                    setCurrentUser(userRes);
                    setUserRole(userRes.prefs?.role ?? null);
                    setMentors(mentorsRes.documents);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const calculateMatchScore = (mentor: Models.Document): number => {
        if (!currentUser) return 0;
        const menteeSkills = currentUser.prefs?.skills || [];
        const menteeInterests = currentUser.prefs?.fieldsOfInterest || [];
        const mentorSkills = mentor.skills || [];
        const mentorInterests = mentor.fieldsOfInterest || [];
        const skillOverlap = menteeSkills.filter((s: string) => mentorSkills.includes(s)).length;
        const interestOverlap = menteeInterests.filter((i: string) => mentorInterests.includes(i)).length;
        const totalPossible = menteeSkills.length + menteeInterests.length;
        if (totalPossible === 0) return 50; // Default score if mentee has no prefs
        return ((skillOverlap + interestOverlap) / totalPossible) * 100;
    };

    const mentorsWithScores = mentors
        .map(mentor => ({ ...mentor, matchScore: calculateMatchScore(mentor) }))
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const filteredMentors = mentorsWithScores.filter((mentor: any) =>
        (mentor.name as string)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mentor.skills as string[])?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Find a Mentor</Text>
                <Text style={styles.subtitle}>Connect with experienced women in STEM who can guide you.</Text>
                {userRole === 'mentor' && (
                    <TouchableOpacity style={styles.requestsButton} onPress={() => navigation.navigate('MentorshipRequestsTab' as never)}>
                        <Feather name="bell" size={20} color={COLORS.primary} />
                        <Text style={styles.requestsButtonText}>Requests</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name or skill..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={filteredMentors}
                    renderItem={({ item }) => (
                        <MentorCard 
                            mentor={item as unknown as Mentor} 
                            onPress={() => navigation.navigate('MentorProfile', { mentorId: item.$id })}
                        />
                    )}
                    keyExtractor={(item) => item.$id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: COLORS.text,
    },
    requestsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: COLORS.accent,
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    requestsButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 6,
    },
});

export default MentorDirectoryScreen; 