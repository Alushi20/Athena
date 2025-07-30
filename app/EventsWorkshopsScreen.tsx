import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import CalendarIntegration from '../components/CalendarIntegration';
import { CalendarEvent } from '../lib/googleCalendar';
import BackButton from '../components/BackButton';

const EVENTS = [
  {
    id: 'event1',
    title: 'Women in AI - Tel Aviv',
    date: '2024-07-15',
    time: '18:00',
    endTime: '21:00',
    location: 'WeWork, Tel Aviv',
    description: 'Panel and networking for women in AI.',
    registerCount: 42,
  },
  {
    id: 'event2',
    title: 'Monthly STEM Meetup',
    date: '2024-07-28',
    time: '19:00',
    endTime: '22:00',
    location: 'Technion, Haifa',
    description: 'Casual networking and lightning talks.',
    registerCount: 18,
  },
  {
    id: 'event3',
    title: 'Tech Career Fair',
    date: '2024-08-05',
    time: '10:00',
    endTime: '16:00',
    location: 'Tel Aviv Convention Center',
    description: 'Connect with top tech companies and find your next opportunity.',
    registerCount: 156,
  },
  {
    id: 'event4',
    title: 'Women in Engineering Conference',
    date: '2024-08-12',
    time: '09:00',
    endTime: '17:00',
    location: 'Hilton Tel Aviv',
    description: 'Annual conference celebrating women in engineering with keynote speakers and workshops.',
    registerCount: 89,
  },
];

const WORKSHOPS = [
  {
    id: 'ws1',
    title: 'Negotiation Role-Play',
    date: '2024-08-01',
    time: '14:00',
    duration: 90,
    skill: 'Negotiation',
    description: 'Practice salary negotiation with a coach.',
    registered: false,
  },
  {
    id: 'ws2',
    title: 'Bias Response Practice',
    date: '2024-08-10',
    time: '10:00',
    duration: 60,
    skill: 'Bias Response',
    description: 'Learn to respond to bias in real time.',
    registered: false,
  },
  {
    id: 'ws3',
    title: 'AI Fundamentals Workshop',
    date: '2024-08-15',
    time: '16:00',
    duration: 120,
    skill: 'AI & Machine Learning',
    description: 'Introduction to artificial intelligence and machine learning concepts.',
    registered: false,
  },
  {
    id: 'ws4',
    title: 'Public Speaking Masterclass',
    date: '2024-08-20',
    time: '13:00',
    duration: 90,
    skill: 'Communication',
    description: 'Build confidence and improve your public speaking skills.',
    registered: false,
  },
];

type TabType = 'events' | 'workshops';

const EventsWorkshopsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [events, setEvents] = useState(EVENTS);
  const [workshops, setWorkshops] = useState(WORKSHOPS);
  const [registered, setRegistered] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = (id: string) => {
    if (registered[id]) {
      // Unregister
      setEvents(evts => evts.map(e => e.id === id ? { ...e, registerCount: e.registerCount - 1 } : e));
      setRegistered(r => ({ ...r, [id]: false }));
    } else {
      // Register
      setEvents(evts => evts.map(e => e.id === id ? { ...e, registerCount: e.registerCount + 1 } : e));
      setRegistered(r => ({ ...r, [id]: true }));
    }
  };

  const handleWorkshopRegister = (id: string) => {
    setWorkshops(ws => ws.map(w => w.id === id ? { ...w, registered: !w.registered } : w));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
  };

  const renderEventCard = ({ item }: { item: typeof EVENTS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Feather name="calendar" size={16} color={COLORS.primary} />
        <Text style={styles.cardType}>Event</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardInfo}><Feather name="calendar" size={14} color={COLORS.primary} /> {item.date}</Text>
      <Text style={styles.cardInfo}><Feather name="clock" size={14} color={COLORS.primary} /> {item.time} - {item.endTime}</Text>
      <Text style={styles.cardInfo}><Feather name="map-pin" size={14} color={COLORS.primary} /> {item.location}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <View style={styles.cardActions}>
        <Text style={styles.registerCount}><Feather name="users" size={14} color={COLORS.secondary} /> {item.registerCount} Registered</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, registered[item.id] ? styles.actionBtnRegistered : styles.actionBtnUnregistered]}
            onPress={() => handleRegister(item.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>{registered[item.id] ? 'Unregister' : 'Register'}</Text>
          </TouchableOpacity>
          
          <CalendarIntegration
            event={{
              title: item.title,
              description: `${item.description}\n\nLocation: ${item.location}`,
              startDate: new Date(`${item.date}T${item.time}`),
              endDate: new Date(`${item.date}T${item.endTime}`),
              location: item.location,
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

  const renderWorkshopCard = ({ item }: { item: typeof WORKSHOPS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Feather name="award" size={16} color={COLORS.secondary} />
        <Text style={[styles.cardType, { color: COLORS.secondary }]}>Workshop</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardInfo}><Feather name="calendar" size={14} color={COLORS.primary} /> {item.date}</Text>
      <Text style={styles.cardInfo}><Feather name="clock" size={14} color={COLORS.primary} /> {item.time} ({item.duration} min)</Text>
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