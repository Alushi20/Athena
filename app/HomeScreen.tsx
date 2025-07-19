import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, ActivityIndicator, Animated, StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton"; 
import InfoCard from "../components/InfoCard"; 

// Define the screen params for type safety
type RootStackParamList = {
  LoginPage: undefined;
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [message, setMessage] = useState("Loading latest updates...");
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>GalWise</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>Welcome to the Home Page!</Animated.Text>

        {loading ? (
          <ActivityIndicator size="large" color="#B983FF" style={{ marginVertical: 20 }} />
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
            content="GalWise is here to break barriers! We foster inclusive environments, provide mentorship, and promote STEM education for young women, empowering the next generation of female tech leaders."
          />
        </Animated.View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Go to Chat" 
            onPress={() => navigation.navigate("Chat")}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <CustomButton 
            title="Go to Profile" 
            onPress={() => navigation.navigate("Profile")}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <CustomButton 
            title="Logout" 
            onPress={() => navigation.replace("LoginPage")}
            style={[styles.button, styles.logoutButton]}
            textStyle={styles.buttonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6E6FF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F6E6FF',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#B983FF',
    marginBottom: 4,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#A66CFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7F5283',
    marginVertical: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  button: {
    backgroundColor: '#B983FF',
    borderRadius: 24,
    paddingVertical: 14,
    marginVertical: 4,
    shadowColor: '#B983FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: '#E7C6FF',
  },
});