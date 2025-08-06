import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

interface ExampleScreenProps {
  navigation: any;
}

const ExampleScreen: React.FC<ExampleScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 24,
    },
    content: {
      flex: 1,
    },
    featureCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    featureHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    featureDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    highlightText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      marginTop: 8,
    },
    menuPreview: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    previewTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
      textAlign: 'center',
    },
    menuItemPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      backgroundColor: colors.accent,
    },
    previewIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    previewText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    instructionCard: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    instructionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 10,
      textAlign: 'center',
    },
    instructionText: {
      fontSize: 14,
      color: colors.white,
      textAlign: 'center',
      lineHeight: 20,
      opacity: 0.9,
    },
  });

  return (
    <ScreenWrapper navigation={navigation}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🍔 New Burger Menu Design</Text>
        <Text style={styles.subtitle}>
          Experience the redesigned burger menu with modern styling, smooth animations, and enhanced user experience.
        </Text>

        <View style={styles.content}>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>🎯 How to Use</Text>
            <Text style={styles.instructionText}>
              Tap the hamburger icon in the header to open the redesigned menu. 
              The menu features smooth animations, gradient backgrounds, and detailed navigation items.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIcon}>
                <Feather name="zap" size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Enhanced Animations</Text>
            </View>
            <Text style={styles.featureDescription}>
              Smooth slide-in animation with fade overlay. The menu gracefully appears with parallel animations for a polished feel.
            </Text>
            <Text style={styles.highlightText}>✨ Smooth transitions and professional animations</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIcon}>
                <Feather name="droplet" size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Modern Design</Text>
            </View>
            <Text style={styles.featureDescription}>
              Gradient header with app branding, card-based menu items with shadows, and detailed descriptions for each section.
            </Text>
            <Text style={styles.highlightText}>🎨 Beautiful gradients and modern card design</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIcon}>
                <Feather name="user" size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>User Profile Section</Text>
            </View>
            <Text style={styles.featureDescription}>
              Personalized welcome section with user avatar and status. Makes the menu feel more personal and engaging.
            </Text>
            <Text style={styles.highlightText}>👤 Personalized user experience</Text>
          </View>

          <View style={styles.menuPreview}>
            <Text style={styles.previewTitle}>📱 Menu Items Preview</Text>
            
            <View style={styles.menuItemPreview}>
              <View style={styles.previewIcon}>
                <Feather name="home" size={16} color={colors.white} />
              </View>
              <Text style={styles.previewText}>Home - Your personalized dashboard</Text>
            </View>

            <View style={styles.menuItemPreview}>
              <View style={styles.previewIcon}>
                <Feather name="users" size={16} color={colors.white} />
              </View>
              <Text style={styles.previewText}>Mentorship - Connect with mentors and mentees</Text>
            </View>

            <View style={styles.menuItemPreview}>
              <View style={styles.previewIcon}>
                <Feather name="book-open" size={16} color={colors.white} />
              </View>
              <Text style={styles.previewText}>Learning Center - Educational resources and courses</Text>
            </View>

            <View style={styles.menuItemPreview}>
              <View style={styles.previewIcon}>
                <Feather name="calendar" size={16} color={colors.white} />
              </View>
              <Text style={styles.previewText}>Events & Workshops - Upcoming events and workshops</Text>
            </View>

            <View style={styles.menuItemPreview}>
              <View style={styles.previewIcon}>
                <Feather name="message-square" size={16} color={colors.white} />
              </View>
              <Text style={styles.previewText}>Communities - Join discussions and groups</Text>
            </View>

            <View style={styles.menuItemPreview}>
              <View style={styles.previewIcon}>
                <Feather name="user" size={16} color={colors.white} />
              </View>
              <Text style={styles.previewText}>Profile - Manage your account and settings</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIcon}>
                <Feather name="smartphone" size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Responsive Design</Text>
            </View>
            <Text style={styles.featureDescription}>
              Optimized for all screen sizes with proper spacing, shadows, and touch targets. Works seamlessly on both iOS and Android.
            </Text>
            <Text style={styles.highlightText}>📱 Perfect on all devices and screen sizes</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIcon}>
                <Feather name="moon" size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Theme Support</Text>
            </View>
            <Text style={styles.featureDescription}>
              Automatically adapts to light and dark themes. Uses your app's color scheme for consistent branding throughout.
            </Text>
            <Text style={styles.highlightText}>🌙 Seamless theme integration</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ExampleScreen; 