import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import {styles} from './style';

interface CustomToggleButtonProps {
  isActive: boolean;
  onPress: () => void;
  isLoading: boolean;
}

const CustomToggleButton: React.FC<CustomToggleButtonProps> = ({
  isActive,
  onPress,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive ? styles.buttonActive : styles.buttonInactive,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      testID="toggle-button"
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {!isActive && (
            <View>
              <Image
                source={require('../../assets/arrow_icon.png')}
                style={styles.arrowIcon}
                accessibilityLabel="Activate"
              />
            </View>
          )}
          <Text style={styles.buttonText}>
            {isActive ? 'Activated' : 'Activate'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomToggleButton;
