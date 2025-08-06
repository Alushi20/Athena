import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface BurgerMenuProps {
  navigation: any;
  isVisible: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  screen: string;
  params?: any;
  description?: string;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ navigation, isVisible, onToggle }) => {
  const { colors } = useTheme();
  const [slideAnim] = useState(new Animated.Value(-width));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const menuItems: MenuItem[] = [
    { 
      id: 'home', 
      title: 'Home', 
      icon: 'home', 
      screen: 'Main', 
      params: { screen: 'HomeTab' },
      description: 'Your personalized dashboard'
    },
    { 
      id: 'mentorship', 
      title: 'Mentorship', 
      icon: 'users', 
      screen: 'Main', 
      params: { screen: 'MentorshipTab' },
      description: 'Connect with mentors and mentees'
    },
    { 
      id: 'learning', 
      title: 'Learning Center', 
      icon: 'book-open', 
      screen: 'Main', 
      params: { screen: 'LearningCenterTab' },
      description: 'Educational resources and courses'
    },
    { 
      id: 'events', 
      title: 'Events & Workshops', 
      icon: 'calendar', 
      screen: 'Main', 
      params: { screen: 'EventsWorkshopsTab' },
      description: 'Upcoming events and workshops'
    },
    { 
      id: 'communities', 
      title: 'Communities', 
      icon: 'message-square', 
      screen: 'Main', 
      params: { screen: 'CommunitiesTab' },
      description: 'Join discussions and groups'
    },
    { 
      id: 'profile', 
      title: 'Profile', 
      icon: 'user', 
      screen: 'Main', 
      params: { screen: 'ProfileTab' },
      description: 'Manage your account and settings'
    },
    { 
      id: 'achievements', 
      title: 'Achievements', 
      icon: 'award', 
      screen: 'Achievements',
      description: 'Track your progress and badges'
    },
    { 
      id: 'about', 
      title: 'About', 
      icon: 'info', 
      screen: 'About',
      description: 'Learn more about Athena'
    },
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    onToggle();
    
    // Handle different navigation patterns
    if (item.screen === 'Main') {
      // Navigate to a tab within the Main stack
      navigation.navigate('Main', item.params);
    } else {
      // Navigate to a standalone screen in the root stack
      navigation.navigate(item.screen, item.params);
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1000,
    },
    menuContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width * 0.85,
      height: height,
      backgroundColor: colors.background,
      zIndex: 1001,
      shadowColor: '#000',
      shadowOffset: {
        width: 4,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 25,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      overflow: 'hidden',
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    logoIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
      marginBottom: 20,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 15,
      padding: 15,
      marginTop: 10,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 2,
    },
    userStatus: {
      fontSize: 12,
      color: colors.white,
      opacity: 0.8,
    },
    menuList: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 8,
      borderRadius: 15,
      backgroundColor: colors.white,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    menuItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 15,
    },
    menuItemContent: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    menuItemDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    menuItemArrow: {
      marginLeft: 10,
    },
    footer: {
      padding: 25,
      borderTopWidth: 1,
      borderTopColor: colors.accent,
      backgroundColor: colors.white,
    },
    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 10,
    },
    versionText: {
      fontSize: 10,
      color: colors.textSecondary,
      textAlign: 'center',
      opacity: 0.7,
    },
  });

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onToggle}
      />
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.headerGradient}
          />
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <MaterialCommunityIcons name="atom" size={24} color={colors.white} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Athena</Text>
                <Text style={styles.headerSubtitle}>Empowering Women in STEM</Text>
              </View>
            </View>
            
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <Feather name="user" size={20} color={colors.white} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Welcome back!</Text>
                <Text style={styles.userStatus}>Ready to grow your skills?</Text>
              </View>
            </View>
          </View>

          <ScrollView 
            style={styles.menuList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemIcon}>
                  <Feather name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </View>
                <View style={styles.menuItemArrow}>
                  <Feather name="chevron-right" size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Athena App</Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  );
};

export default BurgerMenu; 