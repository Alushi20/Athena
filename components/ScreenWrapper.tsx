import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';
import BurgerMenu from './BurgerMenu';

interface ScreenWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  navigation: any;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  showBackButton = false,
  onBackPress,
  rightComponent,
  navigation,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Header
        onMenuPress={toggleMenu}
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        rightComponent={rightComponent}
      />
      <View style={styles.content}>
        {children}
      </View>
      <BurgerMenu
        navigation={navigation}
        isVisible={isMenuVisible}
        onToggle={toggleMenu}
      />
    </View>
  );
};

export default ScreenWrapper; 