import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton"; 
import InfoCard from "../components/InfoCard"; 
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

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
            <MaterialCommunityIcons name="atom" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Athena</Text>
          <Text style={styles.subtitle}>Empowering Women in STEM</Text>
          <Text style={styles.welcomeText}>Welcome back! Ready to grow your skills?</Text>
          
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
            <Feather name="star" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.quoteText}>{QUOTES[quoteIndex]}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
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
              <Feather name="info" size={24} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainCardTitle}>About Athena</Text>
              <Text style={styles.mainCardDesc}>Learn about our mission, vision, values, and more!</Text>
            </View>
            <Feather name="chevron-right" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("MentorshipDashboard" as never)}
          >
            <View style={styles.mainCardIconWrapper}>
              <Feather name="activity" size={24} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainCardTitle}>Mentorship Hub</Text>
              <Text style={styles.mainCardDesc}>View your mentorship journey, track progress, and manage connections</Text>
            </View>
            <Feather name="chevron-right" size={24} color={COLORS.primary} />
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
              <Feather name="users" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Mentorship Hub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "LearningCenterTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="book-open" size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Learning Center</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "EventsWorkshopsTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="calendar" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Events & Workshops</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "CommunitiesTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="message-square" size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Communities</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Features */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>More Features</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
        
        <View style={styles.sectionsContainer}>
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "MentorshipRequestsTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="bell" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Requests</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "ChatTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="send" size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "ProfileTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="user" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sectionCard}
            onPress={() => navigation.navigate("Main" as never, { screen: "CurrentConnectionsTab" } as never)}
            activeOpacity={0.8}
          >
            <View style={styles.sectionIconWrapper}>
              <Feather name="users" size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Current Connections</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.replace("LoginPage")}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={20} color={COLORS.primary} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradientBackground: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.7 / 2,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
    top: -width * 0.1,
    left: -width * 0.2,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.5 / 2,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
    bottom: width * 0.3,
    right: width * 0.2,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.3 / 2,
    backgroundColor: COLORS.secondary,
    opacity: 0.15,
    top: width * 0.5,
    left: width * 0.6,
  },
  headerSection: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.white,
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
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 60,
    minWidth: '80%',
  },
  quoteIconContainer: {
    marginRight: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 8,
  },
  quoteText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
    fontStyle: 'italic',
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  mainCardIconWrapper: {
    marginRight: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 10,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  mainCardDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
    color: COLORS.text,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textSecondary,
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
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
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
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    paddingVertical: 14,
    marginVertical: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    color: COLORS.primary,
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
    backgroundColor: COLORS.background,
  },
});