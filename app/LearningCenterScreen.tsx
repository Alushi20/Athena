import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Animated, TextInput } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

const TRACKS = [
  {
    id: 'confidence',
    title: 'Confidence Bootcamp',
    description: 'Build your confidence in STEM with these quick lessons.',
    contents: [
      { id: 'vid1', type: 'video', title: 'How to Speak Up in Meetings', duration: '3:12' },
      { id: 'art1', type: 'article', title: 'Overcoming Self-Doubt', duration: '2 min read' },
      { id: 'vid2', type: 'video', title: 'Presenting Your Ideas with Confidence', duration: '4:30' },
      { id: 'art2', type: 'article', title: 'Building Self-Esteem in Tech', duration: '3 min read' },
      { id: 'vid3', type: 'video', title: 'Networking with Confidence', duration: '5:15' },
    ]
  },
  {
    id: 'bias',
    title: 'Bias Survival Guide',
    description: 'Learn to recognize and respond to bias in the workplace.',
    contents: [
      { id: 'vid4', type: 'video', title: 'Handling Biased Comments', duration: '4:01' },
      { id: 'art3', type: 'article', title: 'Your Rights at Work', duration: '3 min read' },
      { id: 'vid5', type: 'video', title: 'Responding to Microaggressions', duration: '6:20' },
      { id: 'art4', type: 'article', title: 'Documenting Workplace Incidents', duration: '4 min read' },
      { id: 'vid6', type: 'video', title: 'Building Allies in the Workplace', duration: '7:45' },
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership Development',
    description: 'Develop essential leadership skills for tech professionals.',
    contents: [
      { id: 'vid7', type: 'video', title: 'Leading Technical Teams', duration: '8:30' },
      { id: 'art5', type: 'article', title: 'The Art of Delegation', duration: '5 min read' },
      { id: 'vid8', type: 'video', title: 'Giving Constructive Feedback', duration: '6:15' },
      { id: 'art6', type: 'article', title: 'Mentoring Others Effectively', duration: '4 min read' },
      { id: 'vid9', type: 'video', title: 'Managing Conflict in Teams', duration: '9:20' },
      { id: 'art7', type: 'article', title: 'Building Trust as a Leader', duration: '3 min read' },
    ]
  },
  {
    id: 'negotiation',
    title: 'Salary Negotiation Mastery',
    description: 'Master the art of negotiating your worth in tech.',
    contents: [
      { id: 'vid10', type: 'video', title: 'Researching Market Salaries', duration: '4:45' },
      { id: 'art8', type: 'article', title: 'Preparing Your Negotiation Script', duration: '6 min read' },
      { id: 'vid11', type: 'video', title: 'Role-Playing Negotiation Scenarios', duration: '12:30' },
      { id: 'art9', type: 'article', title: 'Handling Counter-Offers', duration: '4 min read' },
      { id: 'vid12', type: 'video', title: 'Negotiating Benefits and Perks', duration: '7:15' },
    ]
  },
  {
    id: 'technical',
    title: 'Technical Skills Enhancement',
    description: 'Stay current with the latest technical skills and trends.',
    contents: [
      { id: 'vid13', type: 'video', title: 'Introduction to Machine Learning', duration: '15:20' },
      { id: 'art10', type: 'article', title: 'Getting Started with AI/ML', duration: '8 min read' },
      { id: 'vid14', type: 'video', title: 'Cloud Computing Fundamentals', duration: '12:45' },
      { id: 'art11', type: 'article', title: 'DevOps Best Practices', duration: '6 min read' },
      { id: 'vid15', type: 'video', title: 'Cybersecurity Essentials', duration: '18:30' },
      { id: 'art12', type: 'article', title: 'Data Science for Beginners', duration: '7 min read' },
    ]
  },
  {
    id: 'communication',
    title: 'Communication Excellence',
    description: 'Master communication skills essential for tech professionals.',
    contents: [
      { id: 'vid16', type: 'video', title: 'Writing Clear Technical Documentation', duration: '8:15' },
      { id: 'art13', type: 'article', title: 'Effective Email Communication', duration: '4 min read' },
      { id: 'vid17', type: 'video', title: 'Presenting Technical Concepts', duration: '10:30' },
      { id: 'art14', type: 'article', title: 'Storytelling in Tech', duration: '5 min read' },
      { id: 'vid18', type: 'video', title: 'Cross-Cultural Communication', duration: '11:45' },
    ]
  },
  {
    id: 'career',
    title: 'Career Advancement',
    description: 'Strategies for advancing your career in STEM.',
    contents: [
      { id: 'vid19', type: 'video', title: 'Building Your Personal Brand', duration: '9:20' },
      { id: 'art15', type: 'article', title: 'Creating a Career Development Plan', duration: '6 min read' },
      { id: 'vid20', type: 'video', title: 'Networking for Introverts', duration: '7:45' },
      { id: 'art16', type: 'article', title: 'Switching Careers in Tech', duration: '8 min read' },
      { id: 'vid21', type: 'video', title: 'Building a Portfolio Project', duration: '14:30' },
      { id: 'art17', type: 'article', title: 'Contributing to Open Source', duration: '5 min read' },
    ]
  },
  {
    id: 'wellness',
    title: 'Work-Life Balance',
    description: 'Maintain your well-being while excelling in tech.',
    contents: [
      { id: 'vid22', type: 'video', title: 'Managing Stress in Tech', duration: '6:30' },
      { id: 'art18', type: 'article', title: 'Setting Healthy Boundaries', duration: '4 min read' },
      { id: 'vid23', type: 'video', title: 'Mindfulness for Developers', duration: '8:15' },
      { id: 'art19', type: 'article', title: 'Preventing Burnout', duration: '5 min read' },
      { id: 'vid24', type: 'video', title: 'Physical Health for Tech Workers', duration: '12:45' },
      { id: 'art20', type: 'article', title: 'Mental Health Resources', duration: '3 min read' },
    ]
  },
  {
    id: 'innovation',
    title: 'Innovation & Creativity',
    description: 'Foster creativity and innovation in your technical work.',
    contents: [
      { id: 'vid25', type: 'video', title: 'Design Thinking in Tech', duration: '13:20' },
      { id: 'art21', type: 'article', title: 'Creative Problem Solving', duration: '6 min read' },
      { id: 'vid26', type: 'video', title: 'User-Centered Design', duration: '11:15' },
      { id: 'art22', type: 'article', title: 'Innovation Frameworks', duration: '7 min read' },
      { id: 'vid27', type: 'video', title: 'Prototyping and Testing', duration: '16:30' },
    ]
  },
  {
    id: 'diversity',
    title: 'Diversity & Inclusion',
    description: 'Learn about creating inclusive tech environments.',
    contents: [
      { id: 'vid28', type: 'video', title: 'Understanding Unconscious Bias', duration: '9:45' },
      { id: 'art23', type: 'article', title: 'Inclusive Hiring Practices', duration: '5 min read' },
      { id: 'vid29', type: 'video', title: 'Building Inclusive Teams', duration: '12:20' },
      { id: 'art24', type: 'article', title: 'Allyship in Tech', duration: '6 min read' },
      { id: 'vid30', type: 'video', title: 'Creating Safe Spaces', duration: '8:15' },
      { id: 'art25', type: 'article', title: 'Diversity Metrics and Goals', duration: '4 min read' },
    ]
  },
  {
    id: 'entrepreneurship',
    title: 'Tech Entrepreneurship',
    description: 'Start your journey as a tech entrepreneur.',
    contents: [
      { id: 'vid31', type: 'video', title: 'Ideation and Validation', duration: '14:30' },
      { id: 'art26', type: 'article', title: 'Building an MVP', duration: '7 min read' },
      { id: 'vid32', type: 'video', title: 'Pitching Your Tech Idea', duration: '10:45' },
      { id: 'art27', type: 'article', title: 'Funding Strategies for Women', duration: '8 min read' },
      { id: 'vid33', type: 'video', title: 'Scaling Your Tech Startup', duration: '18:20' },
      { id: 'art28', type: 'article', title: 'Legal Basics for Founders', duration: '6 min read' },
    ]
  },
  {
    id: 'public-speaking',
    title: 'Public Speaking for Tech',
    description: 'Master the art of public speaking in technical contexts.',
    contents: [
      { id: 'vid34', type: 'video', title: 'Overcoming Stage Fright', duration: '7:30' },
      { id: 'art29', type: 'article', title: 'Structuring Technical Talks', duration: '5 min read' },
      { id: 'vid35', type: 'video', title: 'Using Visual Aids Effectively', duration: '9:15' },
      { id: 'art30', type: 'article', title: 'Handling Q&A Sessions', duration: '4 min read' },
      { id: 'vid36', type: 'video', title: 'Conference Speaking Tips', duration: '11:45' },
      { id: 'art31', type: 'article', title: 'Building Speaking Confidence', duration: '6 min read' },
    ]
  },
];

const REFLECTION_PROMPT = 'What is one thing you can apply from this lesson to your daily life?';

const LearningCenterScreen: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, 800);
  }, []);

  const handleReflectionSubmit = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
    setReflection('');
    setSelectedContent(null);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }
  return (
    <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }] }>
      <Text style={styles.title}>Learning Center</Text>
      {TRACKS.map(track => (
        <View key={track.id} style={styles.trackSection}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <Text style={styles.trackDesc}>{track.description}</Text>
          <FlatList
            data={track.contents}
            horizontal
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Animated.View style={styles.contentCard}>
                <Feather name={item.type === 'video' ? 'play-circle' : 'file-text'} size={28} color={COLORS.primary} />
                <Text style={styles.contentTitle}>{item.title}</Text>
                <Text style={styles.contentType}>{item.type === 'video' ? 'Video' : 'Article'} • {item.duration}</Text>
                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={() => setSelectedContent(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startBtnText}>Start</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>
      ))}
      {selectedContent && (
        <View style={styles.reflectionBox}>
          <Text style={styles.reflectionPrompt}>{REFLECTION_PROMPT}</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your reflection..."
            value={reflection}
            onChangeText={setReflection}
            multiline
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleReflectionSubmit} activeOpacity={0.85}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedContent(null)}>
            <Feather name="x" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}
      {success && (
        <View style={styles.successBox}>
          <Feather name="check-circle" size={18} color={COLORS.success} />
          <Text style={styles.successText}>Reflection saved!</Text>
        </View>
      )}
    </Animated.ScrollView>
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
  trackSection: {
    marginBottom: 28,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  trackDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 14,
    width: 200,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  contentType: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 6,
  },
  startBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  reflectionBox: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    padding: 18,
    marginTop: 18,
    position: 'relative',
  },
  reflectionPrompt: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 10,
    minHeight: 40,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
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

export default LearningCenterScreen; 