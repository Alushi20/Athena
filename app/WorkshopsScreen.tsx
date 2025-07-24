import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

const WORKSHOPS = [
  {
    id: 'ws1',
    title: 'Negotiation Role-Play',
    date: '2024-08-01',
    skill: 'Negotiation',
    description: 'Practice salary negotiation with a coach.',
    registered: false,
  },
  {
    id: 'ws2',
    title: 'Bias Response Practice',
    date: '2024-08-10',
    skill: 'Bias Response',
    description: 'Learn to respond to bias in real time.',
    registered: false,
  },
];

const WorkshopsScreen: React.FC = () => {
  const [workshops, setWorkshops] = useState(WORKSHOPS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = (id: string) => {
    setWorkshops(ws => ws.map(w => w.id === id ? { ...w, registered: true } : w));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workshops & Skill Labs</Text>
      <FlatList
        data={workshops}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.workshopTitle}>{item.title}</Text>
            <Text style={styles.workshopInfo}><Feather name="calendar" size={14} color={COLORS.primary} /> {item.date}</Text>
            <Text style={styles.workshopInfo}><Feather name="award" size={14} color={COLORS.primary} /> {item.skill}</Text>
            <Text style={styles.workshopDesc}>{item.description}</Text>
            <TouchableOpacity
              style={[styles.registerBtn, item.registered && styles.registerBtnDisabled]}
              onPress={() => handleRegister(item.id)}
              disabled={item.registered}
              activeOpacity={0.85}
            >
              <Text style={styles.registerBtnText}>{item.registered ? 'Registered' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
      {success && (
        <View style={styles.successBox}>
          <Feather name="check-circle" size={18} color={COLORS.success} />
          <Text style={styles.successText}>Registered!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 17,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 18,
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
  workshopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  workshopInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  workshopDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  registerBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
  },
  registerBtnDisabled: {
    backgroundColor: COLORS.accent,
  },
  registerBtnText: {
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

export default WorkshopsScreen;