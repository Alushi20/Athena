import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, ActivityIndicator, Alert, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Account, Storage, ID } from 'react-native-appwrite';
//import { client, config } from '../lib/appwrite';
import BackButton from '../components/BackButton';
import { onAuthStateChanged } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../lib/firebase-config.js";
import { createUserWithEmailAndPassword } from 'firebase/auth';
//const account = new Account(client);
//const storage = new Storage(client);

const SKILLS = [
  'Biotechnology', 'Astrophysics', 'Environmental Science', 'Microbiology', 'Geology', 'Neuroscience', 'Chemistry', 'Marine Biology', 'Genetics', 'Physics',
  'Artificial Intelligence (AI)', 'Cybersecurity', 'Data Science', 'Software Development', 'Game Development', 'Robotics', 'Cloud Computing', 'Web Development',
  'Internet of Things (IoT)', 'Human-Computer Interaction (HCI)', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Aerospace Engineering',
  'Biomedical Engineering', 'Chemical Engineering', 'Nuclear Engineering', 'Industrial Engineering', 'Environmental Engineering', 'Software Engineering'
];

const SignUpScreen = ({ navigation }: any) => {
  const [role, setRole] = useState<'mentor' | 'mentee' | null>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPhone, setShowPhone] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [profilePic, setProfilePic] = useState<any>(null);
  const [cv, setCv] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePickProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0]);
    }
  };

  const handlePickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.assets && result.assets.length > 0) {
      setCv(result.assets[0]);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSkills(skills => skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill]);
  };

  const handleSignUp = async () => {
    if (!role) {
      Alert.alert('Please select a role', 'Are you signing up as a mentor or a mentee?');
      return;
    }
    setLoading(true);
    try {

      // 1. Create user
      // const userId = ID.unique();
      // await account.create(userId, email, password, name);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Upload profile pic
      // let profilePicUrl = '';
      // if (profilePic) {
      //   const file = { uri: profilePic.uri, name: profilePic.fileName || 'profile.jpg', type: profilePic.mimeType || 'image/jpeg', size: profilePic.fileSize || 1 };
      //   const uploaded = await storage.createFile(config.storageId, ID.unique(), file);
      //   profilePicUrl = uploaded.$id;
      // }
      // 3. Upload CV
      // let cvUrl = '';
      // if (cv) {
      //   const file = { uri: cv.uri, name: cv.name, type: cv.mimeType || 'application/pdf', size: cv.size || 1 };
      //   const uploaded = await storage.createFile(config.storageId, ID.unique(), file);
      //   cvUrl = uploaded.$id;
      // }

      // 4. Save preferences
      try{
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          role: role, 
          username: username,
          phone: phone,
          showPhone: showPhone,
          bio: bio,
          location: location,
          skills: skills,
          // profilePicUrl,
          // cvUrl,
        });
      }
      catch(error){
        console.log(error);
      }

      console.log('User preferences saved successfully.');
      Alert.alert('Success', 'Account created! Please complete your onboarding.');
      if (role === 'mentor') {
        navigation.replace('MentorOnboarding');
      } else {
        navigation.replace('MenteeOnboarding');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={true}
            bounces={true}
            alwaysBounceVertical={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.headerTop}>
                <BackButton color={COLORS.white} />
              </View>
              <View style={styles.headerContent}>
                <Feather name="user-plus" size={32} color={COLORS.white} />
                <Text style={styles.title}>Join Athena</Text>
                <Text style={styles.subtitle}>Connect with amazing women in STEM</Text>
              </View>
            </View>

            {/* Role Selection Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Your Role</Text>
              <View style={styles.roleSelection}>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'mentor' && styles.roleButtonSelected]}
                  onPress={() => setRole('mentor')}
                >
                  <View style={styles.roleIconContainer}>
                    <Feather name="award" size={24} color={role === 'mentor' ? COLORS.white : COLORS.primary} />
                  </View>
                  <Text style={[styles.roleButtonText, role === 'mentor' && styles.roleButtonTextSelected]}>I'm a Mentor</Text>
                  <Text style={[styles.roleDescription, role === 'mentor' && styles.roleDescriptionSelected]}>Share your expertise</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleButton, role === 'mentee' && styles.roleButtonSelected]}
                  onPress={() => setRole('mentee')}
                >
                  <View style={styles.roleIconContainer}>
                    <Feather name="book-open" size={24} color={role === 'mentee' ? COLORS.white : COLORS.primary} />
                  </View>
                  <Text style={[styles.roleButtonText, role === 'mentee' && styles.roleButtonTextSelected]}>I'm a Mentee</Text>
                  <Text style={[styles.roleDescription, role === 'mentee' && styles.roleDescriptionSelected]}>Learn and grow</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Basic Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather name="user" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather name="at-sign" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather name="lock" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            {/* Contact Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Feather name="phone" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather name="map-pin" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <View style={styles.switchLabelContainer}>
                    <Feather name="eye" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.switchLabel}>Show phone on profile</Text>
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

            {/* Bio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About You</Text>
              <View style={styles.bioContainer}>
                <TextInput
                  style={styles.bioInput}
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Skills Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              <Text style={styles.sectionSubtitle}>Select your areas of expertise or interest</Text>
              <View style={styles.skillsContainer}>
                {SKILLS.map(skill => (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.skillTag, skills.includes(skill) && styles.skillTagSelected]}
                    onPress={() => handleSkillToggle(skill)}
                  >
                    <Text style={[styles.skillText, skills.includes(skill) && styles.skillTextSelected]}>{skill}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Upload Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile & Documents</Text>

              <View style={styles.uploadSection}>
                <TouchableOpacity style={styles.uploadCard} onPress={handlePickProfilePic}>
                  <View style={styles.uploadIconContainer}>
                    <Feather name="image" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.uploadContent}>
                    <Text style={styles.uploadTitle}>Profile Picture</Text>
                    <Text style={styles.uploadSubtitle}>
                      {profilePic ? 'Change photo' : 'Add a profile picture'}
                    </Text>
                  </View>
                  {profilePic && <Image source={{ uri: profilePic.uri }} style={styles.previewImg} />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadCard} onPress={handlePickCV}>
                  <View style={styles.uploadIconContainer}>
                    <Feather name="file-text" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.uploadContent}>
                    <Text style={styles.uploadTitle}>CV/Resume</Text>
                    <Text style={styles.uploadSubtitle}>
                      {cv ? cv.name : 'Upload your CV or resume'}
                    </Text>
                  </View>
                  {cv && <Feather name="check-circle" size={20} color={COLORS.success} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitSection}>
              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Feather name="user-plus" size={20} color={COLORS.white} />
                    <Text style={styles.submitBtnText}>Create Account</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('LoginPage')}
              >
                <Text style={styles.loginLinkText}>Already have an account? </Text>
                <Text style={styles.loginLinkBold}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120, // Increased padding to ensure content is scrollable
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
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  roleSelection: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  roleButtonTextSelected: {
    color: COLORS.white,
  },
  roleDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  roleDescriptionSelected: {
    color: COLORS.white,
    opacity: 0.9,
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
  switchContainer: {
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
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text,
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
  },
  skillTag: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  skillTagSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  skillText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  skillTextSelected: {
    color: COLORS.white,
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
  previewImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  submitSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  loginLinkBold: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default SignUpScreen; 