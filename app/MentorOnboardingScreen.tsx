import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { account } from '../lib/appwrite';

const MENTOR_QUESTIONS = {
  missionMatch: {
    question: "What type of transformation do you enjoy guiding most?",
    options: ["Helping others find their path", "Empowering confidence and identity", "Teaching technical excellence", "Navigating gender/stress barriers", "Accelerating leadership & influence", "Supporting passion projects & startups"]
  },
  stageAlignment: {
    question: "Which stage of a mentee’s journey do you connect with best?",
    options: ["High school: discovering interests", "University: building foundation", "Early-career: real-world growth", "Career transitioners", "Startup builders/founders", "Any stage—I adapt"]
  },
  energySync: {
    question: "How would you describe your mentorship style?",
    options: ["Structured with clear steps", "Flexible, based on the mentee", "Deep conversations and reflection", "Motivation and mindset focused", "Fast-paced and practical"]
  },
  commitmentVibe: {
    question: "What’s your availability for mentoring?",
    options: ["Weekly check-ins", "Twice a month", "Once a month", "On-demand guidance when needed", "Group or community mentorship only"]
  },
  valuesChemistry: {
    question: "Which values guide your mentorship style? (Choose up to 3)",
    options: ["Empathy", "Direct honesty", "Inclusivity", "Accountability", "Creativity", "Patience", "Ambition"],
    multiSelect: 3
  }
};

const MentorOnboardingScreen = ({ navigation }: any) => {
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSelect = (key: string, value: string, multiSelect?: number) => {
    setAnswers((prev: any) => {
      if (multiSelect) {
        const current = prev[key] || [];
        const updated = current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value];
        return { ...prev, [key]: updated.slice(0, multiSelect) };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const user = await account.get();
        await account.updatePrefs({ ...user.prefs, ...answers });
        Alert.alert('Success', 'Your mentor profile is complete!');
        navigation.replace('Main');
    } catch (error: any) {
        Alert.alert('Error', error.message || 'Could not save your answers.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mentor Onboarding</Text>
      {Object.entries(MENTOR_QUESTIONS).map(([key, q]) => (
        <View key={key} style={styles.questionBox}>
          <Text style={styles.question}>{q.question}</Text>
          <View style={styles.optionsContainer}>
            {q.options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.option, (answers[key] || []).includes(opt) && styles.optionSelected]}
                onPress={() => handleSelect(key, opt, q.multiSelect)}
              >
                <Text style={[styles.optionText, (answers[key] || []).includes(opt) && styles.optionTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Complete Profile</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 18,
    },
    questionBox: {
        marginBottom: 24,
    },
    question: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    option: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    optionSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    optionText: {
        color: COLORS.text,
        fontSize: 15,
    },
    optionTextSelected: {
        color: COLORS.white,
    },
    submitBtn: {
        backgroundColor: COLORS.secondary,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 18,
    },
    submitBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 17,
    },
});

export default MentorOnboardingScreen; 