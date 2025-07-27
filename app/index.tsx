import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
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
import EventsScreen from './EventsScreen';
import WorkshopsScreen from './WorkshopsScreen';
import MyMentorshipsScreen from './MyMentorshipsScreen';
import FeedbackProgressScreen from './FeedbackProgressScreen';
import SchedulingScreen from './SchedulingScreen';
import SignUpScreen from './SignUpScreen';
import MentorOnboardingScreen from './MenteeOnboardingScreen';
import MenteeOnboardingScreen from './MenteeOnboardingScreen';
import MentorshipDashboardScreen from './MentorshipDashboardScreen';
import UnifiedMentorshipScreen from './UnifiedMentorshipScreen';
import ScreenWrapper from '../components/ScreenWrapper';

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

// Wrapped screen components with sidebar
const WrappedHomeScreen = () => (
    <ScreenWrapper>
        <HomeScreen />
    </ScreenWrapper>
);

const WrappedLearningCenterScreen = () => (
    <ScreenWrapper>
        <LearningCenterScreen />
    </ScreenWrapper>
);

const WrappedEventsScreen = () => (
    <ScreenWrapper>
        <EventsScreen />
    </ScreenWrapper>
);

const WrappedWorkshopsScreen = () => (
    <ScreenWrapper>
        <WorkshopsScreen />
    </ScreenWrapper>
);

const WrappedCommunitiesScreen = () => (
    <ScreenWrapper>
        <CommunitiesScreen />
    </ScreenWrapper>
);

const WrappedProfileScreen = () => (
    <ScreenWrapper>
        <ProfilePage />
    </ScreenWrapper>
);

// Wrapped components for additional stacks
const WrappedUnifiedMentorshipScreen = () => (
    <ScreenWrapper>
        <UnifiedMentorshipScreen />
    </ScreenWrapper>
);

const WrappedMentorDirectoryScreen = () => (
    <ScreenWrapper>
        <MentorDirectoryScreen />
    </ScreenWrapper>
);

const WrappedMentorProfileScreen = () => (
    <ScreenWrapper>
        <MentorProfileScreen />
    </ScreenWrapper>
);

const WrappedMyMentorshipsScreen = () => (
    <ScreenWrapper>
        <MyMentorshipsScreen />
    </ScreenWrapper>
);

const WrappedSchedulingScreen = () => (
    <ScreenWrapper>
        <SchedulingScreen />
    </ScreenWrapper>
);

const WrappedFeedbackProgressScreen = () => (
    <ScreenWrapper>
        <FeedbackProgressScreen />
    </ScreenWrapper>
);

const WrappedMentorshipRequestsScreen = () => (
    <ScreenWrapper>
        <MentorshipRequestsScreen />
    </ScreenWrapper>
);

const WrappedMentorshipChatScreen = () => (
    <ScreenWrapper>
        <MentorshipChatScreen />
    </ScreenWrapper>
);

const WrappedChatScreen = () => (
    <ScreenWrapper>
        <ChatScreen />
    </ScreenWrapper>
);

const HomeStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Home" component={WrappedHomeScreen} />
    </Stack.Navigator>
);

const LearningCenterStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="LearningCenter" component={WrappedLearningCenterScreen} />
    </Stack.Navigator>
);

const EventsStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Events" component={WrappedEventsScreen} />
    </Stack.Navigator>
);

const WorkshopsStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Workshops" component={WrappedWorkshopsScreen} />
    </Stack.Navigator>
);

const CommunitiesStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="CommunitiesList" component={WrappedCommunitiesScreen} />
        <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen as React.FC} />
    </Stack.Navigator>
);

const ProfileStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Profile" component={WrappedProfileScreen} />
    </Stack.Navigator>
);

const MentorshipStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="MentorshipDashboard" component={WrappedUnifiedMentorshipScreen} />
        <Stack.Screen name="MentorDirectory" component={WrappedMentorDirectoryScreen} />
        <Stack.Screen name="MentorProfile" component={WrappedMentorProfileScreen} />
        <Stack.Screen name="MyMentorships" component={WrappedMyMentorshipsScreen} />
        <Stack.Screen name="Scheduling" component={WrappedSchedulingScreen} />
        <Stack.Screen name="Feedback" component={WrappedFeedbackProgressScreen} />
    </Stack.Navigator>
);

const MentorshipRequestsStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="MentorshipRequests" component={WrappedMentorshipRequestsScreen} />
        <Stack.Screen name="MentorshipChat" component={WrappedMentorshipChatScreen} />
    </Stack.Navigator>
);

const ChatStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="Chat" component={WrappedChatScreen} />
    </Stack.Navigator>
);

const FeedbackProgressStack: React.FC = () => (
    <Stack.Navigator screenOptions={commonOptions}>
        <Stack.Screen name="FeedbackProgress" component={WrappedFeedbackProgressScreen} />
    </Stack.Navigator>
);

const MainTabs: React.FC = () => (
    <Tab.Navigator screenOptions={tabOptions}>
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }} />
        <Tab.Screen name="LearningCenterTab" component={LearningCenterStack} options={{ title: 'Learning', tabBarIcon: ({ color, size }) => <Feather name="book-open" color={color} size={size} /> }} />
        <Tab.Screen name="EventsTab" component={EventsStack} options={{ title: 'Events', tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} /> }} />
        <Tab.Screen name="WorkshopsTab" component={WorkshopsStack} options={{ title: 'Workshops', tabBarIcon: ({ color, size }) => <Feather name="award" color={color} size={size} /> }} />
        <Tab.Screen name="CommunitiesTab" component={CommunitiesStack} options={{ title: 'Communities', tabBarIcon: ({ color, size }) => <Feather name="message-square" color={color} size={size} /> }} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} /> }} />
    </Tab.Navigator>
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
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="MentorshipStack" component={MentorshipStack} />
                <Stack.Screen name="MentorshipRequestsStack" component={MentorshipRequestsStack} />
                <Stack.Screen name="ChatStack" component={ChatStack} />
                <Stack.Screen name="FeedbackProgressStack" component={FeedbackProgressStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
