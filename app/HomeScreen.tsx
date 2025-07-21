import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, ActivityIndicator, Animated, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton"; 
import InfoCard from "../components/InfoCard"; 
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

type RootStackParamList = {
  LoginPage: undefined;
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Communities: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const QUOTES = [
  "You belong in STEM. – Reshma Saujani",
  "The world needs science, and science needs women. – UNESCO",
  "Doubt is a killer. You just have to know who you are. – Jennifer Lopez",
  "Success is liking yourself, liking what you do, and liking how you do it. – Maya Angelou",
  "There is no limit to what we, as women, can accomplish. – Michelle Obama",
];

const FEATURED_COMMUNITY = {
  title: "Handling Workplace Bias",
  description: "Discuss challenges and solutions for bias in STEM fields.",
  icon: "account-group-outline",
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [message, setMessage] = useState("Loading latest updates...");
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0.97)).current;
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quoteFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      setMessage("Empowering women in STEM, one step at a time.");
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1200);
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1.03, duration: 6000, useNativeDriver: true }),
        Animated.timing(bgAnim, { toValue: 0.97, duration: 6000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(quoteFade, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        Animated.timing(quoteFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        style={{ transform: [{ scale: bgAnim }] }}
      >
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Athena</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>Welcome to the Home Page!</Animated.Text>

        <Animated.View style={[styles.quoteCard, { opacity: quoteFade }]}> 
          <Feather name="star" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.quoteText}>{QUOTES[quoteIndex]}</Text>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.secondary} style={{ marginVertical: 20 }} />
        ) : (
          <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>{message}</Animated.Text>
        )}

        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <InfoCard 
            title="About Us"
            content="Despite progress in gender equality, women remain underrepresented in STEM fields. Deep-rooted stereotypes, lack of role models, and systemic biases often discourage young girls from pursuing STEM careers."
          />
          <InfoCard 
            title="Our Mission"
            content="Athena is here to break barriers! We foster inclusive environments, provide mentorship, and promote STEM education for young women, empowering the next generation of female tech leaders."
          />
        </Animated.View>

        <TouchableOpacity
          style={styles.featuredCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Communities")}
        >
          <View style={styles.featuredIconWrapper}>
            <Feather name="users" size={28} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.featuredTitle}>{FEATURED_COMMUNITY.title}</Text>
            <Text style={styles.featuredDesc}>{FEATURED_COMMUNITY.description}</Text>
          </View>
          <Feather name="chevron-right" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Logout" 
            onPress={() => navigation.replace("LoginPage")}
            style={[styles.button, styles.logoutButton]}
            textStyle={styles.buttonText}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginVertical: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 12,
    gap: 12,
  },
  button: {
    backgroundColor: COLORS.secondary,
    borderRadius: 24,
    paddingVertical: 14,
    marginVertical: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: COLORS.accent,
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
  quoteText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
    fontStyle: 'italic',
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredIconWrapper: {
    marginRight: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 10,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  featuredDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
});