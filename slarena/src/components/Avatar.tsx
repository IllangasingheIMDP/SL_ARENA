import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';

interface AvatarProps {
  name: string;
  size?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 100,
  onPress,
  style,
}) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  // Generate a consistent animal avatar based on the user's name
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/png?seed=${name}&size=${size * 2}`;

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={[styles.image, containerStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
});

export default Avatar; 