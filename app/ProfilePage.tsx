import React, { useEffect, useState, useRef } from "react";
import { View, Text, SafeAreaView, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Switch, Alert, TextInput, Animated, Platform, Linking } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton";
import { Account, Storage, ID } from "react-native-appwrite";
import { client, config } from "../lib/appwrite";
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// Define the screen params for type safety
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  LoginPage: undefined;
};

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [themeDark, setThemeDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
  const [verificationDocName, setVerificationDocName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const account = new Account(client);
  const storage = new Storage(client);

  useEffect(() => {
    setLoading(true);
    async function fetchUserData() {
      try {
        const user = await account.get();
        setEmail(user.email);
        setDisplayName(user.name);
        if (user.prefs && user.prefs.profilePic) setProfilePic(user.prefs.profilePic);
        if (user.prefs && user.prefs.themeDark !== undefined) setThemeDark(user.prefs.themeDark);
        if (user.prefs && user.prefs.notifications !== undefined) setNotifications(user.prefs.notifications);
        if (user.prefs && user.prefs.bio) setBio(user.prefs.bio);
        if (user.prefs && user.prefs.phone) setPhone(user.prefs.phone);
        if (user.prefs && user.prefs.location) setLocation(user.prefs.location);
        if (user.prefs && user.prefs.skills) setSkills(user.prefs.skills);
        if (user.prefs && user.prefs.linkedIn) setLinkedIn(user.prefs.linkedIn);
        if (user.prefs && user.prefs.cvUrl) {
          setCvUrl(user.prefs.cvUrl);
          setCvName(user.prefs.cvName || null);
        }
        setVerificationStatus(user.prefs.verificationStatus || 'unverified');
        setVerificationDocName(user.prefs.verificationDocName || null);
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      }
    }
    fetchUserData();
  }, []);

  // Profile completeness calculation
  const completeness = (() => {
    let total = 7;
    let filled = 0;
    if (profilePic) filled++;
    if (bio) filled++;
    if (phone) filled++;
    if (location) filled++;
    if (skills) filled++;
    if (linkedIn) filled++;
    if (cvUrl) filled++;
    return filled / total;
  })();

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: completeness,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [completeness]);

  // Pick and upload profile picture
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const asset = result.assets[0];
        const fileUri = asset.uri;
        const fileName = fileUri.split('/').pop() || `profile_${Date.now()}.jpg`;
        const fileType = asset.type || 'image/jpeg';
        const fileSize = asset.fileSize || 1;
        // Upload to Appwrite Storage
        const fileRes = await storage.createFile(
          config.dbId,
          ID.unique(),
          {
            uri: fileUri,
            name: fileName,
            type: fileType,
            size: fileSize,
          }
        );
        // Get file preview URL
        const fileUrl = storage.getFilePreview(config.dbId, fileRes.$id).href;
        setProfilePic(fileUrl);
        await account.updatePrefs({ profilePic: fileUrl });
      } catch (err) {
        Alert.alert("Upload failed", "Could not upload profile picture.");
      } finally {
        setUploading(false);
      }
    }
  };

  // Pick and upload CV
  const pickCV = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const asset = result.assets[0];
        const fileUri = asset.uri;
        const fileName = asset.name || `cv_${Date.now()}`;
        const fileType = asset.mimeType || 'application/pdf';
        const fileSize = asset.size || 1;
        const fileRes = await storage.createFile(
          config.dbId,
          ID.unique(),
          {
            uri: fileUri,
            name: fileName,
            type: fileType,
            size: fileSize,
          }
        );
        const fileUrl = storage.getFileView(config.dbId, fileRes.$id).href;
        setCvUrl(fileUrl);
        setCvName(fileName);
        await account.updatePrefs({ cvUrl: fileUrl, cvName: fileName });
      } catch (err) {
        Alert.alert("Upload failed", "Could not upload CV.");
      } finally {
        setUploading(false);
      }
    }
  };

  // Pick and upload verification document
  const pickVerificationDoc = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (result.assets && result.assets.length > 0) {
        const { name, uri, mimeType, size } = result.assets[0];
        const file = { uri, name, type: mimeType || 'application/pdf', size: size || 0 };
        const uploadedFile = await storage.createFile(config.storageId, ID.unique(), file);
        const user = await account.get();
        await account.updatePrefs({
          ...user.prefs,
          verificationStatus: 'pending',
          verificationDocId: uploadedFile.$id,
          verificationDocName: name,
        });
        setVerificationStatus('pending');
        setVerificationDocName(name);
        Alert.alert("Document Uploaded", "Your verification document is pending review.");
      }
    } catch (error) {
      Alert.alert("Upload Failed", "Could not upload the verification document.");
    }
  };

  // Toggle theme and notifications
  const toggleTheme = async () => {
    setThemeDark((prev) => !prev);
    await account.updatePrefs({ themeDark: !themeDark });
  };
  const toggleNotifications = async () => {
    setNotifications((prev) => !prev);
    await account.updatePrefs({ notifications: !notifications });
  };

  // Edit mode animation
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    Animated.timing(editAnim, {
      toValue: editMode ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  // Save profile fields
  const saveProfile = async () => {
    setLoading(true);
    try {
      await account.updatePrefs({ bio, phone, location, skills, linkedIn });
      setEditMode(false);
      Animated.timing(editAnim, { toValue: 0, duration: 400, useNativeDriver: false }).start();
    } catch (err) {
      Alert.alert("Save failed", "Could not save profile info.");
    } finally {
      setLoading(false);
    }
  };

  // Animated progress bar width
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#a66cff" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }] }>
      {/* Profile Completeness Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
        <Text style={styles.progressText}>{Math.round(completeness * 100)}% Complete</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={toggleEditMode}>
          <Feather name={editMode ? "x" : "edit-2"} size={24} color="#a66cff" />
        </TouchableOpacity>
      </View>
      <View style={styles.profilePicWrapper}>
        <TouchableOpacity onPress={pickImage} disabled={uploading} style={{ alignItems: 'center' }}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Feather name="user" size={54} color="#fff" />
            </View>
          )}
          <View style={styles.cameraIconWrapper}>
            <Feather name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email-outline" size={22} color="#a66cff" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>{loading ? <ActivityIndicator size="small" color="#a66cff" /> : email || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-circle-outline" size={22} color="#a66cff" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>{displayName || "No Name"}</Text>
        </View>
        <Animated.View style={{ overflow: 'hidden', height: editAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 240] }) }}>
          <View style={styles.infoRow}>
            <FontAwesome name="info-circle" size={20} color="#a66cff" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              editable={editMode}
              placeholderTextColor="#b983ff"
              multiline
            />
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color="#a66cff" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              editable={editMode}
              placeholderTextColor="#b983ff"
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.infoRow}>
            <Entypo name="location-pin" size={22} color="#a66cff" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              editable={editMode}
              placeholderTextColor="#b983ff"
            />
          </View>
          <View style={styles.infoRow}>
            <Feather name="star" size={20} color="#a66cff" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Skills (comma separated)"
              value={skills}
              onChangeText={setSkills}
              editable={editMode}
              placeholderTextColor="#b983ff"
            />
          </View>
          <View style={styles.infoRow}>
            <Feather name="linkedin" size={20} color="#a66cff" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="LinkedIn URL"
              value={linkedIn}
              onChangeText={setLinkedIn}
              editable={editMode}
              placeholderTextColor="#b983ff"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {linkedIn ? (
              <TouchableOpacity onPress={() => Linking.openURL(linkedIn)} style={{ marginLeft: 6 }}>
                <Feather name="external-link" size={18} color="#a66cff" />
              </TouchableOpacity>
            ) : null}
          </View>
          <CustomButton
            title="Save"
            onPress={saveProfile}
            style={styles.saveBtn}
            textStyle={styles.saveBtnText}
          />
        </Animated.View>
        {!editMode && (
          <>
            {bio ? (
              <View style={styles.infoRow}><FontAwesome name="info-circle" size={20} color="#a66cff" style={{ marginRight: 8 }} /><Text style={styles.infoText}>{bio}</Text></View>
            ) : null}
            {phone ? (
              <View style={styles.infoRow}><Feather name="phone" size={20} color="#a66cff" style={{ marginRight: 8 }} /><Text style={styles.infoText}>{phone}</Text></View>
            ) : null}
            {location ? (
              <View style={styles.infoRow}><Entypo name="location-pin" size={22} color="#a66cff" style={{ marginRight: 8 }} /><Text style={styles.infoText}>{location}</Text></View>
            ) : null}
            {skills ? (
              <View style={styles.infoRow}><Feather name="star" size={20} color="#a66cff" style={{ marginRight: 8 }} /><Text style={styles.infoText}>{skills}</Text></View>
            ) : null}
            {linkedIn ? (
              <View style={styles.infoRow}><Feather name="linkedin" size={20} color="#a66cff" style={{ marginRight: 8 }} /><TouchableOpacity onPress={() => Linking.openURL(linkedIn)}><Text style={[styles.infoText, { color: '#a66cff', textDecorationLine: 'underline' }]}>LinkedIn</Text></TouchableOpacity></View>
            ) : null}
          </>
        )}
      </View>
      <View style={styles.optionsCard}>
        <View style={styles.optionRow}>
          <Feather name="moon" size={20} color="#a66cff" style={{ marginRight: 8 }} />
          <Text style={styles.optionText}>Dark Theme</Text>
          <Switch value={themeDark} onValueChange={toggleTheme} thumbColor={themeDark ? "#a66cff" : "#fff"} trackColor={{ true: "#e7c6ff", false: "#ccc" }} />
        </View>
        <View style={styles.optionRow}>
          <Feather name="bell" size={20} color="#a66cff" style={{ marginRight: 8 }} />
          <Text style={styles.optionText}>Notifications</Text>
          <Switch value={notifications} onValueChange={toggleNotifications} thumbColor={notifications ? "#a66cff" : "#fff"} trackColor={{ true: "#e7c6ff", false: "#ccc" }} />
        </View>
        <View style={styles.optionRow}>
          <Feather name="file-text" size={20} color="#a66cff" style={{ marginRight: 8 }} />
          <Text style={styles.optionText}>CV</Text>
          <TouchableOpacity onPress={pickCV} disabled={uploading} style={styles.cvBtn}>
            <Text style={styles.cvBtnText}>{cvUrl ? "Update" : "Upload"}</Text>
          </TouchableOpacity>
        </View>
        {cvUrl && (
          <TouchableOpacity style={styles.cvFileRow} onPress={() => Linking.openURL(cvUrl)}>
            <Feather name="download" size={18} color="#a66cff" style={{ marginRight: 6 }} />
            <Text style={styles.cvFileText}>{cvName || "View CV"}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification</Text>
        <View style={styles.verificationRow}>
          <Feather
            name={verificationStatus === 'verified' ? 'check-circle' : 'alert-circle'}
            size={24}
            color={verificationStatus === 'verified' ? '#4CAF50' : '#FFC107'}
          />
          <Text style={styles.verificationText}>
            Status: {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
          </Text>
        </View>
        {verificationStatus !== 'verified' && (
          <TouchableOpacity style={styles.uploadButton} onPress={pickVerificationDoc}>
            <Feather name="upload" size={18} color="#fff" />
            <Text style={styles.uploadButtonText}>
              {verificationStatus === 'pending' ? 'Re-upload Document' : 'Upload for Verification'}
            </Text>
          </TouchableOpacity>
        )}
        {verificationDocName && <Text style={styles.docNameText}>Uploaded: {verificationDocName}</Text>}
      </View>
      <CustomButton
        title="Logout"
        onPress={async () => {
          try {
            await account.deleteSession("current");
            navigation.replace("LoginPage");
          } catch (error) {
            console.error("Logout failed", error);
          }
        }}
        style={styles.logoutBtn}
        textStyle={styles.logoutBtnText}
      />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6e6ff',
    padding: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6e6ff',
  },
  errorText: {
    color: '#a66cff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f6e6ff',
    padding: 0,
  },
  progressBarContainer: {
    height: 18,
    marginHorizontal: 24,
    marginTop: 18,
    marginBottom: 8,
    backgroundColor: '#e7c6ff',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  progressBar: {
    height: 18,
    backgroundColor: '#a66cff',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  progressText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf: 'center',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a66cff',
    letterSpacing: 1.1,
  },
  profilePicWrapper: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#a66cff',
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#b983ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#a66cff',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 17,
    color: '#7f5283',
    fontWeight: '500',
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#7f5283',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#e7c6ff',
    paddingVertical: 4,
    marginBottom: 2,
  },
  saveBtn: {
    backgroundColor: '#a66cff',
    borderRadius: 14,
    marginTop: 8,
    paddingVertical: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#7f5283',
    fontWeight: '500',
    flex: 1,
  },
  cvBtn: {
    backgroundColor: '#a66cff',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cvBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cvFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 8,
  },
  cvFileText: {
    color: '#a66cff',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 8,
    paddingVertical: 14,
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutBtnText: {
    color: '#a66cff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a66cff',
    marginBottom: 10,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f5283',
    marginLeft: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a66cff',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  docNameText: {
    fontSize: 13,
    color: '#7f5283',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
