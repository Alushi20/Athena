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
import { Account, Storage, ID } from "react-native-appwrite";
import { client, config } from "../lib/appwrite";
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

const { width, height } = Dimensions.get('window');

// Define the screen params for type safety
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  LoginPage: undefined;
};

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  // Basic Profile Data
  const [email, setEmail] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
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
  const [role, setRole] = useState<'mentor' | 'mentee' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS.primary);
  const [completeness, setCompleteness] = useState(0.75);
  const [activeTab, setActiveTab] = useState('personal');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    { id: 'personal', title: 'Personal', icon: 'user' },
    { id: 'professional', title: 'Professional', icon: 'briefcase' },
    { id: 'documents', title: 'Documents', icon: 'file-text' },
    { id: 'connections', title: 'Current Connections', icon: 'users' },
    { id: 'settings', title: 'Settings', icon: 'settings' },
  ];

  useEffect(() => {
    fetchUserData();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  async function fetchUserData() {
    try {
      const user = await Account.get();
      setEmail(user.email);
      setDisplayName(user.name);
      setUsername(user.prefs?.username || "");
      setBio(user.prefs?.bio || "");
      setPhone(user.prefs?.phone || "");
      setLocation(user.prefs?.location || "");
      setSkills(user.prefs?.skills || "");
      setLinkedIn(user.prefs?.linkedIn || "");
      setGithub(user.prefs?.github || "");
      setWebsite(user.prefs?.website || "");
      setTimezone(user.prefs?.timezone || "");
      setLanguages(user.prefs?.languages || "");
      setInterests(user.prefs?.interests || "");
      setCompany(user.prefs?.company || "");
      setPosition(user.prefs?.position || "");
      setExperience(user.prefs?.experience || "");
      setEducation(user.prefs?.education || "");
      setCertifications(user.prefs?.certifications || "");
      setCvUrl(user.prefs?.cvUrl || null);
      setCvName(user.prefs?.cvName || null);
      setPortfolioUrl(user.prefs?.portfolioUrl || null);
      setVerificationStatus(user.prefs?.verificationStatus || 'unverified');
      setVerificationDocName(user.prefs?.verificationDocName || null);
      setThemeDark(user.prefs?.themeDark || false);
      setNotifications(user.prefs?.notifications !== false);
      setEmailNotifications(user.prefs?.emailNotifications !== false);
      setPushNotifications(user.prefs?.pushNotifications !== false);
      setMentorshipNotifications(user.prefs?.mentorshipNotifications !== false);
      setWorkshopNotifications(user.prefs?.workshopNotifications !== false);
      setEventNotifications(user.prefs?.eventNotifications !== false);
      setPrivacyPublic(user.prefs?.privacyPublic !== false);
      setShowEmail(user.prefs?.showEmail !== false);
      setShowPhone(user.prefs?.showPhone || false);
      setShowLocation(user.prefs?.showLocation !== false);
      setRole(user.prefs?.role || 'mentee');
      setProfilePic(user.prefs?.profilePicUrl ? `${config.endpoint}/storage/buckets/${config.storageId}/files/${user.prefs.profilePicUrl}/view?project=${config.projectId}` : null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }

  const renderSkillTags = (skillsString: string) => {
    if (!skillsString) return null;
    const skillsArray = skillsString.split(',').map(skill => skill.trim());
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || 'profile.jpg',
          type: result.assets[0].mimeType || 'image/jpeg',
          size: result.assets[0].fileSize || 1,
        };
        const uploaded = await Storage.createFile(config.storageId, ID.unique(), file);
        await Account.updatePrefs({ profilePicUrl: uploaded.$id });
        setProfilePic(`${config.endpoint}/storage/buckets/${config.storageId}/files/${uploaded.$id}/view?project=${config.projectId}`);
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload profile picture');
      } finally {
        setUploading(false);
      }
    }
  };

  const pickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'application/pdf',
          size: result.assets[0].size || 1,
        };
        const uploaded = await Storage.createFile(config.storageId, ID.unique(), file);
        await Account.updatePrefs({ 
          cvUrl: uploaded.$id,
          cvName: result.assets[0].name 
        });
        setCvUrl(uploaded.$id);
        setCvName(result.assets[0].name);
        Alert.alert('Success', 'CV uploaded successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload CV');
      } finally {
        setUploading(false);
      }
    }
  };

  const pickVerificationDoc = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'application/pdf',
          size: result.assets[0].size || 1,
        };
        const uploaded = await Storage.createFile(config.storageId, ID.unique(), file);
        await Account.updatePrefs({ 
          verificationDocUrl: uploaded.$id,
          verificationDocName: result.assets[0].name 
        });
        setVerificationStatus('pending');
        setVerificationDocName(result.assets[0].name);
        Alert.alert('Success', 'Verification document uploaded successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload verification document');
      } finally {
        setUploading(false);
      }
    }
  };

  const toggleTheme = async () => {
    setThemeDark(!themeDark);
    await Account.updatePrefs({ themeDark: !themeDark });
  };

  const toggleNotifications = async () => {
    setNotifications(!notifications);
    await Account.updatePrefs({ notifications: !notifications });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await Account.updatePrefs({
        username,
        bio,
        phone,
        location,
        skills,
        linkedIn,
        github,
        website,
        timezone,
        languages,
        interests,
        company,
        position,
        experience,
        education,
        certifications,
      });
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Feather name="user" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Full name" 
                    value={displayName || ""} 
                    onChangeText={setDisplayName}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="at-sign" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Username" 
                    value={username} 
                    onChangeText={setUsername}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="phone" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Phone number" 
                    value={phone} 
                    onChangeText={setPhone}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="map-pin" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Location" 
                    value={location} 
                    onChangeText={setLocation}
                    editable={editMode}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About You</Text>
              <View style={styles.bioContainer}>
                <TextInput 
                  style={styles.bioInput} 
                  placeholder="Tell us about yourself..." 
                  value={bio} 
                  onChangeText={setBio}
                  multiline 
                  numberOfLines={4}
                  editable={editMode}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Interests</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Feather name="award" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Skills (comma separated)" 
                    value={skills} 
                    onChangeText={setSkills}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="heart" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Interests" 
                    value={interests} 
                    onChangeText={setInterests}
                    editable={editMode}
                  />
                </View>
              </View>
              {renderSkillTags(skills)}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Social Links</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Feather name="linkedin" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="LinkedIn URL" 
                    value={linkedIn} 
                    onChangeText={setLinkedIn}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="github" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="GitHub URL" 
                    value={github} 
                    onChangeText={setGithub}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="globe" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Website URL" 
                    value={website} 
                    onChangeText={setWebsite}
                    editable={editMode}
                  />
                </View>
              </View>
              {renderSocialLinks()}
            </View>
          </View>
        );

      case 'professional':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Feather name="briefcase" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Company" 
                    value={company} 
                    onChangeText={setCompany}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="user-check" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Position" 
                    value={position} 
                    onChangeText={setPosition}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="clock" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Years of experience" 
                    value={experience} 
                    onChangeText={setExperience}
                    editable={editMode}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education & Certifications</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Feather name="graduation-cap" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Education" 
                    value={education} 
                    onChangeText={setEducation}
                    editable={editMode}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Feather name="award" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Certifications" 
                    value={certifications} 
                    onChangeText={setCertifications}
                    editable={editMode}
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 'documents':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Documents</Text>
              
              <View style={styles.uploadSection}>
                <TouchableOpacity style={styles.uploadCard} onPress={pickCV}>
                  <View style={styles.uploadIconContainer}>
                    <Feather name="file-text" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.uploadContent}>
                    <Text style={styles.uploadTitle}>CV/Resume</Text>
                    <Text style={styles.uploadSubtitle}>
                      {cvName ? cvName : 'Upload your CV or resume'}
                    </Text>
                  </View>
                  {cvName && <Feather name="check-circle" size={20} color={COLORS.success} />}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.uploadCard} onPress={pickVerificationDoc}>
                  <View style={styles.uploadIconContainer}>
                    <Feather name="shield" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.uploadContent}>
                    <Text style={styles.uploadTitle}>Verification Document</Text>
                    <Text style={styles.uploadSubtitle}>
                      {verificationDocName ? verificationDocName : 'Upload verification document'}
                    </Text>
                  </View>
                  {verificationStatus === 'verified' && <Feather name="check-circle" size={20} color={COLORS.success} />}
                  {verificationStatus === 'pending' && <Feather name="clock" size={20} color={COLORS.warning} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'connections':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Connections</Text>
              
              <View style={styles.connectionsContainer}>
                <View style={styles.connectionCard}>
                  <View style={styles.connectionAvatar}>
                    <Feather name="user" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.connectionInfo}>
                    <Text style={styles.connectionName}>Dr. Sarah Johnson</Text>
                    <Text style={styles.connectionRole}>Mentor - Computer Science</Text>
                    <Text style={styles.connectionStatus}>Active - 3 months</Text>
                  </View>
                  <TouchableOpacity style={styles.connectionAction}>
                    <Feather name="message-circle" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.connectionCard}>
                  <View style={styles.connectionAvatar}>
                    <Feather name="user" size={24} color={COLORS.secondary} />
                  </View>
                  <View style={styles.connectionInfo}>
                    <Text style={styles.connectionName}>Maria Rodriguez</Text>
                    <Text style={styles.connectionRole}>Mentee - Data Science</Text>
                    <Text style={styles.connectionStatus}>Active - 1 month</Text>
                  </View>
                  <TouchableOpacity style={styles.connectionAction}>
                    <Feather name="message-circle" size={20} color={COLORS.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.connectionCard}>
                  <View style={styles.connectionAvatar}>
                    <Feather name="user" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.connectionInfo}>
                    <Text style={styles.connectionName}>Prof. Emily Chen</Text>
                    <Text style={styles.connectionRole}>Mentor - Engineering</Text>
                    <Text style={styles.connectionStatus}>Active - 6 months</Text>
                  </View>
                  <TouchableOpacity style={styles.connectionAction}>
                    <Feather name="message-circle" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Connection Statistics</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>Active Connections</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Total Sessions</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>4.8</Text>
                    <Text style={styles.statLabel}>Avg. Rating</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case 'settings':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              
              <View style={styles.settingsGroup}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Feather name="bell" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                  </View>
                  <Switch 
                    value={pushNotifications} 
                    onValueChange={setPushNotifications}
                    trackColor={{ false: COLORS.accent, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Feather name="mail" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                  </View>
                  <Switch 
                    value={emailNotifications} 
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: COLORS.accent, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Feather name="users" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.settingLabel}>Mentorship Notifications</Text>
                  </View>
                  <Switch 
                    value={mentorshipNotifications} 
                    onValueChange={setMentorshipNotifications}
                    trackColor={{ false: COLORS.accent, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy</Text>
              
              <View style={styles.settingsGroup}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Feather name="eye" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.settingLabel}>Public Profile</Text>
                  </View>
                  <Switch 
                    value={privacyPublic} 
                    onValueChange={setPrivacyPublic}
                    trackColor={{ false: COLORS.accent, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Feather name="mail" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.settingLabel}>Show Email</Text>
                  </View>
                  <Switch 
                    value={showEmail} 
                    onValueChange={setShowEmail}
                    trackColor={{ false: COLORS.accent, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Feather name="phone" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.settingLabel}>Show Phone</Text>
                  </View>
                  <Switch 
                    value={showPhone} 
                    onValueChange={setShowPhone}
                    trackColor={{ false: COLORS.accent, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </View>
            </View>
          </View>
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
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName || "No Name"}</Text>
              {role && (
                <View style={[styles.roleBadge, { backgroundColor: selectedColor }]}>
                  <Text style={styles.roleBadgeText}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => navigation.navigate('FeedbackProgress' as never)}
            >
              <Feather name="bar-chart-2" size={20} color={COLORS.white} />
              <Text style={styles.progressButtonText}>Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Completeness Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Profile Completeness</Text>
            <Text style={styles.progressPercentage}>{Math.round(completeness * 100)}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { 
                  width: `${completeness * 100}%`,
                  backgroundColor: selectedColor 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressSubtext}>
            Complete your profile to get better mentorship matches
          </Text>
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
                  activeTab === tab.id && { backgroundColor: selectedColor }
                ]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <Feather 
                  name={tab.icon as any} 
                  size={18} 
                  color={activeTab === tab.id ? COLORS.white : selectedColor} 
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
                await Account.deleteSession('current');
                navigation.replace("LoginPage");
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
  roleBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
