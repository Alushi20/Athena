import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton"; 
import InfoCard from "../components/InfoCard"; 
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

type RootStackParamList = {
  LoginPage: undefined;
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Communities: undefined;
  Main: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const { width } = Dimensions.get('window');

const QUOTES = [
  "You belong in STEM. – Reshma Saujani",
  "The world needs science, and science needs women. – UNESCO",
  "Doubt is a killer. You just have to know who you are. – Jennifer Lopez",
  "Success is liking yourself, liking what you do, and liking how you do it. – Maya Angelou",
  "There is no limit to what we, as women, can accomplish. – Michelle Obama",
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { colors } = useTheme();
  const [message, setMessage] = useState("Loading latest updates...");
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setMessage("Empowering women in STEM, one step at a time.");
      setLoading(false);
    }, 1200);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradientBackground: {
      flex: 1,
    },
    decorativeCircle1: {
      position: 'absolute',
      width: width * 0.7,
      height: width * 0.7,
      borderRadius: width * 0.7 / 2,
      backgroundColor: colors.accent,
      opacity: 0.3,
      top: -width * 0.1,
      left: -width * 0.2,
    },
    decorativeCircle2: {
      position: 'absolute',
      width: width * 0.5,
      height: width * 0.5,
      borderRadius: width * 0.5 / 2,
      backgroundColor: colors.primary,
      opacity: 0.1,
      bottom: width * 0.3,
      right: width * 0.2,
    },
    decorativeCircle3: {
      position: 'absolute',
      width: width * 0.3,
      height: width * 0.3,
      borderRadius: width * 0.3 / 2,
      backgroundColor: colors.secondary,
      opacity: 0.15,
      top: width * 0.5,
      left: width * 0.6,
    },
    headerSection: {
      backgroundColor: colors.secondary,
      borderRadius: 20,
      padding: 24,
      marginBottom: 20,
      alignItems: 'center',
    },
    logoContainer: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 10,
      marginBottom: 10,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: 4,
      letterSpacing: 1.5,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 8,
      textAlign: 'center',
      opacity: 0.9,
    },
    welcomeText: {
      fontSize: 16,
      color: colors.white,
      marginBottom: 16,
      textAlign: 'center',
      fontStyle: 'italic',
      opacity: 0.8,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 15,
    },
    statCard: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.white,
      opacity: 0.8,
    },
    quoteCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 18,
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 4,
      minHeight: 60,
      minWidth: '80%',
    },
    quoteIconContainer: {
      marginRight: 12,
      backgroundColor: colors.accent,
      borderRadius: 12,
      padding: 8,
    },
    quoteText: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 15,
      flex: 1,
      fontStyle: 'italic',
    },
    message: {
      fontSize: 16,
      color: colors.textSecondary,
      marginVertical: 12,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    mainCardsContainer: {
      width: '100%',
      gap: 18,
      marginBottom: 18,
    },
    mainCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 18,
      padding: 18,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 4,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    mainCardIconWrapper: {
      marginRight: 16,
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 10,
    },
    mainCardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    mainCardDesc: {
      fontSize: 14,
      color: colors.textSecondary,
      opacity: 0.9,
    },
    sectionHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 12,
      paddingHorizontal: 24,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    sectionHeaderLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.textSecondary,
      opacity: 0.3,
      marginLeft: 10,
    },
    sectionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      marginBottom: 20,
    },
    sectionCard: {
      width: '48%',
      backgroundColor: colors.white,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 12,
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionIconWrapper: {
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      marginTop: 12,
      gap: 12,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
      borderRadius: 24,
      paddingVertical: 14,
      marginVertical: 4,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    logoutButtonText: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 1,
      marginLeft: 8,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: colors.background,
    },
    // Featured Sections Styles
    featuredScrollContainer: {
      paddingHorizontal: 24,
      marginBottom: 20,
    },
    featuredMentorCard: {
      width: 160,
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      marginRight: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      alignItems: 'center',
    },
    mentorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    mentorName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    mentorRole: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
      textAlign: 'center',
    },
    mentorCompany: {
      fontSize: 11,
      color: colors.primary,
      marginBottom: 8,
      textAlign: 'center',
    },
    mentorStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 12,
    },
    mentorStat: {
      fontSize: 10,
      color: colors.textSecondary,
    },
    connectMentorButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      width: '100%',
    },
    connectMentorText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    featuredEventsContainer: {
      paddingHorizontal: 24,
      marginBottom: 20,
      gap: 12,
    },
    eventCard: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    eventDateContainer: {
      alignItems: 'center',
      marginRight: 16,
      minWidth: 50,
    },
    eventDate: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    eventMonth: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    eventContent: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    eventTime: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    eventLocation: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    eventBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.success,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    eventBadgeText: {
      color: colors.white,
      fontSize: 10,
      fontWeight: '600',
    },
    communityHighlightsContainer: {
      paddingHorizontal: 24,
      marginBottom: 20,
      gap: 12,
    },
    highlightCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    highlightIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    highlightTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    highlightSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    highlightStats: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    learningResourcesContainer: {
      paddingHorizontal: 24,
      marginBottom: 20,
      gap: 12,
    },
    resourceCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    resourceIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    resourceTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    resourceDuration: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    resourceProgress: {
      gap: 8,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.accent,
      borderRadius: 3,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    themeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginTop: 8,
    },
    themeText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
        
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="atom" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Athena</Text>
          <Text style={styles.subtitle}>Empowering Women in STEM</Text>
          <Text style={styles.welcomeText}>Welcome back! Ready to grow your skills?</Text>
          <View style={styles.themeIndicator}>
            <Feather name={colors.background === '#121212' ? 'moon' : 'sun'} size={16} color={colors.white} />
            <Text style={styles.themeText}>{colors.background === '#121212' ? 'Dark' : 'Light'} Mode</Text>
          </View>
          
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2,847</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Mentors</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.quoteCard}> 
          <View style={styles.quoteIconContainer}>
            <Feather name="star" size={20} color={colors.primary} />
          </View>
          <Text style={styles.quoteText}>{QUOTES[quoteIndex]}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <Text style={styles.message}>{message}</Text>
        )}

        {/* About Athena and Mentorship Hub Cards */}
        <View style={styles.mainCardsContainer}>
          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => navigation.navigate("About" as never)}
            activeOpacity={0.8}
          >
            <View style={styles.mainCardIconWrapper}>
              <Feather name="info" size={24} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainCardTitle}>About Athena</Text>
              <Text style={styles.mainCardDesc}>Learn about our mission, vision, values, and more!</Text>
            </View>
            <Feather name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("MentorshipDashboard" as never)}
          >
            <View style={styles.mainCardIconWrapper}>
              <Feather name="activity" size={24} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainCardTitle}>Mentorship Hub</Text>
              <Text style={styles.mainCardDesc}>View your mentorship journey, track progress, and manage connections</Text>
            </View>
            <Feather name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
        
        <View style={styles.sectionsContainer}>
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "MentorshipTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="users" size={28} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Mentorship Hub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "LearningCenterTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="book-open" size={28} color={colors.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Learning Center</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "EventsWorkshopsTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="calendar" size={28} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Events & Workshops</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "CommunitiesTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="message-square" size={28} color={colors.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Communities</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Sections */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Featured Mentors</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScrollContainer}>
          <View style={styles.featuredMentorCard}>
            <View style={styles.mentorAvatar}>
              <Feather name="user" size={24} color={colors.white} />
            </View>
            <Text style={styles.mentorName}>Dr. Sarah Chen</Text>
            <Text style={styles.mentorRole}>AI Research Lead</Text>
            <Text style={styles.mentorCompany}>Google</Text>
            <View style={styles.mentorStats}>
              <Text style={styles.mentorStat}>4.9★</Text>
              <Text style={styles.mentorStat}>156 sessions</Text>
            </View>
            <TouchableOpacity style={styles.connectMentorButton}>
              <Text style={styles.connectMentorText}>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredMentorCard}>
            <View style={styles.mentorAvatar}>
              <Feather name="user" size={24} color={colors.white} />
            </View>
            <Text style={styles.mentorName}>Prof. Emily Watson</Text>
            <Text style={styles.mentorRole}>Data Scientist</Text>
            <Text style={styles.mentorCompany}>Netflix</Text>
            <View style={styles.mentorStats}>
              <Text style={styles.mentorStat}>4.8★</Text>
              <Text style={styles.mentorStat}>89 sessions</Text>
            </View>
            <TouchableOpacity style={styles.connectMentorButton}>
              <Text style={styles.connectMentorText}>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredMentorCard}>
            <View style={styles.mentorAvatar}>
              <Feather name="user" size={24} color={colors.white} />
            </View>
            <Text style={styles.mentorName}>Maria Rodriguez</Text>
            <Text style={styles.mentorRole}>UX Designer</Text>
            <Text style={styles.mentorCompany}>Spotify</Text>
            <View style={styles.mentorStats}>
              <Text style={styles.mentorStat}>4.7★</Text>
              <Text style={styles.mentorStat}>203 sessions</Text>
            </View>
            <TouchableOpacity style={styles.connectMentorButton}>
              <Text style={styles.connectMentorText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Upcoming Events</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
        
        <View style={styles.featuredEventsContainer}>
          <TouchableOpacity style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventDate}>15</Text>
              <Text style={styles.eventMonth}>Jan</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Women in Tech Conference</Text>
              <Text style={styles.eventTime}>2:00 PM - 5:00 PM</Text>
              <Text style={styles.eventLocation}>Virtual Event</Text>
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>Free</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventDate}>18</Text>
              <Text style={styles.eventMonth}>Jan</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>AI Workshop Series</Text>
              <Text style={styles.eventTime}>10:00 AM - 12:00 PM</Text>
              <Text style={styles.eventLocation}>Online Workshop</Text>
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>Premium</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Community Highlights</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
        
        <View style={styles.communityHighlightsContainer}>
          <TouchableOpacity style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Feather name="trending-up" size={20} color={colors.primary} />
            </View>
            <Text style={styles.highlightTitle}>Most Active Community</Text>
            <Text style={styles.highlightSubtitle}>Women in Data Science</Text>
            <Text style={styles.highlightStats}>2,847 members • 156 posts today</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Feather name="award" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.highlightTitle}>Featured Discussion</Text>
            <Text style={styles.highlightSubtitle}>Breaking the Glass Ceiling</Text>
            <Text style={styles.highlightStats}>89 replies • 234 views</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Learning Resources</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
        
        <View style={styles.learningResourcesContainer}>
          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.resourceIcon}>
              <Feather name="play-circle" size={24} color={colors.primary} />
            </View>
            <Text style={styles.resourceTitle}>Introduction to Machine Learning</Text>
            <Text style={styles.resourceDuration}>45 min • Beginner</Text>
            <View style={styles.resourceProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.progressText}>75% Complete</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.resourceIcon}>
              <Feather name="book" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.resourceTitle}>Career Development Guide</Text>
            <Text style={styles.resourceDuration}>2 hours • Intermediate</Text>
            <View style={styles.resourceProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '30%' }]} />
              </View>
              <Text style={styles.progressText}>30% Complete</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}