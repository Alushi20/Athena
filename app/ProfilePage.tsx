import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Alert, 
  TextInput, 
  Animated, 
  Platform, 
  Linking,
  ScrollView,
  Dimensions,
  Modal,
  FlatList
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton";
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome, 
  Entypo,
  AntDesign,
  MaterialIcons,
  Octicons,
  SimpleLineIcons
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS,FONTS } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";
// Firebase imports
import { auth, db } from "../lib/firebase-config.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

// Define the screen params for type safety
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  LoginPage: undefined;
};

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { colors, theme, toggleTheme } = useTheme();
  
  // Basic Profile Data
  const [email, setEmail] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");
  const [interests, setInterests] = useState<string>("");
  
  // Professional Info
  const [company, setCompany] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [certifications, setCertifications] = useState<string>("");
  
  // Files & Documents
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
  const [verificationDocName, setVerificationDocName] = useState<string | null>(null);
  
  // Settings & Preferences
  const [themeDark, setThemeDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [mentorshipNotifications, setMentorshipNotifications] = useState(true);
  const [workshopNotifications, setWorkshopNotifications] = useState(true);
  const [eventNotifications, setEventNotifications] = useState(true);
  const [privacyPublic, setPrivacyPublic] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [role, setRole] = useState<'mentor' | 'mentee'>('mentee');
  
  // Progress & Stats
  const [totalPoints, setTotalPoints] = useState(100);
  const [level, setLevel] = useState(2);
  const [levelProgress, setLevelProgress] = useState(60);

  const tabs = [
    { id: 'personal', title: 'Personal', icon: 'user' },
    { id: 'professional', title: 'Professional', icon: 'briefcase' },
    { id: 'documents', title: 'Documents', icon: 'file-text' },
    { id: 'progress', title: 'Progress', icon: 'trending-up' },
    { id: 'connections', title: 'Current Connections', icon: 'users' },
    { id: 'settings', title: 'Settings', icon: 'settings' },
  ];

  useEffect(() => {
    fetchUserData();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  async function fetchUserData() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      // Get user data from Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Set basic profile data
        setEmail(currentUser.email);
        setDisplayName(userData.name || currentUser.displayName);
        setUsername(userData.username || "");
        setBio(userData.bio || "");
        setPhone(userData.phone || "");
        setLocation(userData.location || "");
        setSkills(userData.skills || []);
        setRole(userData.role || 'mentee');
        setShowPhone(userData.showPhone || false);
        
        // Set professional info
        setCompany(userData.company || "");
        setPosition(userData.position || "");
        setExperience(userData.experience || "");
        setEducation(userData.education || "");
        setCertifications(userData.certifications || "");
        
        // Set social links
        setLinkedIn(userData.linkedIn || "");
        setGithub(userData.github || "");
        setWebsite(userData.website || "");
        
        // Set additional info
        setTimezone(userData.timezone || "");
        setLanguages(userData.languages || "");
        setInterests(userData.interests || "");
        
        // Set documents
        setCvUrl(userData.cvUrl || null);
        setCvName(userData.cvName || null);
        setPortfolioUrl(userData.portfolioUrl || null);
        setVerificationStatus(userData.verificationStatus || 'unverified');
        setVerificationDocName(userData.verificationDocName || null);
        
        // Set settings
        setThemeDark(userData.themeDark || false);
        setNotifications(userData.notifications !== false);
        setEmailNotifications(userData.emailNotifications !== false);
        setPushNotifications(userData.pushNotifications !== false);
        setMentorshipNotifications(userData.mentorshipNotifications !== false);
        setWorkshopNotifications(userData.workshopNotifications !== false);
        setEventNotifications(userData.eventNotifications !== false);
        setPrivacyPublic(userData.privacyPublic !== false);
        setShowEmail(userData.showEmail !== false);
        setShowLocation(userData.showLocation !== false);
        
        // Set profile picture
        setProfilePic(userData.profilePicUrl || null);
        
      } else {
        console.log("No user document found");
        setError('User profile not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }

  const renderSkillTags = (skillsArray: string[]) => {
    if (!skillsArray || skillsArray.length === 0) return null;
    return (
      <View style={styles.skillsContainer}>
        {skillsArray.map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSocialLinks = () => {
    return (
      <View style={styles.socialLinksContainer}>
        {linkedIn && (
          <TouchableOpacity style={styles.socialLink} onPress={() => Linking.openURL(linkedIn)}>
            <Feather name="linkedin" size={20} color={COLORS.primary} />
            <Text style={styles.socialLinkText}>LinkedIn</Text>
          </TouchableOpacity>
        )}
        {github && (
          <TouchableOpacity style={styles.socialLink} onPress={() => Linking.openURL(github)}>
            <Feather name="github" size={20} color={COLORS.primary} />
            <Text style={styles.socialLinkText}>GitHub</Text>
          </TouchableOpacity>
        )}
        {website && (
          <TouchableOpacity style={styles.socialLink} onPress={() => Linking.openURL(website)}>
            <Feather name="globe" size={20} color={COLORS.primary} />
            <Text style={styles.socialLinkText}>Website</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePic(result.assets[0].uri);
        // TODO: Upload to Firebase Storage and update profile
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.assets && result.assets.length > 0) {
        setCvName(result.assets[0].name);
        // TODO: Upload to Firebase Storage and update profile
      }
    } catch (error) {
      console.error('Error picking CV:', error);
      Alert.alert('Error', 'Failed to pick CV');
    }
  };

  const pickVerificationDoc = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.assets && result.assets.length > 0) {
        setVerificationDocName(result.assets[0].name);
        // TODO: Upload to Firebase Storage and update profile
      }
    } catch (error) {
      console.error('Error picking verification document:', error);
      Alert.alert('Error', 'Failed to pick verification document');
    }
  };

  const toggleThemeSetting = async () => {
    setThemeDark(!themeDark);
    toggleTheme();
  };

  const toggleNotifications = async () => {
    setNotifications(!notifications);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'No user logged in');
        return;
      }

      // Update user data in Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        name: displayName,
        username: username,
        bio: bio,
        phone: phone,
        location: location,
        skills: skills,
        company: company,
        position: position,
        experience: experience,
        education: education,
        certifications: certifications,
        linkedIn: linkedIn,
        github: github,
        website: website,
        timezone: timezone,
        languages: languages,
        interests: interests,
        showPhone: showPhone,
        showEmail: showEmail,
        showLocation: showLocation,
        themeDark: themeDark,
        notifications: notifications,
        emailNotifications: emailNotifications,
        pushNotifications: pushNotifications,
        mentorshipNotifications: mentorshipNotifications,
        workshopNotifications: workshopNotifications,
        eventNotifications: eventNotifications,
        privacyPublic: privacyPublic,
        // TODO: Add profile picture and document URLs when Firebase Storage is implemented
      });

      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="user" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Basic Information</Text>
              </View>
              
              

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Your username" 
                  value={username} 
                  onChangeText={setUsername}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Tell us about yourself" 
                  value={bio} 
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Your phone number" 
                  value={phone} 
                  onChangeText={setPhone}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Your location" 
                  value={location} 
                  onChangeText={setLocation}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Skills</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Skills (comma separated)" 
                  value={skills.join(', ')} 
                  onChangeText={text => setSkills(text.split(',').map(s => s.trim()))}
                  editable={editMode}
                />
                {renderSkillTags(skills)}
              </View>

              {renderSocialLinks()}
            </View>
          </ScrollView>
        );

      case 'professional':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="briefcase" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Professional Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Company</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Your company" 
                  value={company} 
                  onChangeText={setCompany}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Position</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Your position" 
                  value={position} 
                  onChangeText={setPosition}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Experience</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Your experience" 
                  value={experience} 
                  onChangeText={setExperience}
                  multiline
                  numberOfLines={3}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Education</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Your education" 
                  value={education} 
                  onChangeText={setEducation}
                  multiline
                  numberOfLines={3}
                  editable={editMode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Certifications</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Your certifications" 
                  value={certifications} 
                  onChangeText={setCertifications}
                  multiline
                  numberOfLines={3}
                  editable={editMode}
                />
              </View>
            </View>
          </ScrollView>
        );

      case 'documents':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="file-text" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Documents</Text>
              </View>
              
              <View style={styles.documentSection}>
                <Text style={styles.documentTitle}>CV/Resume</Text>
                <TouchableOpacity style={styles.documentButton} onPress={pickCV}>
                  <Feather name="upload" size={20} color={COLORS.primary} />
                  <Text style={styles.documentButtonText}>
                    {cvName ? `Update CV (${cvName})` : 'Upload CV'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.documentSection}>
                <Text style={styles.documentTitle}>Verification Document</Text>
                <TouchableOpacity style={styles.documentButton} onPress={pickVerificationDoc}>
                  <Feather name="upload" size={20} color={COLORS.primary} />
                  <Text style={styles.documentButtonText}>
                    {verificationDocName ? `Update Document (${verificationDocName})` : 'Upload Document'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.verificationStatus}>
                  Status: {verificationStatus}
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'progress':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="trending-up" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Profile Completeness Progress</Text>
              </View>
              
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Profile Completion</Text>
                  <Text style={styles.progressPercentage}>75%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '75%' }]} />
                  </View>
                </View>
                <Text style={styles.progressSubtext}>Complete your profile to unlock more features</Text>
              </View>

              <View style={styles.checklistSection}>
                <Text style={styles.checklistTitle}>Profile Checklist</Text>
                <View style={styles.checklistItem}>
                  <Feather 
                    name={displayName ? "check-circle" : "circle"} 
                    size={20} 
                    color={displayName ? COLORS.success : COLORS.textSecondary} 
                  />
                  <Text style={[styles.checklistText, displayName && styles.checklistTextCompleted]}>
                    Add your display name
                  </Text>
                </View>
                <View style={styles.checklistItem}>
                  <Feather 
                    name={bio ? "check-circle" : "circle"} 
                    size={20} 
                    color={bio ? COLORS.success : COLORS.textSecondary} 
                  />
                  <Text style={[styles.checklistText, bio && styles.checklistTextCompleted]}>
                    Write your bio
                  </Text>
                </View>
                <View style={styles.checklistItem}>
                  <Feather 
                    name={skills.length > 0 ? "check-circle" : "circle"} 
                    size={20} 
                    color={skills.length > 0 ? COLORS.success : COLORS.textSecondary} 
                  />
                  <Text style={[styles.checklistText, skills.length > 0 && styles.checklistTextCompleted]}>
                    Add your skills
                  </Text>
                </View>
                <View style={styles.checklistItem}>
                  <Feather 
                    name={company ? "check-circle" : "circle"} 
                    size={20} 
                    color={company ? COLORS.success : COLORS.textSecondary} 
                  />
                  <Text style={[styles.checklistText, company && styles.checklistTextCompleted]}>
                    Add your company
                  </Text>
                </View>
                <View style={styles.checklistItem}>
                  <Feather 
                    name={cvName ? "check-circle" : "circle"} 
                    size={20} 
                    color={cvName ? COLORS.success : COLORS.textSecondary} 
                  />
                  <Text style={[styles.checklistText, cvName && styles.checklistTextCompleted]}>
                    Upload your CV
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'connections':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="users" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Current Connections</Text>
              </View>
              
              <View style={styles.connectionsContainer}>
                <Text style={styles.noConnectionsText}>No active connections yet</Text>
                <Text style={styles.noConnectionsSubtext}>Start connecting with mentors and mentees!</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'settings':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="settings" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Settings</Text>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Dark Theme</Text>
                  <Text style={styles.settingDescription}>Switch to dark mode</Text>
                </View>
                <Switch 
                  value={themeDark} 
                  onValueChange={toggleThemeSetting}
                  trackColor={{ false: COLORS.textSecondary, true: COLORS.primary }}
                  thumbColor={themeDark ? COLORS.white : COLORS.white}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>Receive push notifications</Text>
                </View>
                <Switch 
                  value={notifications} 
                  onValueChange={toggleNotifications}
                  trackColor={{ false: COLORS.textSecondary, true: COLORS.primary }}
                  thumbColor={notifications ? COLORS.white : COLORS.white}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Public Profile</Text>
                  <Text style={styles.settingDescription}>Make your profile visible to others</Text>
                </View>
                <Switch 
                  value={privacyPublic} 
                  onValueChange={setPrivacyPublic}
                  trackColor={{ false: COLORS.textSecondary, true: COLORS.primary }}
                  thumbColor={privacyPublic ? COLORS.white : COLORS.white}
                />
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView 
        style={[styles.container, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.profileImageWrapper}>
                <Image 
                  source={profilePic ? { uri: profilePic } : require('../assets/images/icon.png')} 
                  style={styles.profileImage} 
                />
                <View style={styles.cameraIconWrapper}>
                  <Feather name="camera" size={16} color={COLORS.white} />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{username || displayName || "No Name"}</Text>
              {role && (
                <View style={[styles.roleTag, { backgroundColor: role === 'mentor' ? COLORS.secondary : COLORS.accent }]}>
                  <Feather 
                    name={role === 'mentor' ? 'award' : 'user'} 
                    size={12} 
                    color={COLORS.white} 
                  />
                  <Text style={styles.roleTagText}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => navigation.navigate('Achievements' as never)}
            >
              <Feather name="bar-chart-2" size={20} color={COLORS.white} />
              <Text style={styles.progressButtonText}>Progress</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && { backgroundColor: COLORS.primary }
                ]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <Feather 
                  name={tab.icon as any} 
                  size={18} 
                  color={activeTab === tab.id ? COLORS.white : COLORS.primary} 
                />
                <Text style={[
                  styles.tabButtonText,
                  activeTab === tab.id && { color: COLORS.white }
                ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Edit/Save Button */}
        <View style={styles.buttonSection}>
          {editMode ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setEditMode(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={saveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={toggleEditMode}
            >
              <Feather name="edit-3" size={20} color={COLORS.white} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <CustomButton
            title="Logout"
            onPress={async () => {
              try {
                // await Account.deleteSession('current'); // Removed Appwrite logout
                // navigation.replace("LoginPage"); // Removed Appwrite logout
                Alert.alert('Info', 'Logout functionality is not yet implemented.');
              } catch (error) {
                Alert.alert('Error', 'Failed to logout');
              }
            }}
            style={[styles.button, styles.logoutButton]}
            textStyle={styles.logoutButtonText}
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
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  headerSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    gap: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roleTagText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  progressButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tabContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  tabScrollContent: {
    paddingHorizontal: 0,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
  },
  tabContent: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  inputGroup: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.text,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  bioContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bioInput: {
    fontSize: 16,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  skillTag: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  skillText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  socialLinksContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialLinkText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  uploadSection: {
    gap: 12,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  uploadContent: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  documentSection: {
    marginTop: 16,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  documentButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  verificationStatus: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  settingsGroup: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  buttonSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Progress and Achievements Styles
  levelCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelInfo: {
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  levelProgressContainer: {
    marginTop: 8,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    marginBottom: 8,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  achievementCardUnlocked: {
    backgroundColor: COLORS.primary,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementIconUnlocked: {
    backgroundColor: COLORS.white,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  achievementTitleUnlocked: {
    color: COLORS.white,
  },
  achievementDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  achievementProgress: {
    marginTop: 8,
  },
  achievementProgressBar: {
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginBottom: 4,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  achievementProgressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  achievementPoints: {
    alignItems: 'center',
    marginLeft: 12,
  },
  achievementPointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  achievementPointsTextUnlocked: {
    color: COLORS.white,
  },
  achievementBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.accent,
    flex: 1,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    flex: 1,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Connection styles
  connectionsContainer: {
    gap: 12,
  },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  connectionRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  connectionStatus: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  connectionAction: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statsCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Progress tab styles
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  checklistSection: {
    marginTop: 16,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checklistText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  checklistTextCompleted: {
    color: COLORS.success,
    textDecorationLine: 'line-through',
  },
  noConnectionsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  noConnectionsSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
