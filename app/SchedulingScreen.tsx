import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

const MOCK_SLOTS = [
  { id: 'slot1', date: '2024-07-10', time: '09:00-10:00', reserved: false },
  { id: 'slot2', date: '2024-07-10', time: '10:00-11:00', reserved: false },
  { id: 'slot3', date: '2024-07-12', time: '14:00-15:00', reserved: true },
  { id: 'slot4', date: '2024-07-13', time: '16:00-17:00', reserved: false },
];

const SchedulingScreen = ({ route, navigation }: any) => {
  const [slots, setSlots] = useState(MOCK_SLOTS);
  const [booking, setBooking] = useState(false);

  const handleBook = (slotId: string) => {
    setBooking(true);
    setTimeout(() => {
      setSlots(slots => slots.map(s => s.id === slotId ? { ...s, reserved: true } : s));
      setBooking(false);
      Alert.alert('Session Booked', 'Your mentorship session has been scheduled!');
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule a Session</Text>
      <FlatList
        data={slots}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.slotCard}>
            <Text style={styles.slotText}><Feather name="calendar" size={16} color={COLORS.primary} /> {item.date}</Text>
            <Text style={styles.slotText}><Feather name="clock" size={16} color={COLORS.primary} /> {item.time}</Text>
            <TouchableOpacity
              style={[styles.bookBtn, item.reserved && styles.bookBtnDisabled]}
              onPress={() => handleBook(item.id)}
              disabled={item.reserved || booking}
              activeOpacity={0.85}
            >
              <Text style={styles.bookBtnText}>{item.reserved ? 'Reserved' : 'Book'}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 18,
  },
  slotCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotText: {
    fontSize: 15,
    color: COLORS.text,
    marginRight: 12,
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  bookBtnDisabled: {
    backgroundColor: COLORS.accent,
  },
  bookBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default SchedulingScreen; 