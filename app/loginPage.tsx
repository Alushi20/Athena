import React, { useState, useRef } from "react";
import { View, Text, SafeAreaView, TextInput, Alert, Animated, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Account } from "react-native-appwrite";
import { client } from "../lib/appwrite"; // Ensure correct path
import { ID } from "react-native-appwrite";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const account = new Account(client);

export default function LoginPage({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const formAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  const loginBtnScale = useRef(new Animated.Value(1)).current;
  const signupBtnScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: error ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [error]);

  const signup = async () => {
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.log("No active session found, continuing...");
    }
    try {
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      const userId = ID.unique();
      const newUser = await account.create(userId, email, password, "New User");
      let session = await account.createEmailPasswordSession(email, password);
      Alert.alert("Account Created", "Welcome!");
      navigation.replace("Home");
    } catch (createErr: any) {
      setError(createErr.message);
    }
  };

  const handleLogin = async () => {
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.log("No active session found, continuing...");
    }
    try {
      let session = await account.createEmailPasswordSession(email, password);
      Alert.alert("Login Successful", "Welcome back!");
      navigation.replace("Home");
    } catch (err: any) {
      setError("Incorrect password. Please try again.");
    }
  };

  // Button press animation helpers
  const animateBtnIn = (btnScale: Animated.Value) => {
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const animateBtnOut = (btnScale: Animated.Value) => {
    Animated.spring(btnScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <LinearGradient
      colors={["#e7c6ff", "#b983ff", "#a66cff", "#f6e6ff"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: formAnim,
                transform: [
                  { translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }
                ]
              }
            ]}
          >
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your Athena account</Text>
            <Animated.View
              style={{
                opacity: errorAnim,
                transform: [
                  { translateY: errorAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }
                ],
                marginBottom: error ? 10 : 0
              }}
            >
              {error && <Text style={styles.errorText}>{error}</Text>}
            </Animated.View>
            {/* Email Input */}
            <View style={[styles.inputWrapper, focused.email && styles.inputFocused]}>
              <MaterialIcons name="email" size={22} color={focused.email ? "#a66cff" : "#b983ff"} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(f => ({ ...f, email: true }))}
                onBlur={() => setFocused(f => ({ ...f, email: false }))}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#b983ff"
              />
            </View>
            {/* Password Input */}
            <View style={[styles.inputWrapper, focused.password && styles.inputFocused]}>
              <Feather name="lock" size={22} color={focused.password ? "#a66cff" : "#b983ff"} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused(f => ({ ...f, password: true }))}
                onBlur={() => setFocused(f => ({ ...f, password: false }))}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#b983ff"
              />
            </View>
            {/* Login Button */}
            <Animated.View style={{ width: '100%', marginTop: 18, transform: [{ scale: loginBtnScale }] }}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPressIn={() => animateBtnIn(loginBtnScale)}
                onPressOut={() => animateBtnOut(loginBtnScale)}
                onPress={handleLogin}
              >
                <Feather name="log-in" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </Animated.View>
            {/* Signup Button */}
            <Animated.View style={{ width: '100%', marginTop: 10, transform: [{ scale: signupBtnScale }] }}>
              <TouchableOpacity
                style={[styles.button, styles.signupButton]}
                activeOpacity={0.85}
                onPressIn={() => animateBtnIn(signupBtnScale)}
                onPressOut={() => animateBtnOut(signupBtnScale)}
                onPress={signup}
              >
                <Feather name="user-plus" size={20} color="#a66cff" style={{ marginRight: 8 }} />
                <Text style={[styles.buttonText, { color: '#a66cff' }]}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  formContainer: {
    width: 320,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a66cff',
    marginBottom: 6,
    letterSpacing: 1.1,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f5283',
    marginBottom: 18,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff4d6d',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6e6ff',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#f6e6ff',
    width: '100%',
    height: 48,
    shadowColor: '#b983ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#a66cff',
    backgroundColor: '#fff',
    shadowOpacity: 0.18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#7f5283',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a66cff',
    borderRadius: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  signupButton: {
    backgroundColor: '#f6e6ff',
    borderWidth: 2,
    borderColor: '#a66cff',
  },
});
