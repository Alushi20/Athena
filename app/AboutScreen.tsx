import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Animated, Dimensions, StatusBar } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';

const { width, height } = Dimensions.get('window');

export default function AboutScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Navigation Header - Fixed and Always Visible */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton color={COLORS.white} />
        </View>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>About Athena</Text>
            <Text style={styles.headerSubtitle}>Our mission to keep women in STEM</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Handle share action
                console.log('Share About Athena');
              }}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={20} color={COLORS.white} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Handle more options
                console.log('More options');
              }}
              activeOpacity={0.8}
            >
              <Feather name="more-horizontal" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <View style={styles.heroIcon}>
                  <Feather name="shield" size={40} color={COLORS.white} />
                </View>
                <View style={styles.heroIconGlow} />
              </View>
              <Text style={styles.heroTitle}>Keeping Women in STEM</Text>
              <Text style={styles.heroSubtitle}>
                Building communities and connections that prevent women from leaving STEM fields
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>65%</Text>
                  <Text style={styles.statLabel}>Women Leave STEM</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>28%</Text>
                  <Text style={styles.statLabel}>Leadership Roles</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>85%</Text>
                  <Text style={styles.statLabel}>Stay Rate</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Problem Statement */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="error" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>The Real Problem</Text>
          </View>
          <View style={styles.problemCard}>
            <Text style={styles.problemTitle}>Women Are Leaving STEM, Not Just Not Entering</Text>
            <Text style={styles.problemText}>
              While there's equal opportunity for men and women to join STEM fields, the real issue is that women are leaving STEM careers at alarming rates. The problem isn't entry—it's retention.
            </Text>
            <Text style={styles.problemText}>
              The inequality becomes most apparent in leadership roles, where women are significantly underrepresented. Our research shows that 65% of women in STEM consider leaving their field within 5 years.
            </Text>
            <View style={styles.problemPoints}>
              <View style={styles.pointItem}>
                <Feather name="trending-down" size={20} color={COLORS.error} />
                <Text style={styles.pointText}>65% of women leave STEM within 5 years</Text>
              </View>
              <View style={styles.pointItem}>
                <Feather name="users" size={20} color={COLORS.warning} />
                <Text style={styles.pointText}>Only 28% of STEM leadership roles held by women</Text>
              </View>
              <View style={styles.pointItem}>
                <Feather name="heart" size={20} color={COLORS.success} />
                <Text style={styles.pointText}>Lack of community and belonging</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Our Solution */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.accent }]}>
              <Ionicons name="bulb" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>Our Unique Solution</Text>
          </View>
          <View style={styles.solutionCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.solutionGradient}
            >
              <Text style={styles.solutionText}>
                Athena goes beyond traditional mentorship apps by creating physical communities and events that address the root causes of women leaving STEM. We combine digital connectivity with real-world experiences.
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Core Values - Redesigned */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.success }]}>
              <Feather name="heart" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>Our Core Values</Text>
          </View>
          
          <View style={styles.valuesContainer}>
            <View style={styles.valueRow}>
              <View style={styles.valueCard}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.valueGradient}
                >
                  <View style={styles.valueIconContainer}>
                    <Feather name="users" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.valueTitle}>Community First</Text>
                  <Text style={styles.valueDescription}>Building physical and digital communities that create lasting connections</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.valueCard}>
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.accent]}
                  style={styles.valueGradient}
                >
                  <View style={styles.valueIconContainer}>
                    <Feather name="map-pin" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.valueTitle}>Physical Events</Text>
                  <Text style={styles.valueDescription}>Organizing conventions, workshops, and meetups that bring women together</Text>
                </LinearGradient>
              </View>
            </View>
            
            <View style={styles.valueRow}>
              <View style={styles.valueCard}>
                <LinearGradient
                  colors={[COLORS.accent, COLORS.success]}
                  style={styles.valueGradient}
                >
                  <View style={styles.valueIconContainer}>
                    <Feather name="shield" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.valueTitle}>Safety & Trust</Text>
                  <Text style={styles.valueDescription}>Collaborating with universities and companies for secure environments</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.valueCard}>
                <LinearGradient
                  colors={[COLORS.success, COLORS.primary]}
                  style={styles.valueGradient}
                >
                  <View style={styles.valueIconContainer}>
                    <Feather name="target" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.valueTitle}>Retention Focus</Text>
                  <Text style={styles.valueDescription}>Addressing the specific challenges that cause women to leave STEM</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Unique Features */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
              <MaterialIcons name="star" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>What Makes Us Different</Text>
          </View>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name="calendar" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>Physical Events</Text>
              <Text style={styles.featureDescription}>Organized conventions, workshops, and networking events</Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name="map-pin" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.featureTitle}>Local Communities</Text>
              <Text style={styles.featureDescription}>City-specific groups that create real belonging</Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name="shield" size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.featureTitle}>University Partnerships</Text>
              <Text style={styles.featureDescription}>Collaborations with educational institutions for safety</Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name="users" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.featureTitle}>Meeting System</Text>
              <Text style={styles.featureDescription}>Invite and organize one-on-one or group meetings</Text>
            </View>
          </View>
        </Animated.View>

        {/* Impact Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
              <MaterialIcons name="trending-up" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>Our Target Impact</Text>
          </View>
          <View style={styles.impactGrid}>
            <View style={styles.impactCard}>
              <Text style={styles.impactNumber}>85%</Text>
              <Text style={styles.impactLabel}>Retention Rate</Text>
            </View>
            <View style={styles.impactCard}>
              <Text style={styles.impactNumber}>50+</Text>
              <Text style={styles.impactLabel}>Cities Covered</Text>
            </View>
            <View style={styles.impactCard}>
              <Text style={styles.impactNumber}>1000+</Text>
              <Text style={styles.impactLabel}>Events Organized</Text>
            </View>
            <View style={styles.impactCard}>
              <Text style={styles.impactNumber}>95%</Text>
              <Text style={styles.impactLabel}>Satisfaction Rate</Text>
            </View>
          </View>
        </Animated.View>

        {/* Contact Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary }]}>
              <Feather name="mail" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>Join Our Movement</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactText}>
              Ready to be part of the solution? Join our community of women in STEM, attend our events, or help us organize activities in your city. Together, we can change the retention statistics.
            </Text>
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={() => {
                  // Handle join community action
                  console.log('Join Community pressed');
                }}
              >
                <Feather name="users" size={20} color={COLORS.white} />
                <Text style={styles.primaryButtonText}>Join Community</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => {
                  // Handle find events action
                  console.log('Find Events pressed');
                }}
              >
                <Feather name="calendar" size={20} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Find Events</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroGradient: {
    borderRadius: 20,
    margin: 20,
    overflow: 'hidden',
  },
  heroContent: {
    padding: 32,
    alignItems: 'center',
  },
  heroIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  heroIconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -10,
    left: -10,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  problemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  problemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  problemText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  problemPoints: {
    gap: 12,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pointText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  solutionCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  solutionGradient: {
    padding: 24,
  },
  solutionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  valuesContainer: {
    gap: 16,
  },
  valueRow: {
    flexDirection: 'row',
    gap: 12,
  },
  valueCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  valueGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  valueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  valueDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  impactCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  impactNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  contactText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 