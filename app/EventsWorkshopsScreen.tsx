import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import CalendarIntegration from '../components/CalendarIntegration';
import BackButton from '../components/BackButton';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { auth, db } from "../lib/firebase-config.js";

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

  // Fetch events and workshops from Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = auth.currentUser;

      try {
        // Fetch events
        const eventsSnap = await getDocs(collection(db, "events"));
        const eventData: EventItem[] = [];
        for (const docSnap of eventsSnap.docs) {
          const data = docSnap.data() as Omit<EventItem, 'id' | 'registered'>;
          let registered = false;

          if (user) {
            const regSnap = await getDoc(doc(db, `users/${user.uid}/events/${docSnap.id}`));
            registered = regSnap.exists();
          }

          eventData.push({
            id: docSnap.id,
            ...data,
            registered,
          });
        }

        // Fetch workshops
        const workshopsSnap = await getDocs(collection(db, "workshops"));
        const workshopData: WorkshopItem[] = [];
        for (const docSnap of workshopsSnap.docs) {
          const data = docSnap.data() as Omit<WorkshopItem, 'id' | 'registered'>;
          let registered = false;

          if (user) {
            const regSnap = await getDoc(doc(db, `users/${user.uid}/workshops/${docSnap.id}`));
            registered = regSnap.exists();
          }

          workshopData.push({
            id: docSnap.id,
            ...data,
            registered,
          });
        }

        setEvents(eventData);
        setWorkshops(workshopData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const eventRef = doc(db, `users/${user.uid}/events/${id}`);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      await deleteDoc(eventRef);
      setEvents(evts =>
        evts.map(e => (e.id === id ? { ...e, registered: false, registerCount: (e.registerCount || 1) - 1 } : e))
      );
    } else {
      await setDoc(eventRef, { eventId: id });
      setEvents(evts =>
        evts.map(e => (e.id === id ? { ...e, registered: true, registerCount: (e.registerCount || 0) + 1 } : e))
      );
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
  };

  const handleWorkshopRegister = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const eventRef = doc(db, `users/${user.uid}/workshops/${id}`);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      await deleteDoc(eventRef);
      setWorkshops(ws =>
        ws.map(w => (w.id === id ? { ...w, registered: false } : w))
      );
    } else {
      await setDoc(eventRef, { workshopId: id });
      setWorkshops(ws =>
        ws.map(w => (w.id === id ? { ...w, registered: true } : w))
      );
    }

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
