import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from "react-native";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const COMMUNITIES = [
  {
    id: "1",
    title: "Job Search Tips",
    description: "Advice and resources for finding your next STEM job.",
    icon: "briefcase-search-outline",
  },
  {
    id: "2",
    title: "First Year in STEM",
    description: "Share your experiences and get support in your first year.",
    icon: "calendar-star",
  },
  {
    id: "3",
    title: "Handling Workplace Bias",
    description: "Discuss challenges and solutions for bias in STEM fields.",
    icon: "account-group-outline",
  },
  {
    id: "4",
    title: "Early Career Struggles",
    description: "Talk about the ups and downs of starting out in STEM.",
    icon: "emoticon-sad-outline",
  },
  {
    id: "5",
    title: "Weekly Panel & Q&A",
    description: "Join our weekly expert panel and ask your questions!",
    icon: "forum-outline",
  },
];

export default function CommunitiesScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Communities</Text>
      <FlatList
        data={COMMUNITIES}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CommunityDetail', { community: item })}
          >
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name={item.icon as any} size={32} color="#a66cff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#a66cff" />
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.createBtn} activeOpacity={0.85}>
        <Feather name="plus-circle" size={22} color="#fff" />
        <Text style={styles.createBtnText}>Create New Community</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6e6ff',
    paddingTop: 32,
    paddingHorizontal: 18,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a66cff',
    marginBottom: 18,
    letterSpacing: 1.1,
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapper: {
    marginRight: 16,
    backgroundColor: '#e7c6ff',
    borderRadius: 12,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f5283',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#7f5283',
    opacity: 0.8,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a66cff',
    borderRadius: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#a66cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
}); 