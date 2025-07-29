import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Colors';

interface BackButtonProps {
  onPress?: () => void;
  style?: any;
  color?: string;
  size?: number;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  style, 
  color = COLORS.text, 
  size = 24 
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.backButton, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Feather name="arrow-left" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default BackButton; 