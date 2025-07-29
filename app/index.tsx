import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { TextStyle } from 'react-native';
import CommunitiesScreen from './CommunitiesScreen';
import WelcomeScreen from './WelcomeScreen';
import LoginPage from './loginPage';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import ProfilePage from './ProfilePage';
import CommunityDetailScreen from './CommunityDetailScreen';
import MentorDirectoryScreen from './MentorDirectoryScreen';
import MentorProfileScreen from './MentorProfileScreen';
import MentorshipRequestsScreen from './MentorshipRequestsScreen';
import MentorshipChatScreen from './MentorshipChatScreen';
import LearningCenterScreen from './LearningCenterScreen';
import EventsWorkshopsScreen from './EventsWorkshopsScreen';
import MyMentorshipsScreen from './MyMentorshipsScreen';
import FeedbackProgressScreen from './FeedbackProgressScreen';
import SchedulingScreen from './SchedulingScreen';
import SignUpScreen from './SignUpScreen';
import MentorOnboardingScreen from './MenteeOnboardingScreen';
import MenteeOnboardingScreen from './MenteeOnboardingScreen';
import MentorshipDashboardScreen from './MentorshipDashboardScreen';
import UnifiedMentorshipScreen from './UnifiedMentorshipScreen';
import AboutScreen from './AboutScreen';

// Type definitions for navigation
export type RootStackParamList = {
    Welcome: undefined;
    LoginPage: undefined;
    Main: undefined;
    Home: undefined;
    Chat: undefined;
    Profile: undefined;
    CommunitiesList: undefined;
    CommunityDetail: { community: any }; // Replace 'any' with your Community type
    MentorDirectory: undefined;
    MentorProfile: { mentorId: string };
    MentorshipRequests: undefined;
    MentorshipChat: { matchId: string };
    MyMentorships: undefined;
    Scheduling: { mentorId: string; matchId: string };
    SignUp: undefined;
    FeedbackProgress: undefined;
    Feedback: { matchId: string; mentorId: string; menteeId: string };
    MentorOnboarding: undefined;
    MenteeOnboarding: undefined;
    MentorshipDashboard: undefined;
    About: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const commonOptions = {
    headerShown: false,
};

const tabOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.textSecondary,
    tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.accent,
        height: 60,
        paddingBottom: 8,
    },
    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
    } as TextStyle,
};

// Screen component type helper
type ScreenComponent<T extends ParamListBase, K extends keyof T> = React.FC<StackScreenProps<T, K>>;

const HomeStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Home" component={HomeScreen as ScreenComponent<RootStackParamList, 'Home'>} />
    </Stack.Navigator>
);

const ChatStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
);

const CommunitiesStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="CommunitiesList" component={CommunitiesScreen} />
        <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen as React.FC} />
    </Stack.Navigator>
);

const ProfileStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Profile" component={ProfilePage as ScreenComponent<RootStackParamList, 'Profile'>} />
        <Stack.Screen name="FeedbackProgress" component={FeedbackProgressScreen} />
    </Stack.Navigator>
);

const MentorshipStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="MentorshipDashboard" component={UnifiedMentorshipScreen} />
        <Stack.Screen name="MentorDirectory" component={MentorDirectoryScreen as ScreenComponent<RootStackParamList, 'MentorDirectory'>} />
        <Stack.Screen name="MentorProfile" component={MentorProfileScreen as ScreenComponent<RootStackParamList, 'MentorProfile'>} />
        <Stack.Screen name="MyMentorships" component={MyMentorshipsScreen} />
        <Stack.Screen name="Scheduling" component={SchedulingScreen} />
        <Stack.Screen name="Feedback" component={FeedbackProgressScreen} />
    </Stack.Navigator>
);

const MentorshipRequestsStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="MentorshipRequests" component={MentorshipRequestsScreen} />
        <Stack.Screen name="MentorshipChat" component={MentorshipChatScreen} />
    </Stack.Navigator>
);

const MainTabs: React.FC = () => (
    <Tab.Navigator screenOptions={tabOptions}>
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }} />
        <Tab.Screen name="MentorshipTab" component={MentorshipStack} options={{ 
          title: 'Mentorship', 
          tabBarIcon: ({ color, size }) => <Feather name="users" color={color} size={size} />
        }} />
        <Tab.Screen name="LearningCenterTab" component={LearningCenterScreen} options={{ title: 'Learning', tabBarIcon: ({ color, size }) => <Feather name="book-open" color={color} size={size} /> }} />
        <Tab.Screen name="EventsWorkshopsTab" component={EventsWorkshopsScreen} options={{ title: 'Events & Workshops', tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} /> }} />
        <Tab.Screen name="CommunitiesTab" component={CommunitiesStack} options={{ title: 'Communities', tabBarIcon: ({ color, size }) => <Feather name="message-square" color={color} size={size} /> }} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} /> }} />
    </Tab.Navigator>
);

const FeedbackProgressStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="FeedbackProgress" component={FeedbackProgressScreen} />
    </Stack.Navigator>
);



export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={commonOptions} initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="LoginPage" component={LoginPage} />
                            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="MentorOnboarding" component={MentorOnboardingScreen} />
            <Stack.Screen name="MenteeOnboarding" component={MenteeOnboardingScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
