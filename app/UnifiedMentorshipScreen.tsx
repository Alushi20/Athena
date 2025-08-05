import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated, ActivityIndicator, Image, TextInput } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { account, database, config } from '../lib/appwrite';
import { Query } from 'react-native-appwrite';
import MentorshipFlowDiagram from '../components/MentorshipFlowDiagram';
import MentorshipStatusOverview from '../components/MentorshipStatusOverview';
import SchedulingVisualizer from '../components/SchedulingVisualizer';

interface MentorshipStatus {
  totalMentorships: number;
  activeMentorships: number;
  pendingRequests: number;
  completedSessions: number;
  upcomingSessions: number;
}

interface RecentActivity {
  id: string;
  type: 'request' | 'chat' | 'session' | 'feedback';
  title: string;
  description: string;
  timestamp: string;
  mentorName?: string;
  menteeName?: string;
}

interface Mentorship {
  id: string;
  mentorName: string;
  menteeName: string;
  status: 'active' | 'pending' | 'completed';
  lastActivity: string;
  nextSession?: string;
  profilePic?: string;
  matchScore?: number;
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  skills: string[];
  rating: number;
  sessions: number;
  experience: string;
  profilePic: string;
  badge: string;
}

const UnifiedMentorshipScreen: React.FC = () => {
  const [status, setStatus] = useState<MentorshipStatus>({
    totalMentorships: 0,
    activeMentorships: 0,
    pendingRequests: 0,
    completedSessions: 0,
    upcomingSessions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'mentor' | 'mentee' | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'connections' | 'findMentor'>('overview');
  
  // Filter state for findMentor tab
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mock mentor data
  const mockMentors: Mentor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'AI Research Lead',
      company: 'Google',
      skills: ['Machine Learning', 'Python', 'Research', 'AI/ML'],
      rating: 4.9,
      sessions: 156,
      experience: '5+ years',
      profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      badge: 'star'
    },
    {
      id: '2',
      name: 'Prof. Emily Watson',
      role: 'Data Scientist',
      company: 'Netflix',
      skills: ['Data Science', 'SQL', 'Analytics', 'Data Science'],
      rating: 4.8,
      sessions: 89,
      experience: '3+ years',
      profilePic: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
      badge: 'award'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      role: 'UX Designer',
      company: 'Spotify',
      skills: ['UX/UI', 'Design Systems', 'Prototyping', 'UX/UI'],
      rating: 4.7,
      sessions: 203,
      experience: '7+ years',
      profilePic: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      badge: 'trending-up'
    },
    {
      id: '4',
      name: 'Alexandra Thompson',
      role: 'Senior Developer',
      company: 'Microsoft',
      skills: ['React', 'TypeScript', 'Architecture', 'Web Dev'],
      rating: 4.9,
      sessions: 127,
      experience: '6+ years',
      profilePic: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face',
      badge: 'zap'
    },
    {
      id: '5',
      name: 'Dr. Jennifer Park',
      role: 'Cybersecurity Expert',
      company: 'Amazon',
      skills: ['Cybersecurity', 'Network Security', 'Penetration Testing', 'Cybersecurity'],
      rating: 4.8,
      sessions: 94,
      experience: '8+ years',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      badge: 'shield'
    },
    {
      id: '6',
      name: 'Sophie Williams',
      role: 'Mobile Developer',
      company: 'Apple',
      skills: ['iOS', 'Swift', 'Mobile Development', 'Mobile'],
      rating: 4.6,
      sessions: 178,
      experience: '4+ years',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      badge: 'smartphone'
    }
  ];

  useEffect(() => {
    setMentors(mockMentors);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const user = await account.get();
        const userRole = user.prefs?.role || 'mentee';
        setUserRole(userRole);

        // Fetch mentorship matches
        const matchesResponse = await database.listDocuments(
          config.dbId,
          config.col.mentorshipMatchesCol,
          [
            Query.or([
              Query.equal('mentorId', user.$id),
              Query.equal('menteeId', user.$id)
            ])
          ]
        );

        const matches = matchesResponse.documents;
        const activeMatches = matches.filter((m: any) => m.status === 'active');
        const pendingMatches = matches.filter((m: any) => m.status === 'pending');

        setStatus({
          totalMentorships: matches.length,
          activeMentorships: activeMatches.length,
          pendingRequests: pendingMatches.length,
          completedSessions: Math.floor(Math.random() * 10),
          upcomingSessions: Math.floor(Math.random() * 5)
        });

        // Generate mock recent activity
        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'chat',
            title: 'New message from mentor',
            description: 'Dr. Evelyn Reed sent you a message about your AI project',
            timestamp: '2 hours ago',
            mentorName: 'Dr. Evelyn Reed'
          },
          {
            id: '2',
            type: 'session',
            title: 'Upcoming session scheduled',
            description: 'Session with Aisha Khan on CRISPR technology',
            timestamp: '1 day ago',
            mentorName: 'Aisha Khan'
          },
          {
            id: '3',
            type: 'request',
            title: 'New mentorship request',
            description: 'Maria Garcia wants to mentor you in cloud computing',
            timestamp: '3 days ago',
            menteeName: 'Maria Garcia'
          }
        ];
        setRecentActivity(mockActivity);

        // Generate mock mentorships data
        const mockMentorships: Mentorship[] = [
          {
            id: '1',
            mentorName: 'Dr. Evelyn Reed',
            menteeName: 'Sarah Johnson',
            status: 'active',
            lastActivity: '2 hours ago',
            nextSession: 'Tomorrow at 3 PM',
            profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
            matchScore: 95
          },
          {
            id: '2',
            mentorName: 'Aisha Khan',
            menteeName: 'Maria Garcia',
            status: 'pending',
            lastActivity: '1 day ago',
            profilePic: 'https://randomuser.me/api/portraits/women/69.jpg',
            matchScore: 87
          }
        ];
        setMentorships(mockMentorships);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      }
    };

    fetchDashboardData();
  }, []);

  // Filter mentors based on active filter and search query
  const filteredMentors = mentors.filter(mentor => {
    const matchesFilter = activeFilter === 'All' || mentor.skills.includes(activeFilter);
    const matchesSearch = searchQuery === '' || 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const handleFilterPress = (filter: string) => {
    setActiveFilter(activeFilter === filter ? 'All' : filter);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat': return 'message-circle';
      case 'session': return 'calendar';
      case 'request': return 'user-plus';
      case 'feedback': return 'star';
      default: return 'activity';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'chat': return COLORS.primary;
      case 'session': return COLORS.success;
      case 'request': return COLORS.warning;
      case 'feedback': return COLORS.secondary;
      default: return COLORS.textSecondary;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.overviewContainer}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeHeader}>
                <View style={styles.welcomeIcon}>
                  <Feather name="sun" size={24} color={COLORS.white} />
                </View>
                <View style={styles.welcomeText}>
                  <Text style={styles.welcomeTitle}>
                    {userRole === 'mentor' ? 'Welcome back, Mentor!' : 'Welcome back, Mentee!'}
                  </Text>
                  <Text style={styles.welcomeSubtitle}>
                    {userRole === 'mentor' 
                      ? 'Ready to inspire the next generation?' 
                      : 'Ready to grow your skills today?'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Progress Overview */}
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.progressGrid}>
                <View style={styles.progressCard}>
                  <View style={styles.progressIconContainer}>
                    <Feather name="users" size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.progressNumber}>{status.totalMentorships}</Text>
                  <Text style={styles.progressLabel}>Total Connections</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min((status.totalMentorships / 10) * 100, 100)}%` }]} />
                  </View>
                </View>

                <View style={styles.progressCard}>
                  <View style={styles.progressIconContainer}>
                    <Feather name="check-circle" size={20} color={COLORS.success} />
                  </View>
                  <Text style={styles.progressNumber}>{status.activeMentorships}</Text>
                  <Text style={styles.progressLabel}>Active</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min((status.activeMentorships / 5) * 100, 100)}%`, backgroundColor: COLORS.success }]} />
                  </View>
                </View>

                <View style={styles.progressCard}>
                  <View style={styles.progressIconContainer}>
                    <Feather name="clock" size={20} color={COLORS.warning} />
                  </View>
                  <Text style={styles.progressNumber}>{status.pendingRequests}</Text>
                  <Text style={styles.progressLabel}>Pending</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min((status.pendingRequests / 3) * 100, 100)}%`, backgroundColor: COLORS.warning }]} />
                  </View>
                </View>

                <View style={styles.progressCard}>
                  <View style={styles.progressIconContainer}>
                    <Feather name="calendar" size={20} color={COLORS.accent} />
                  </View>
                  <Text style={styles.progressNumber}>{status.upcomingSessions}</Text>
                  <Text style={styles.progressLabel}>Upcoming</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min((status.upcomingSessions / 5) * 100, 100)}%`, backgroundColor: COLORS.accent }]} />
                  </View>
                </View>
              </View>
            </View>



            {/* Recent Activity */}
            <View style={styles.activitySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.activityList}>
                {recentActivity.slice(0, 3).map((activity) => (
                  <TouchableOpacity key={activity.id} style={styles.activityCard}>
                    <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
                      <Feather name={getActivityIcon(activity.type) as any} size={16} color={COLORS.white} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                      <Text style={styles.activityTime}>{activity.timestamp}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Upcoming Sessions */}
            <View style={styles.upcomingSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.upcomingList}>
                <View style={styles.upcomingSessionCard}>
                  <View style={styles.upcomingDateContainer}>
                    <Text style={styles.upcomingDate}>15</Text>
                    <Text style={styles.upcomingMonth}>Jan</Text>
                  </View>
                  <View style={styles.upcomingContent}>
                    <Text style={styles.upcomingTitle}>Machine Learning Basics</Text>
                    <Text style={styles.upcomingMentor}>with Prof. Emily Watson</Text>
                    <Text style={styles.upcomingTime}>10:00 AM - 11:30 AM</Text>
                  </View>
                  <TouchableOpacity style={styles.upcomingAction}>
                    <Feather name="calendar" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.upcomingSessionCard}>
                  <View style={styles.upcomingDateContainer}>
                    <Text style={styles.upcomingDate}>18</Text>
                    <Text style={styles.upcomingMonth}>Jan</Text>
                  </View>
                  <View style={styles.upcomingContent}>
                    <Text style={styles.upcomingTitle}>Career Development Chat</Text>
                    <Text style={styles.upcomingMentor}>with Maria Rodriguez</Text>
                    <Text style={styles.upcomingTime}>2:00 PM - 3:00 PM</Text>
                  </View>
                  <TouchableOpacity style={styles.upcomingAction}>
                    <Feather name="calendar" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Mentorship Flow */}
            <View style={styles.flowSection}>
              <Text style={styles.sectionTitle}>Your Journey</Text>
              <MentorshipFlowDiagram 
                currentStep="chat"
                onStepPress={(step) => {
                  if (step.screen) {
                    navigation.navigate(step.screen as never, step.params as never);
                  }
                }}
              />
            </View>
          </ScrollView>
        );

      case 'schedule':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scheduleContainer}>
            {/* Schedule Header */}
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleHeaderContent}>
                <Text style={styles.scheduleTitle}>My Schedule</Text>
                <Text style={styles.scheduleSubtitle}>Manage your mentorship sessions</Text>
              </View>
              <TouchableOpacity 
                style={styles.addSessionButton}
                onPress={() => setShowTimeSlots(!showTimeSlots)}
              >
                <Feather name="plus" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.scheduleStats}>
              <View style={styles.scheduleStatCard}>
                <Feather name="calendar" size={20} color={COLORS.primary} />
                <Text style={styles.scheduleStatNumber}>5</Text>
                <Text style={styles.scheduleStatLabel}>Upcoming</Text>
              </View>
              <View style={styles.scheduleStatCard}>
                <Feather name="check-circle" size={20} color={COLORS.success} />
                <Text style={styles.scheduleStatNumber}>12</Text>
                <Text style={styles.scheduleStatLabel}>Completed</Text>
              </View>
              <View style={styles.scheduleStatCard}>
                <Feather name="clock" size={20} color={COLORS.warning} />
                <Text style={styles.scheduleStatNumber}>8.5h</Text>
                <Text style={styles.scheduleStatLabel}>This Month</Text>
              </View>
            </View>

            {/* Optional Time Slots */}
            {showTimeSlots && (
              <View style={styles.optionalTimeSlotsContainer}>
                <View style={styles.optionalTimeSlotsHeader}>
                  <Text style={styles.optionalTimeSlotsTitle}>Available Time Slots</Text>
                  <TouchableOpacity onPress={() => setShowTimeSlots(false)}>
                    <Feather name="x" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.optionalTimeSlotsGrid}>
                  <TouchableOpacity 
                    style={styles.optionalTimeSlot}
                    onPress={() => {
                      setShowTimeSlots(false);
                      navigation.navigate('Scheduling' as never, { mentorId: 'default', matchId: 'default' } as never);
                    }}
                  >
                    <View style={styles.optionalTimeSlotHeader}>
                      <Text style={styles.optionalTimeSlotTime}>09:00 AM</Text>
                      <Text style={styles.optionalTimeSlotDuration}>30 min</Text>
                    </View>
                    <Text style={styles.optionalTimeSlotLabel}>Quick Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.optionalTimeSlot}
                    onPress={() => {
                      setShowTimeSlots(false);
                      navigation.navigate('Scheduling' as never, { mentorId: 'default', matchId: 'default' } as never);
                    }}
                  >
                    <View style={styles.optionalTimeSlotHeader}>
                      <Text style={styles.optionalTimeSlotTime}>10:30 AM</Text>
                      <Text style={styles.optionalTimeSlotDuration}>60 min</Text>
                    </View>
                    <Text style={styles.optionalTimeSlotLabel}>Full Session</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.optionalTimeSlot}
                    onPress={() => {
                      setShowTimeSlots(false);
                      navigation.navigate('Scheduling' as never, { mentorId: 'default', matchId: 'default' } as never);
                    }}
                  >
                    <View style={styles.optionalTimeSlotHeader}>
                      <Text style={styles.optionalTimeSlotTime}>02:00 PM</Text>
                      <Text style={styles.optionalTimeSlotDuration}>45 min</Text>
                    </View>
                    <Text style={styles.optionalTimeSlotLabel}>Workshop</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.optionalTimeSlot}
                    onPress={() => {
                      setShowTimeSlots(false);
                      navigation.navigate('Scheduling' as never, { mentorId: 'default', matchId: 'default' } as never);
                    }}
                  >
                    <View style={styles.optionalTimeSlotHeader}>
                      <Text style={styles.optionalTimeSlotTime}>04:15 PM</Text>
                      <Text style={styles.optionalTimeSlotDuration}>30 min</Text>
                    </View>
                    <Text style={styles.optionalTimeSlotLabel}>Q&A Session</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.optionalTimeSlot}
                    onPress={() => {
                      setShowTimeSlots(false);
                      navigation.navigate('Scheduling' as never, { mentorId: 'default', matchId: 'default' } as never);
                    }}
                  >
                    <View style={styles.optionalTimeSlotHeader}>
                      <Text style={styles.optionalTimeSlotTime}>06:00 PM</Text>
                      <Text style={styles.optionalTimeSlotDuration}>90 min</Text>
                    </View>
                    <Text style={styles.optionalTimeSlotLabel}>Deep Dive</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.optionalTimeSlot}
                    onPress={() => {
                      setShowTimeSlots(false);
                      navigation.navigate('Scheduling' as never, { mentorId: 'default', matchId: 'default' } as never);
                    }}
                  >
                    <View style={styles.optionalTimeSlotHeader}>
                      <Text style={styles.optionalTimeSlotTime}>08:30 PM</Text>
                      <Text style={styles.optionalTimeSlotDuration}>60 min</Text>
                    </View>
                    <Text style={styles.optionalTimeSlotLabel}>Evening Session</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Today's Sessions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Sessions</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.todaySessions}>
                <View style={styles.sessionCard}>
                  <View style={styles.sessionTimeContainer}>
                    <Text style={styles.sessionTime}>14:00</Text>
                    <Text style={styles.sessionDuration}>60 min</Text>
                  </View>
                  <View style={styles.sessionContent}>
                    <Text style={styles.sessionTitle}>AI Fundamentals with Dr. Sarah Chen</Text>
                    <Text style={styles.sessionType}>One-on-One Session</Text>
                    <View style={styles.sessionStatus}>
                      <View style={styles.statusIndicator} />
                      <Text style={styles.statusText}>Upcoming</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.sessionAction}>
                    <Feather name="video" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.sessionCard}>
                  <View style={styles.sessionTimeContainer}>
                    <Text style={styles.sessionTime}>16:30</Text>
                    <Text style={styles.sessionDuration}>45 min</Text>
                  </View>
                  <View style={styles.sessionContent}>
                    <Text style={styles.sessionTitle}>Data Science Workshop</Text>
                    <Text style={styles.sessionType}>Group Session</Text>
                    <View style={styles.sessionStatus}>
                      <View style={[styles.statusIndicator, { backgroundColor: COLORS.success }]} />
                      <Text style={styles.statusText}>Completed</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.sessionAction}>
                    <Feather name="file-text" size={16} color={COLORS.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Upcoming Sessions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.upcomingSessions}>
                <View style={styles.upcomingSessionCard}>
                  <View style={styles.upcomingDateContainer}>
                    <Text style={styles.upcomingDate}>15</Text>
                    <Text style={styles.upcomingMonth}>Jan</Text>
                  </View>
                  <View style={styles.upcomingContent}>
                    <Text style={styles.upcomingTitle}>Machine Learning Basics</Text>
                    <Text style={styles.upcomingMentor}>with Prof. Emily Watson</Text>
                    <Text style={styles.upcomingTime}>10:00 AM - 11:30 AM</Text>
                  </View>
                  <TouchableOpacity style={styles.upcomingAction}>
                    <Feather name="calendar" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.upcomingSessionCard}>
                  <View style={styles.upcomingDateContainer}>
                    <Text style={styles.upcomingDate}>18</Text>
                    <Text style={styles.upcomingMonth}>Jan</Text>
                  </View>
                  <View style={styles.upcomingContent}>
                    <Text style={styles.upcomingTitle}>Career Development Chat</Text>
                    <Text style={styles.upcomingMentor}>with Maria Rodriguez</Text>
                    <Text style={styles.upcomingTime}>2:00 PM - 3:00 PM</Text>
                  </View>
                  <TouchableOpacity style={styles.upcomingAction}>
                    <Feather name="calendar" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Available Time Slots */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Time Slots</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View More</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.timeSlotsContainer}>
                <View style={styles.timeSlotCard}>
                  <View style={styles.timeSlotHeader}>
                    <Text style={styles.timeSlotDate}>Today</Text>
                    <Text style={styles.timeSlotDay}>Monday, Jan 15</Text>
                  </View>
                  <View style={styles.timeSlotsList}>
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>09:00 AM</Text>
                      <Text style={styles.timeSlotDuration}>30 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>10:30 AM</Text>
                      <Text style={styles.timeSlotDuration}>60 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>02:00 PM</Text>
                      <Text style={styles.timeSlotDuration}>45 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.timeSlotCard}>
                  <View style={styles.timeSlotHeader}>
                    <Text style={styles.timeSlotDate}>Tomorrow</Text>
                    <Text style={styles.timeSlotDay}>Tuesday, Jan 16</Text>
                  </View>
                  <View style={styles.timeSlotsList}>
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>11:00 AM</Text>
                      <Text style={styles.timeSlotDuration}>60 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>03:30 PM</Text>
                      <Text style={styles.timeSlotDuration}>30 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.timeSlotCard}>
                  <View style={styles.timeSlotHeader}>
                    <Text style={styles.timeSlotDate}>Wednesday</Text>
                    <Text style={styles.timeSlotDay}>Jan 17</Text>
                  </View>
                  <View style={styles.timeSlotsList}>
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>09:30 AM</Text>
                      <Text style={styles.timeSlotDuration}>45 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>01:00 PM</Text>
                      <Text style={styles.timeSlotDuration}>60 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.timeSlot}>
                      <Text style={styles.timeSlotTime}>04:15 PM</Text>
                      <Text style={styles.timeSlotDuration}>30 min</Text>
                      <View style={styles.timeSlotStatus}>
                        <Text style={styles.timeSlotStatusText}>Available</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.scheduleQuickActions}>
              <TouchableOpacity 
                style={styles.quickActionCard}
                onPress={() => navigation.navigate('Scheduling' as never, { mentorId: 'default', matchId: 'default' } as never)}
              >
                <View style={styles.quickActionIcon}>
                  <Feather name="plus" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.quickActionTitle}>Book Session</Text>
                <Text style={styles.quickActionSubtitle}>Schedule with a mentor</Text>
                
                {/* Available Time Slots */}
                <View style={styles.bookingTimeSlots}>
                  <View style={styles.bookingTimeSlot}>
                    <Text style={styles.bookingTimeText}>09:00 AM</Text>
                    <Text style={styles.bookingDurationText}>30 min</Text>
                  </View>
                  <View style={styles.bookingTimeSlot}>
                    <Text style={styles.bookingTimeText}>10:30 AM</Text>
                    <Text style={styles.bookingDurationText}>60 min</Text>
                  </View>
                  <View style={styles.bookingTimeSlot}>
                    <Text style={styles.bookingTimeText}>02:00 PM</Text>
                    <Text style={styles.bookingDurationText}>45 min</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionCard}
                onPress={() => {
                  // Handle set availability
                  console.log('Set availability pressed');
                }}
              >
                <View style={styles.quickActionIcon}>
                  <Feather name="clock" size={24} color={COLORS.secondary} />
                </View>
                <Text style={styles.quickActionTitle}>Set Availability</Text>
                <Text style={styles.quickActionSubtitle}>Manage your schedule</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionCard}
                onPress={() => {
                  // Handle calendar sync
                  console.log('Calendar sync pressed');
                }}
              >
                <View style={styles.quickActionIcon}>
                  <Feather name="calendar" size={24} color={COLORS.success} />
                </View>
                <Text style={styles.quickActionTitle}>Calendar Sync</Text>
                <Text style={styles.quickActionSubtitle}>Connect your calendar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 'connections':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <MentorshipStatusOverview
              mentorships={mentorships}
              userRole={userRole || 'mentee'}
              onMentorshipPress={(mentorship) => {
                console.log('Mentorship pressed:', mentorship);
              }}
            />
          </ScrollView>
        );

      case 'findMentor':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.findMentorContainer}>
            {/* Enhanced Header */}
            <View style={styles.findMentorHeader}>
              <Text style={styles.findMentorTitle}>Find Your Perfect Mentor</Text>
              <Text style={styles.findMentorSubtitle}>Connect with experienced professionals in your field</Text>
            </View>

            {/* Enhanced Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Feather name="search" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search mentors by skills, industry, or name..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Filters Section */}
            <View style={styles.filtersContainer}>
              <Text style={styles.filtersTitle}>Filters</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                <TouchableOpacity style={[styles.filterChip, activeFilter === 'All' && styles.filterChipActive]} onPress={() => handleFilterPress('All')}>
                  <Text style={styles.filterChipText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, activeFilter === 'Machine Learning' && styles.filterChipActive]} onPress={() => handleFilterPress('Machine Learning')}>
                  <Text style={styles.filterChipText}>AI/ML</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, activeFilter === 'Data Science' && styles.filterChipActive]} onPress={() => handleFilterPress('Data Science')}>
                  <Text style={styles.filterChipText}>Data Science</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, activeFilter === 'Web Dev' && styles.filterChipActive]} onPress={() => handleFilterPress('Web Dev')}>
                  <Text style={styles.filterChipText}>Web Dev</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, activeFilter === 'Mobile' && styles.filterChipActive]} onPress={() => handleFilterPress('Mobile')}>
                  <Text style={styles.filterChipText}>Mobile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, activeFilter === 'UX/UI' && styles.filterChipActive]} onPress={() => handleFilterPress('UX/UI')}>
                  <Text style={styles.filterChipText}>UX/UI</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Results Counter */}
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsText}>
                {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
              </Text>
              {(activeFilter !== 'All' || searchQuery !== '') && (
                <TouchableOpacity onPress={() => { setActiveFilter('All'); setSearchQuery(''); }}>
                  <Text style={styles.clearFiltersText}>Clear filters</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Featured Mentors with Profile Pictures */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Mentors</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuredMentors}>
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor) => (
                    <TouchableOpacity key={mentor.id} style={styles.mentorCard}>
                      <View style={styles.mentorCardHeader}>
                        <Image 
                          source={{ uri: mentor.profilePic }} 
                          style={styles.mentorProfilePic}
                        />
                        <View style={styles.mentorBadge}>
                          <Feather name={mentor.badge as any} size={12} color={COLORS.white} />
                        </View>
                      </View>
                      <View style={styles.mentorInfo}>
                        <Text style={styles.mentorName}>{mentor.name}</Text>
                        <Text style={styles.mentorRole}>{mentor.role} at {mentor.company}</Text>
                        <View style={styles.mentorTags}>
                          {mentor.skills.slice(0, 3).map((skill, index) => (
                            <View key={index} style={styles.tag}>
                              <Text style={styles.tagText}>{skill}</Text>
                            </View>
                          ))}
                        </View>
                        <View style={styles.mentorStats}>
                          <View style={styles.statItem}>
                            <Feather name="star" size={14} color={COLORS.primary} />
                            <Text style={styles.statText}>{mentor.rating.toFixed(1)}</Text>
                          </View>
                          <View style={styles.statItem}>
                            <Feather name="users" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.statText}>{mentor.sessions} sessions</Text>
                          </View>
                          <View style={styles.statItem}>
                            <Feather name="clock" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.statText}>{mentor.experience}</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.connectButton}
                        onPress={() => navigation.navigate('MentorProfile' as never, { mentorId: mentor.id } as never)}
                      >
                        <Feather name="user-plus" size={16} color={COLORS.white} />
                        <Text style={styles.connectButtonText}>Connect</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Feather name="search" size={48} color={COLORS.textSecondary} />
                    <Text style={styles.emptyTitle}>No mentors found</Text>
                    <Text style={styles.emptyText}>
                      Try adjusting your search terms or browse all mentors
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Enhanced Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse by Category</Text>
              <View style={styles.categoryGrid}>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => {
                    setActiveFilter('Web Dev');
                    setSearchQuery('');
                  }}
                >
                  <View style={styles.categoryIcon}>
                    <Feather name="code" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.categoryTitle}>Software Development</Text>
                  <Text style={styles.categoryCount}>24 mentors</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => {
                    setActiveFilter('Data Science');
                    setSearchQuery('');
                  }}
                >
                  <View style={styles.categoryIcon}>
                    <Feather name="database" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.categoryTitle}>Data Science</Text>
                  <Text style={styles.categoryCount}>18 mentors</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => {
                    setActiveFilter('Mobile');
                    setSearchQuery('');
                  }}
                >
                  <View style={styles.categoryIcon}>
                    <Feather name="smartphone" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.categoryTitle}>Mobile Development</Text>
                  <Text style={styles.categoryCount}>15 mentors</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => {
                    setActiveFilter('Cybersecurity');
                    setSearchQuery('');
                  }}
                >
                  <View style={styles.categoryIcon}>
                    <Feather name="shield" size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.categoryTitle}>Cybersecurity</Text>
                  <Text style={styles.categoryCount}>12 mentors</Text>
                </TouchableOpacity>
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your mentorship dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mentorship Hub</Text>
          <Text style={styles.subtitle}>
            {userRole === 'mentor' ? 'Guide and inspire the next generation' : 'Grow with expert guidance'}
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Feather name="home" size={20} color={activeTab === 'overview' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
            onPress={() => setActiveTab('schedule')}
          >
            <Feather name="calendar" size={20} color={activeTab === 'schedule' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'connections' && styles.activeTab]}
            onPress={() => setActiveTab('connections')}
          >
            <Feather name="users" size={20} color={activeTab === 'connections' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'connections' && styles.activeTabText]}>Connections</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'findMentor' && styles.activeTab]}
            onPress={() => setActiveTab('findMentor')}
          >
            <Feather name="search" size={20} color={activeTab === 'findMentor' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'findMentor' && styles.activeTabText]}>Find Mentor</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>


      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
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
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Schedule Tab Styles
  scheduleContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  scheduleHeaderContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  addSessionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleStats: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  scheduleStatCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  scheduleStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  todaySessions: {
    gap: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionTimeContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sessionDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  sessionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  sessionAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  upcomingSessions: {
    gap: 12,
  },
  upcomingSessionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingDateContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  upcomingDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  upcomingMonth: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  upcomingMentor: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  upcomingTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  upcomingAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  scheduleQuickActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Time Slots Styles
  timeSlotsContainer: {
    gap: 16,
  },
  timeSlotCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeSlotHeader: {
    marginBottom: 12,
  },
  timeSlotDate: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  timeSlotDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timeSlotsList: {
    gap: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  timeSlotTime: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeSlotDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timeSlotStatus: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeSlotStatusText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  // Booking Time Slots Styles
  bookingTimeSlots: {
    marginTop: 12,
    gap: 6,
  },
  bookingTimeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bookingTimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  bookingDurationText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  // Find Mentor Styles
  findMentorContainer: {
    flex: 1,
  },
  findMentorHeader: {
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  findMentorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  findMentorSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
    marginLeft: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  featuredMentors: {
    gap: 8,
  },
  mentorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mentorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  mentorRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  mentorSkills: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  mentorStats: {
    flexDirection: 'row',
    gap: 12,
  },
  mentorRating: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  mentorSessions: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  connectButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Enhanced Find Mentor Styles
  filtersContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filterChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  mentorCardHeader: {
    position: 'relative',
    marginBottom: 8,
  },
  mentorProfilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  mentorBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 9,
    color: COLORS.primary,
    fontWeight: '500',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  mentorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  mentorRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  mentorStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  connectButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryCard: {
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
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  clearFiltersText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  overviewContainer: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.white,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  activitySection: {
    marginBottom: 20,
  },
  activityList: {
    gap: 12,
  },
  upcomingSection: {
    marginBottom: 20,
  },
  upcomingList: {
    gap: 12,
  },
  flowSection: {
    marginBottom: 20,
  },
  // Optional Time Slots Styles
  optionalTimeSlotsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 20,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionalTimeSlotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionalTimeSlotsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  optionalTimeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionalTimeSlot: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  optionalTimeSlotHeader: {
    marginBottom: 4,
  },
  optionalTimeSlotTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  optionalTimeSlotDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  optionalTimeSlotLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  quickActionCard: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressCard: {
    flex: 1,
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
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default UnifiedMentorshipScreen; 