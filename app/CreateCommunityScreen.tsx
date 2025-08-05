import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  StatusBar 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import BackButton from '../components/BackButton';

const CATEGORIES = [
  { id: 'career', name: 'Career', icon: 'briefcase' },
  { id: 'support', name: 'Support', icon: 'heart' },
  { id: 'advocacy', name: 'Advocacy', icon: 'shield' },
  { id: 'events', name: 'Events', icon: 'calendar' },
  { id: 'mentorship', name: 'Mentorship', icon: 'users' },
  { id: 'leadership', name: 'Leadership', icon: 'crown' },
  { id: 'wellness', name: 'Wellness', icon: 'leaf' },
  { id: 'tech', name: 'Tech', icon: 'code' },
  { id: 'other', name: 'Other', icon: 'plus' }
];

const PRIVACY_OPTIONS = [
  { id: 'public', name: 'Public', description: 'Anyone can find and join', icon: 'globe' },
  { id: 'private', name: 'Private', description: 'Invite-only community', icon: 'lock' }
];

export default function CreateCommunityScreen({ navigation }: any) {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
  const [tags, setTags] = useState('');
  const [rules, setRules] = useState('');

  const handleCreateCommunity = () => {
    if (!communityName.trim()) {
      Alert.alert('Error', 'Please enter a community name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // Here you would typically save to your database
    const newCommunity = {
      id: Date.now().toString(),
      title: communityName,
      description: description,
      category: selectedCategory,
      privacy: selectedPrivacy,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      rules: rules,
      memberCount: 1,
      isJoined: true,
      createdAt: new Date().toISOString()
    };

    Alert.alert(
      'Success!',
      'Your community has been created successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Navigation Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton color={COLORS.white} />
        </View>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Create Community</Text>
            <Text style={styles.headerSubtitle}>Build a space for women in STEM</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Handle help action
                Alert.alert('Help', 'Need help creating your community? Contact support.');
              }}
              activeOpacity={0.8}
            >
              <Feather name="help-circle" size={20} color={COLORS.white} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Handle save draft action
                Alert.alert('Draft Saved', 'Your community draft has been saved.');
              }}
              activeOpacity={0.8}
            >
              <Feather name="save" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Community Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter community name"
            value={communityName}
            onChangeText={setCommunityName}
            maxLength={50}
          />
          <Text style={styles.characterCount}>{communityName.length}/50</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what your community is about..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.selectedCategoryCard
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <MaterialCommunityIcons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.id ? COLORS.white : COLORS.primary} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <View style={styles.privacyOptions}>
            {PRIVACY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.privacyCard,
                  selectedPrivacy === option.id && styles.selectedPrivacyCard
                ]}
                onPress={() => setSelectedPrivacy(option.id)}
              >
                <View style={styles.privacyHeader}>
                  <Feather 
                    name={option.icon as any} 
                    size={20} 
                    color={selectedPrivacy === option.id ? COLORS.white : COLORS.primary} 
                  />
                  <Text style={[
                    styles.privacyTitle,
                    selectedPrivacy === option.id && styles.selectedPrivacyText
                  ]}>
                    {option.name}
                  </Text>
                </View>
                <Text style={[
                  styles.privacyDescription,
                  selectedPrivacy === option.id && styles.selectedPrivacyDescription
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tags separated by commas (e.g., women, STEM, career)"
            value={tags}
            onChangeText={setTags}
          />
          <Text style={styles.helperText}>
            Tags help others discover your community
          </Text>
        </View>

        {/* Community Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Rules (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Set guidelines for your community members..."
            value={rules}
            onChangeText={setRules}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.helperText}>
            Clear rules help maintain a positive environment
          </Text>
        </View>

        {/* Create Button */}
        <View style={styles.createButtonContainer}>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateCommunity}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={20} color={COLORS.white} />
            <Text style={styles.createButtonText}>Create Community</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 10,
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  selectedCategoryCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  privacyOptions: {
    gap: 12,
  },
  privacyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  selectedPrivacyCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  selectedPrivacyText: {
    color: COLORS.white,
  },
  privacyDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 28,
  },
  selectedPrivacyDescription: {
    color: COLORS.white,
    opacity: 0.9,
  },
  createButtonContainer: {
    paddingVertical: 20,
    marginBottom: 40,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 