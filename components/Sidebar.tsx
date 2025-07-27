import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  const menuItems = [
    {
      title: 'Home',
      icon: 'home',
      route: 'HomeTab',
      stack: 'Main',
    },
    {
      title: 'Learning Center',
      icon: 'book-open',
      route: 'LearningCenterTab',
      stack: 'Main',
    },
    {
      title: 'Events',
      icon: 'calendar',
      route: 'EventsTab',
      stack: 'Main',
    },
    {
      title: 'Workshops',
      icon: 'award',
      route: 'WorkshopsTab',
      stack: 'Main',
    },
    {
      title: 'Communities',
      icon: 'message-square',
      route: 'CommunitiesTab',
      stack: 'Main',
    },
    {
      title: 'Profile',
      icon: 'user',
      route: 'ProfileTab',
      stack: 'Main',
    },
    // Additional pages accessible via sidebar
    {
      title: 'Mentorship Hub',
      icon: 'users',
      route: 'MentorshipDashboard',
      stack: 'MentorshipStack',
    },
    {
      title: 'Chat',
      icon: 'send',
      route: 'Chat',
      stack: 'ChatStack',
    },
    {
      title: 'Mentorship Requests',
      icon: 'bell',
      route: 'MentorshipRequests',
      stack: 'MentorshipRequestsStack',
    },
    {
      title: 'My Mentorships',
      icon: 'user-check',
      route: 'MyMentorships',
      stack: 'MentorshipStack',
    },
    {
      title: 'Mentor Directory',
      icon: 'users',
      route: 'MentorDirectory',
      stack: 'MentorshipStack',
    },
    {
      title: 'Feedback Progress',
      icon: 'bar-chart-2',
      route: 'FeedbackProgress',
      stack: 'FeedbackProgressStack',
    },
  ];

  const handleNavigation = (item: any) => {
    onClose();
    try {
      if (item.stack === 'Main') {
        navigation.navigate('Main' as never, { screen: item.route } as never);
      } else {
        // Navigate to the specific stack
        navigation.navigate(item.stack as never);
      }
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.sidebar}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item)}
            >
              <View style={styles.menuItemContent}>
                <Feather name={item.icon as any} size={20} color={COLORS.textPrimary} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default Sidebar;