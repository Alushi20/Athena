import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onMenuPress: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    header: {
      position: 'absolute',
      top: 0,
      left: 25,
      right: 0,
      zIndex: 100,
      paddingTop: 15,
      paddingHorizontal: 30,
      paddingBottom: 10,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBackButton && onBackPress ? (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={onMenuPress}
              activeOpacity={0.7}
            >
              <Feather name="menu" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        {rightComponent && (
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header; 