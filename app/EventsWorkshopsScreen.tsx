import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import CalendarIntegration from '../components/CalendarIntegration';
import BackButton from '../components/BackButton';


type TabType = 'events' | 'workshops';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  description: string;
  registerCount?: number;
  registered: boolean;
}

interface WorkshopItem {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  skill: string;
  description: string;
  registered: boolean;
}

const EventsWorkshopsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Mock data for events and workshops
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Mock events data
        const mockEvents: EventItem[] = [
          {
            id: '1',
            title: 'Women in Tech Conference 2024',
            date: '2024-01-15',
            time: '14:00',
            endTime: '17:00',
            location: 'Virtual Event',
            description: 'Join us for an inspiring conference featuring keynote speakers, panel discussions, and networking opportunities for women in technology.',
            registerCount: 156,
            registered: false,
          },
          {
            id: '2',
            title: 'AI Workshop Series',
            date: '2024-01-18',
            time: '10:00',
            endTime: '12:00',
            location: 'Online Workshop',
            description: 'Learn the fundamentals of artificial intelligence and machine learning through hands-on workshops and real-world projects.',
            registerCount: 89,
            registered: false,
          },
          {
            id: '3',
            title: 'Networking Mixer',
            date: '2024-01-22',
            time: '18:00',
            endTime: '20:00',
            location: 'Tech Hub Downtown',
            description: 'Connect with fellow professionals in a relaxed networking environment. Light refreshments provided.',
            registerCount: 45,
            registered: false,
          },
          {
            id: '4',
            title: 'Career Development Seminar',
            date: '2024-01-25',
            time: '15:30',
            endTime: '17:30',
            location: 'Virtual Event',
            description: 'Expert-led seminar on career advancement strategies, salary negotiation, and building your professional brand.',
            registerCount: 203,
            registered: false,
          },
          {
            id: '5',
            title: 'Code Review Best Practices',
            date: '2024-01-28',
            time: '13:00',
            endTime: '15:00',
            location: 'Online Workshop',
            description: 'Learn effective code review techniques, feedback strategies, and how to maintain code quality in team environments.',
            registerCount: 67,
            registered: false,
          },
          {
            id: '6',
            title: 'Leadership in Tech Panel',
            date: '2024-02-01',
            time: '16:00',
            endTime: '18:00',
            location: 'Virtual Event',
            description: 'Panel discussion with tech leaders sharing insights on leadership, management, and career growth in technology.',
            registerCount: 134,
            registered: false,
          },
        ];

        // Mock workshops data
        const mockWorkshops: WorkshopItem[] = [
          {
            id: 'w1',
            title: 'Introduction to Machine Learning',
            date: '2024-01-16',
            time: '09:00',
            duration: 120,
            skill: 'AI/ML',
            description: 'A comprehensive introduction to machine learning concepts, algorithms, and practical applications.',
            registered: false,
          },
          {
            id: 'w2',
            title: 'React Native Development',
            date: '2024-01-19',
            time: '14:00',
            duration: 90,
            skill: 'Mobile Development',
            description: 'Learn to build cross-platform mobile applications using React Native framework.',
            registered: false,
          },
          {
            id: 'w3',
            title: 'Data Visualization with Python',
            date: '2024-01-23',
            time: '10:30',
            duration: 75,
            skill: 'Data Science',
            description: 'Master data visualization techniques using Python libraries like Matplotlib and Seaborn.',
            registered: false,
          },
          {
            id: 'w4',
            title: 'Cybersecurity Fundamentals',
            date: '2024-01-26',
            time: '13:00',
            duration: 60,
            skill: 'Cybersecurity',
            description: 'Learn essential cybersecurity concepts, threat detection, and security best practices.',
            registered: false,
          },
          {
            id: 'w5',
            title: 'UX/UI Design Principles',
            date: '2024-01-29',
            time: '15:00',
            duration: 90,
            skill: 'UX/UI',
            description: 'Explore user experience and interface design principles, wireframing, and prototyping techniques.',
            registered: false,
          },
          {
            id: 'w6',
            title: 'Cloud Computing with AWS',
            date: '2024-02-02',
            time: '11:00',
            duration: 120,
            skill: 'Cloud Computing',
            description: 'Introduction to AWS services, cloud architecture, and deployment strategies.',
            registered: false,
          },
          {
            id: 'w7',
            title: 'Git and Version Control',
            date: '2024-02-05',
            time: '14:30',
            duration: 60,
            skill: 'Development Tools',
            description: 'Master Git workflows, branching strategies, and collaborative development practices.',
            registered: false,
          },
          {
            id: 'w8',
            title: 'Agile Project Management',
            date: '2024-02-08',
            time: '16:00',
            duration: 90,
            skill: 'Project Management',
            description: 'Learn Agile methodologies, Scrum practices, and effective team collaboration techniques.',
            registered: false,
          },
        ];

        setEvents(mockEvents);
        setWorkshops(mockWorkshops);
      } catch (err) {
        console.error("Error loading mock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = async (id: string) => {
    setEvents(evts =>
      evts.map(e => {
        if (e.id === id) {
          const newRegistered = !e.registered;
          return {
            ...e,
            registered: newRegistered,
            registerCount: newRegistered ? (e.registerCount || 0) + 1 : (e.registerCount || 1) - 1
          };
        }
        return e;
      })
    );

    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
  };

  const handleWorkshopRegister = async (id: string) => {
    setWorkshops(ws =>
      ws.map(w => (w.id === id ? { ...w, registered: !w.registered } : w))
    );

    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
  };

  const renderEventCard = ({ item }: { item: EventItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Feather name="calendar" size={16} color={COLORS.primary} />
        <Text style={styles.cardType}>Event</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardInfo}><Feather name="calendar" size={14} color={COLORS.primary} /> {item.date}</Text>
      <Text style={styles.cardInfo}>
        <Feather name="clock" size={14} color={COLORS.primary} /> {item.time}
        {item.endTime ? ` - ${item.endTime}` : ''}
      </Text>
      {item.location && (
        <Text style={styles.cardInfo}><Feather name="map-pin" size={14} color={COLORS.primary} /> {item.location}</Text>
      )}
      <Text style={styles.cardDesc}>{item.description}</Text>
      <View style={styles.cardActions}>
        {typeof item.registerCount === "number" && (
          <Text style={styles.registerCount}>
            <Feather name="users" size={14} color={COLORS.secondary} /> {item.registerCount} Registered
          </Text>
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, item.registered ? styles.actionBtnRegistered : styles.actionBtnUnregistered]}
            onPress={() => handleRegister(item.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>{item.registered ? 'Unregister' : 'Register'}</Text>
          </TouchableOpacity>

          <CalendarIntegration
            event={{
              title: item.title,
              description: `${item.description}\n\nLocation: ${item.location || ''}`,
              startDate: new Date(`${item.date}T${item.time}`),
              endDate: new Date(`${item.date}T${item.endTime || item.time}`),
              location: item.location || '',
              type: 'event',
            }}
            buttonStyle="secondary"
            buttonText="Add to Calendar"
            showConfirmation={true}
          />
        </View>
      </View>
    </View>
  );

  const renderWorkshopCard = ({ item }: { item: WorkshopItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Feather name="award" size={16} color={COLORS.secondary} />
        <Text style={[styles.cardType, { color: COLORS.secondary }]}>Workshop</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardInfo}><Feather name="calendar" size={14} color={COLORS.primary} /> {item.date}</Text>
      <Text style={styles.cardInfo}>
        <Feather name="clock" size={14} color={COLORS.primary} /> {item.time} ({item.duration} min)
      </Text>
      <Text style={styles.cardInfo}><Feather name="award" size={14} color={COLORS.primary} /> {item.skill}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>

      <View style={styles.cardActions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, item.registered ? styles.actionBtnRegistered : styles.actionBtnUnregistered]}
            onPress={() => handleWorkshopRegister(item.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>{item.registered ? 'Unregister' : 'Register'}</Text>
          </TouchableOpacity>

          <CalendarIntegration
            event={{
              title: item.title,
              description: `${item.description}\n\nSkill: ${item.skill}`,
              startDate: new Date(`${item.date}T${item.time}`),
              endDate: new Date(`${item.date}T${item.time}`),
              type: 'workshop',
            }}
            buttonStyle="secondary"
            buttonText="Add to Calendar"
            showConfirmation={true}
          />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <BackButton />
      </View>
      <Text style={styles.title}>Events & Workshops</Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Feather name="calendar" size={16} color={activeTab === 'events' ? COLORS.white : COLORS.primary} />
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'workshops' && styles.activeTab]}
          onPress={() => setActiveTab('workshops')}
        >
          <Feather name="award" size={16} color={activeTab === 'workshops' ? COLORS.white : COLORS.secondary} />
          <Text style={[styles.tabText, activeTab === 'workshops' && styles.activeTabText]}>Workshops</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'events' ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderEventCard}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={workshops}
          keyExtractor={item => item.id}
          renderItem={renderWorkshopCard}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {success && (
        <View style={styles.successBox}>
          <Feather name="check-circle" size={18} color={COLORS.success} />
          <Text style={styles.successText}>Registered!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 18,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cardType: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  cardActions: {
    marginTop: 12,
  },
  registerCount: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    flex: 1,
  },
  actionBtnRegistered: {
    backgroundColor: COLORS.accent,
  },
  actionBtnUnregistered: {
    backgroundColor: COLORS.primary,
  },
  actionBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  successText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default EventsWorkshopsScreen;
