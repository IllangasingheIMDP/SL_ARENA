import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type UserProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserProfile'
>;

const UserProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
  });

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // TODO: Implement profile update logic here
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profileData.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#f4511e" />
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={profileData.name}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, name: text })
                    }
                    placeholder="Name"
                  />
                  <TextInput
                    style={styles.input}
                    value={profileData.phone}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, phone: text })
                    }
                    placeholder="Phone"
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    value={profileData.dateOfBirth}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, dateOfBirth: text })
                    }
                    placeholder="Date of Birth (YYYY-MM-DD)"
                  />
                </>
              ) : (
                <>
                  <Text style={styles.infoText}>Name: {profileData.name}</Text>
                  <Text style={styles.infoText}>Email: {profileData.email}</Text>
                  <Text style={styles.infoText}>
                    Phone: {profileData.phone || 'Not set'}
                  </Text>
                  <Text style={styles.infoText}>
                    Date of Birth: {profileData.dateOfBirth || 'Not set'}
                  </Text>
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <Text style={styles.buttonText}>
                {isEditing ? 'Save Profile' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f4511e',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    color: '#f4511e',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen; 