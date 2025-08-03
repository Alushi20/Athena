import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from '@expo/vector-icons';
import { COLORS } from "../constants/Colors";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  LoginPage: undefined;
  Achievements: undefined;
};

type AchievementsScreenProps = NativeStackScreenProps<RootStackParamList, "Achievements">;

export default function AchievementsScreen({ navigation }: AchievementsScreenProps) {
  // Mock data - in a real app, this would come from your backend
  const [level, setLevel] = useState(2);
  const [totalPoints, setTotalPoints] = useState(100);
  const [levelProgress, setLevelProgress] = useState(60);
  const [achievements, setAchievements] = useState([
    {
      id: '1',
      title: 'First Connection',
      description: 'Make your first mentorship connection',
      icon: 'users',
      points: 50,
      progress: 1,
      maxProgress: 1,
      unlocked: true
    },
    {
      id: '2',
      title: 'Profile Master',
      description: 'Complete 100% of your profile',
      icon: 'user-check',
      points: 100,
      progress: 75,
      maxProgress: 100,
      unlocked: false
    },
    {
      id: '3',
      title: 'Session Champion',
      description: 'Complete 10 mentorship sessions',
      icon: 'book-open',
      points: 75,
      progress: 8,
      maxProgress: 10,
      unlocked: false
    },
    {
      id: '4',
      title: 'Community Builder',
      description: 'Join 5 different communities',
      icon: 'users',
      points: 60,
      progress: 3,
      maxProgress: 5,
      unlocked: false
    },
    {
      id: '5',
      title: 'Workshop Enthusiast',
      description: 'Attend 3 workshops',
      icon: 'award',
      points: 80,
      progress: 1,
      maxProgress: 3,
      unlocked: false
    }
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Level and Points Section */}
        <View style={styles.section}>
          <View style={styles.levelCard}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Level {level}</Text>
              <Text style={styles.levelSubtitle}>{totalPoints} Points</Text>
            </View>
            <View style={styles.levelProgressContainer}>
              <View style={styles.levelProgressBar}>
                <View style={[styles.levelProgressFill, { width: `${levelProgress}%` }]} />
              </View>
              <Text style={styles.levelProgressText}>{levelProgress}% to next level</Text>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.sectionSubtitle}>Track your progress and unlock rewards</Text>
          
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <TouchableOpacity 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  achievement.unlocked && styles.achievementCardUnlocked
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  achievement.unlocked && styles.achievementIconUnlocked
                ]}>
                  <Feather 
                    name={achievement.icon as any} 
                    size={24} 
                    color={achievement.unlocked ? COLORS.white : COLORS.textSecondary} 
                  />
                </View>
                
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.unlocked && styles.achievementTitleUnlocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  
                  {achievement.maxProgress > 1 && (
                    <View style={styles.achievementProgress}>
                      <View style={styles.achievementProgressBar}>
                        <View style={[
                          styles.achievementProgressFill,
                          { width: `${(achievement.progress / achievement.maxProgress) * 100}%` }
                        ]} />
                      </View>
                      <Text style={styles.achievementProgressText}>
                        {achievement.progress}/{achievement.maxProgress}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.achievementPoints}>
                  <Text style={[
                    styles.achievementPointsText,
                    achievement.unlocked && styles.achievementPointsTextUnlocked
                  ]}>
                    +{achievement.points}
                  </Text>
                </View>
                
                {achievement.unlocked && (
                  <View style={styles.achievementBadge}>
                    <Feather name="check" size={12} color={COLORS.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Feather name="users" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
            
            <View style={styles.statCard}>
              <Feather name="book-open" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            
            <View style={styles.statCard}>
              <Feather name="award" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            
            <View style={styles.statCard}>
              <Feather name="calendar" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>28</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  // Level and Progress Styles
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
  // Achievements Styles
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
  // Stats Styles
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
}); 