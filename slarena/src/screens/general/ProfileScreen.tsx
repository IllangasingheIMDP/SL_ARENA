import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Surface, TextInput, IconButton, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/theme';
import apiService from '../../services/apiService';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profileImage: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editedProfile, setEditedProfile] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Mock profile data - replace with actual API call
      const mockProfile: ProfileData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+94 77 123 4567',
        location: 'Colombo, Sri Lanka',
        bio: 'Cricket enthusiast and avid follower of local tournaments.',
        profileImage: 'https://example.com/profile.jpg',
      };
      setProfile(mockProfile);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (profile) {
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      // Mock API call - replace with actual API call
      if (profile) {
        setProfile({ ...profile, ...editedProfile });
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const handleTextChange = (field: keyof ProfileData) => (text: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: text,
    }));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Profile</Text>
          <IconButton
            icon={isEditing ? 'check' : 'pencil'}
            size={24}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          />
        </View>

        <View style={styles.form}>
          <TextInput
            label="Name"
            value={profile.name}
            onChangeText={handleTextChange('name')}
            disabled={!isEditing}
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={profile.email}
            onChangeText={handleTextChange('email')}
            disabled={!isEditing}
            style={styles.input}
          />
          <TextInput
            label="Phone"
            value={profile.phone}
            onChangeText={handleTextChange('phone')}
            disabled={!isEditing}
            style={styles.input}
          />
          <TextInput
            label="Location"
            value={profile.location}
            onChangeText={handleTextChange('location')}
            disabled={!isEditing}
            style={styles.input}
          />
          <TextInput
            label="Bio"
            value={profile.bio}
            onChangeText={handleTextChange('bio')}
            multiline
            numberOfLines={4}
            disabled={!isEditing}
            style={styles.input}
          />
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
});

export default ProfileScreen; 