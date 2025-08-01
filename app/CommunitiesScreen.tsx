import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Animated, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/BackButton';

const { width } = Dimensions.get('window');

const COMMUNITIES = [
  {
    id: "1",
    title: "Job Search Tips",
    description: "Advice and resources for finding your next STEM job.",
    icon: "briefcase-search-outline",
    memberCount: 1247,
    isJoined: false,
    category: "Career"
  },
  {
    id: "2",
    title: "First Year in STEM",
    description: "Share your experiences and get support in your first year.",
    icon: "calendar-star",
    memberCount: 892,
    isJoined: true,
    category: "Support"
  },
  {
    id: "3",
    title: "Handling Workplace Bias",
    description: "Discuss challenges and solutions for bias in STEM fields.",
    icon: "account-group-outline",
    memberCount: 2156,
    isJoined: false,
    category: "Advocacy"
  },
  {
    id: "4",
    title: "Early Career Struggles",
    description: "Talk about the ups and downs of starting out in STEM.",
    icon: "emoticon-sad-outline",
    memberCount: 1567,
    isJoined: true,
    category: "Support"
  },
  {
    id: "5",
    title: "Weekly Panel & Q&A",
    description: "Join our weekly expert panel and ask your questions!",
    icon: "forum-outline",
    memberCount: 3421,
    isJoined: false,
    category: "Events"
  },
  {
    id: "6",
    title: "Mentorship Stories",
    description: "Share your mentorship experiences and success stories.",
    icon: "heart-multiple",
    memberCount: 987,
    isJoined: false,
    category: "Mentorship"
  },
  {
    id: "7",
    title: "Tech Leadership",
    description: "Discuss leadership challenges and growth in tech.",
    icon: "crown",
    memberCount: 743,
    isJoined: false,
    category: "Leadership"
  },
  {
    id: "8",
    title: "Work-Life Balance",
    description: "Tips and discussions about maintaining balance in STEM careers.",
    icon: "scale-balance",
    memberCount: 1123,
    isJoined: true,
    category: "Wellness"
  }
];

const BLOG_POSTS = [
  {
    id: "1",
    author: {
      name: "Dr. Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      avatar: null
    },
    title: "Breaking the Glass Ceiling: My Journey in Tech Leadership",
    content: "After 8 years in the tech industry, I finally got the courage to apply for a leadership position. Here's what I learned about advocating for yourself and building confidence in male-dominated environments...",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    likes: 124,
    comments: 23,
    readTime: "5 min read",
    category: "Leadership",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    author: {
      name: "Maria Rodriguez",
      role: "Data Scientist",
      company: "Microsoft",
      avatar: null
    },
    title: "How I Built My First ML Model: A Beginner's Guide",
    content: "Starting with machine learning can be overwhelming. In this post, I share my step-by-step approach to building my first predictive model, including the mistakes I made and how to avoid them...",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop",
    likes: 89,
    comments: 15,
    readTime: "7 min read",
    category: "Machine Learning",
    timestamp: "5 hours ago"
  },
  {
    id: "3",
    author: {
      name: "Alex Johnson",
      role: "Product Manager",
      company: "Apple",
      avatar: null
    },
    title: "The Art of Saying No: Setting Boundaries in Tech",
    content: "As women in tech, we often feel pressured to take on extra work to prove ourselves. Here's how I learned to set healthy boundaries while still advancing my career...",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
    likes: 156,
    comments: 31,
    readTime: "4 min read",
    category: "Career Growth",
    timestamp: "1 day ago"
  },
  {
    id: "4",
    author: {
      name: "Priya Patel",
      role: "DevOps Engineer",
      company: "Amazon",
      avatar: null
    },
    title: "Cloud Computing for Beginners: My AWS Certification Journey",
    content: "Getting certified in AWS was one of the best decisions for my career. Here's my study plan, resources I used, and tips for passing the certification exam...",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    likes: 203,
    comments: 42,
    readTime: "6 min read",
    category: "Cloud Computing",
    timestamp: "2 days ago"
  },
  {
    id: "5",
    author: {
      name: "Emily Watson",
      role: "UX Designer",
      company: "Netflix",
      avatar: null
    },
    title: "Designing for Accessibility: Why It Matters",
    content: "Accessibility isn't just a nice-to-have—it's essential. Here's how I approach designing inclusive user experiences and why it's crucial for business success...",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    likes: 178,
    comments: 28,
    readTime: "8 min read",
    category: "UX Design",
    timestamp: "3 days ago"
  },
  {
    id: "6",
    author: {
      name: "Dr. Lisa Kim",
      role: "Research Scientist",
      company: "Stanford",
      avatar: null
    },
    title: "From Academia to Industry: Making the Transition",
    content: "After 10 years in academia, I made the leap to industry. Here's what I wish I knew before making the transition and how to prepare for the cultural shift...",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    likes: 145,
    comments: 19,
    readTime: "10 min read",
    category: "Career Transition",
    timestamp: "4 days ago"
  },
  {
    id: "7",
    author: {
      name: "Rachel Green",
      role: "Frontend Developer",
      company: "Spotify",
      avatar: null
    },
    title: "React vs Vue: My Experience with Both Frameworks",
    content: "After working with both React and Vue for major projects, here's my honest comparison of the two frameworks, including pros, cons, and when to choose each...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    likes: 267,
    comments: 56,
    readTime: "9 min read",
    category: "Web Development",
    timestamp: "5 days ago"
  },
  {
    id: "8",
    author: {
      name: "Sophie Turner",
      role: "Cybersecurity Analyst",
      company: "Cisco",
      avatar: null
    },
    title: "Women in Cybersecurity: Breaking Stereotypes",
    content: "Cybersecurity is often seen as a male-dominated field, but women are making incredible contributions. Here's how I found my place in this exciting industry...",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    likes: 198,
    comments: 34,
    readTime: "6 min read",
    category: "Cybersecurity",
    timestamp: "1 week ago"
  },
  {
    id: "9",
    author: {
      name: "Aisha Khan",
      role: "AI Engineer",
      company: "OpenAI",
      avatar: null
    },
    title: "The Future of AI: What Every Developer Should Know",
    content: "AI is transforming every industry. Here's my perspective on the most important trends and skills you need to stay relevant in the AI revolution...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    likes: 312,
    comments: 67,
    readTime: "12 min read",
    category: "Artificial Intelligence",
    timestamp: "1 week ago"
  },
  {
    id: "10",
    author: {
      name: "Nina Patel",
      role: "Technical Lead",
      company: "Meta",
      avatar: null
    },
    title: "Leading a Remote Engineering Team: Lessons Learned",
    content: "Managing a distributed team comes with unique challenges. Here are the strategies that helped me build a cohesive, productive remote engineering team...",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    likes: 234,
    comments: 45,
    readTime: "11 min read",
    category: "Leadership",
    timestamp: "1 week ago"
  }
];

const CHATS = [
  {
    id: "1",
    name: "Sarah Chen",
    lastMessage: "Thanks for the advice on the interview!",
    timestamp: "2 min ago",
    unreadCount: 0,
    avatar: null
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    lastMessage: "When is our next mentoring session?",
    timestamp: "1 hour ago",
    unreadCount: 1,
    avatar: null
  },
  {
    id: "3",
    name: "Alex Johnson",
    lastMessage: "Great meeting you at the conference!",
    timestamp: "3 hours ago",
    unreadCount: 0,
    avatar: null
  },
  {
    id: "4",
    name: "Priya Patel",
    lastMessage: "I'll send you the resources tomorrow",
    timestamp: "Yesterday",
    unreadCount: 2,
    avatar: null
  }
];

const CATEGORIES = ["All", "Career", "Support", "Advocacy", "Events", "Mentorship", "Leadership", "Wellness"];

export default function CommunitiesScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('communities');
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [communities, setCommunities] = useState(COMMUNITIES);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start();
  }, []);

  const filteredCommunities = selectedCategory === "All" 
    ? communities 
    : communities.filter(community => community.category === selectedCategory);

  const toggleJoin = (communityId: string) => {
    setCommunities(prev => 
      prev.map(community => 
        community.id === communityId 
          ? { ...community, isJoined: !community.isJoined }
          : community
      )
    );
  };

  const renderCommunityCard = ({ item }: { item: any }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity
        style={styles.cardContent}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('CommunityDetail', { community: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name={item.icon as any} size={28} color={COLORS.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.categoryContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.joinButton, item.isJoined && styles.joinedButton]}
            onPress={() => toggleJoin(item.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.joinButtonText, item.isJoined && styles.joinedButtonText]}>
              {item.isJoined ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.memberCount}>
            <Ionicons name="people" size={14} color={COLORS.textSecondary} />
            <Text style={styles.memberCountText}>{item.memberCount.toLocaleString()}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderBlogPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.blogCard} activeOpacity={0.9}>
      <View style={styles.blogImageContainer}>
        <View style={styles.blogImagePlaceholder}>
          <Feather name="image" size={32} color={COLORS.textSecondary} />
        </View>
        <View style={styles.blogCategoryBadge}>
          <Text style={styles.blogCategoryText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.blogContentContainer}>
        <View style={styles.blogHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Feather name="user" size={16} color={COLORS.white} />
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{item.author.name}</Text>
              <Text style={styles.authorRole}>{item.author.role} at {item.author.company}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.connectButton}>
            <Feather name="user-plus" size={14} color={COLORS.white} />
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogContentText}>{item.content}</Text>
        
        <View style={styles.blogFooter}>
          <View style={styles.blogStats}>
            <View style={styles.statItem}>
              <Feather name="heart" size={14} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="message-circle" size={14} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{item.comments}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="clock" size={14} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{item.readTime}</Text>
            </View>
          </View>
          <Text style={styles.blogTimestamp}>{item.timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChatCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatCard} activeOpacity={0.8}>
      <View style={styles.chatAvatar}>
        <Feather name="user" size={20} color={COLORS.white} />
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
      </View>
      <View style={styles.chatMeta}>
        <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryFilter,
              selectedCategory === item && styles.selectedCategoryFilter
            ]}
            onPress={() => setSelectedCategory(item)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.categoryFilterText,
              selectedCategory === item && styles.selectedCategoryFilterText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />
    </View>
  );

  const renderCommunitiesTab = () => (
    <View style={styles.tabContent}>
      {renderCategoryFilter()}
      <FlatList
        data={filteredCommunities}
        keyExtractor={item => item.id}
        renderItem={renderCommunityCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-group-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No communities found</Text>
            <Text style={styles.emptyText}>Try selecting a different category</Text>
          </View>
        }
      />
    </View>
  );

  const renderDiscoverTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.discoverHeader}>
        <Text style={styles.discoverTitle}>Discover Blogs</Text>
        <Text style={styles.discoverSubtitle}>Insights and stories from women in STEM</Text>
      </View>
      <FlatList
        data={BLOG_POSTS}
        keyExtractor={item => item.id}
        renderItem={renderBlogPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderChatsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.chatsHeader}>
        <Text style={styles.chatsTitle}>Direct Messages</Text>
        <Text style={styles.chatsSubtitle}>Your private conversations</Text>
      </View>
      <FlatList
        data={CHATS}
        keyExtractor={item => item.id}
        renderItem={renderChatCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'communities':
        return renderCommunitiesTab();
      case 'discover':
        return renderDiscoverTab();
      case 'chats':
        return renderChatsTab();
      default:
        return renderCommunitiesTab();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <BackButton />
          </View>
          <Text style={styles.headerTitle}>Channels</Text>
          <Text style={styles.headerSubtitle}>Connect with like-minded professionals</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'communities' && styles.activeTabButton]}
            onPress={() => setActiveTab('communities')}
            activeOpacity={0.8}
          >
            <Feather name="users" size={20} color={activeTab === 'communities' ? COLORS.white : COLORS.primary} />
            <Text style={[styles.tabButtonText, activeTab === 'communities' && styles.activeTabButtonText]}>
              Communities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'discover' && styles.activeTabButton]}
            onPress={() => setActiveTab('discover')}
            activeOpacity={0.8}
          >
            <Feather name="search" size={20} color={activeTab === 'discover' ? COLORS.white : COLORS.primary} />
            <Text style={[styles.tabButtonText, activeTab === 'discover' && styles.activeTabButtonText]}>
              Discover
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'chats' && styles.activeTabButton]}
            onPress={() => setActiveTab('chats')}
            activeOpacity={0.8}
          >
            <Feather name="message-circle" size={20} color={activeTab === 'chats' ? COLORS.white : COLORS.primary} />
            <Text style={[styles.tabButtonText, activeTab === 'chats' && styles.activeTabButtonText]}>
              Chats
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Create Community Button - Only show in Communities tab */}
        {activeTab === 'communities' && (
          <View style={styles.createButtonContainer}>
            <TouchableOpacity style={styles.createBtn} activeOpacity={0.9}>
              <Feather name="plus" size={24} color={COLORS.white} />
              <Text style={styles.createBtnText}>Create New Community</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: COLORS.white,
  },
  tabContent: {
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  selectedCategoryFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  selectedCategoryFilterText: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryBadge: {
    backgroundColor: `${COLORS.secondary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: COLORS.success,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: COLORS.white,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // User Discovery Styles
  discoverHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  discoverTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  discoverSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: `${COLORS.secondary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  interestText: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  userActions: {
    alignItems: 'flex-end',
  },
  mutualInterests: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  // Chats Styles
  chatsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textSecondary,
  },
  chatsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  chatsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  chatMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTimestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  createButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  // Blog Post Styles
  blogCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  blogImageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogCategoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  blogCategoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  blogContentContainer: {
    padding: 16,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  blogContentText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  blogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blogStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  blogTimestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
}); 