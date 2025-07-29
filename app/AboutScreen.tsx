import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import InfoCard from '../components/InfoCard';
import BackButton from '../components/BackButton';

type RootStackParamList = {
  About: undefined;
};

type AboutScreenProps = NativeStackScreenProps<RootStackParamList, 'About'>;

export default function AboutScreen({ navigation }: AboutScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <BackButton />
          </View>
          <Text style={styles.title}>About Athena</Text>
          <Text style={styles.subtitle}>Empowering Women in STEM</Text>
        </View>

        {/* About Us Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="users" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>About Us</Text>
          </View>
          <InfoCard 
            title="Our Story"
            content="Despite progress in gender equality, women remain underrepresented in STEM fields. Deep-rooted stereotypes, lack of role models, and systemic biases often discourage young girls from pursuing STEM careers."
          />
          <Text style={styles.additionalText}>
            We believe that diversity in STEM leads to better innovation, more creative solutions, and a more inclusive future. Our platform is designed to address the unique challenges that women face in STEM fields and provide the support they need to thrive.
          </Text>
        </View>

        {/* Our Mission Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="target" size={24} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <InfoCard 
            title="Breaking Barriers"
            content="Athena is here to break barriers! We foster inclusive environments, provide mentorship, and promote STEM education for young women, empowering the next generation of female tech leaders."
          />
          <Text style={styles.additionalText}>
            Through mentorship programs, educational resources, and community building, we're creating a network of support that helps women overcome obstacles and achieve their full potential in STEM careers.
          </Text>
        </View>

        {/* Our Vision Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="eye" size={24} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Our Vision</Text>
          </View>
          <Text style={styles.visionText}>
            We envision a world where women are equally represented in all STEM fields, where their contributions are valued and celebrated, and where the next generation of female scientists, engineers, and technologists can pursue their dreams without barriers.
          </Text>
        </View>

        {/* Our Values Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Our Values</Text>
          </View>
          <View style={styles.valuesContainer}>
            <View style={styles.valueItem}>
              <Feather name="users" size={20} color={COLORS.primary} />
              <Text style={styles.valueTitle}>Inclusivity</Text>
              <Text style={styles.valueDescription}>Creating welcoming spaces for all women in STEM</Text>
            </View>
            <View style={styles.valueItem}>
              <Feather name="book-open" size={20} color={COLORS.secondary} />
              <Text style={styles.valueTitle}>Education</Text>
              <Text style={styles.valueDescription}>Providing quality learning resources and mentorship</Text>
            </View>
            <View style={styles.valueItem}>
              <Feather name="award" size={20} color={COLORS.accent} />
              <Text style={styles.valueTitle}>Excellence</Text>
              <Text style={styles.valueDescription}>Supporting women to achieve their highest potential</Text>
            </View>
            <View style={styles.valueItem}>
              <Feather name="shield" size={20} color={COLORS.primary} />
              <Text style={styles.valueTitle}>Support</Text>
              <Text style={styles.valueDescription}>Building a strong community of mutual support</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="mail" size={24} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>Get in Touch</Text>
          </View>
          <Text style={styles.contactText}>
            Have questions or want to get involved? We'd love to hear from you! Reach out to us through the app or join our community discussions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 12,
  },
  additionalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'justify',
  },
  visionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  valuesContainer: {
    gap: 16,
  },
  valueItem: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  contactText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
}); 