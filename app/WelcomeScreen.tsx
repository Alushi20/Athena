import React, { useRef, useEffect } from "react";
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp } from "@react-navigation/native";
import { COLORS } from '../constants/Colors';

type WelcomeScreenProps = {
  navigation: NavigationProp<any>;
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  // Animations
  const overlayFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const diamondScale = useRef(new Animated.Value(0.8)).current;
  const diamondRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(overlayFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
    // Looping diamond animation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(diamondScale, {
            toValue: 1.05,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(diamondScale, {
            toValue: 0.95,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ]),
        Animated.timing(diamondRotate, {
          toValue: 1,
          duration: 2400,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  // Interpolate rotation
  const rotate = diamondRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['45deg', '405deg']
  });

  // Button press animation
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require("./HOME_PAGE.jpg")}
      style={styles.background}
    >
      {/* Gradient Overlay */}
      <LinearGradient
        colors={COLORS.welcomeGradient}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {/* Geometric Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayFade }]}>  
        <Animated.View
          style={[
            styles.diamond,
            {
              transform: [
                { scale: diamondScale },
                { rotate }
              ]
            }
          ]}
        />
        <View style={styles.borderLayer} />
        <View style={[styles.borderLayer, styles.borderLayer2]} />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.container, { opacity: contentFade, transform: [{ translateY: contentFade.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }]}> 
        <Text style={styles.title}>Welcome to Athena</Text>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => navigation.navigate("LoginPage")}
          >
            <Text style={styles.buttonText}>Let's Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  diamond: {
    position: "absolute",
    width: "70%",
    height: "40%",
    backgroundColor: COLORS.accent,
    transform: [{ rotate: "45deg" }],
    borderRadius: 32,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  borderLayer: {
    position: "absolute",
    width: "75%",
    height: "45%",
    borderWidth: 10,
    borderColor: COLORS.secondary,
    borderRadius: 36,
    transform: [{ rotate: "45deg" }],
  },
  borderLayer2: {
    width: "80%",
    height: "50%",
    borderColor: COLORS.primary,
  },
  container: {
    backgroundColor: "rgba(80, 0, 80, 0.35)",
    padding: 28,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 40,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 28,
    letterSpacing: 1.2,
    textShadowColor: COLORS.secondary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    paddingHorizontal: 38,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 19,
    color: COLORS.white,
    fontWeight: "bold",
    letterSpacing: 1.1,
  },
});
