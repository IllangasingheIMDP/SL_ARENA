import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import userService from '../services/userService';

type RoleSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoleSelection'
>;

const RoleSelectionScreen = () => {
  const { user, setSelectedRole } = useAuth();
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role: string) => {
    if (!user || !user.id) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    try {
      setLoading(true);
      
      // Call the backend API to update the user's selected role
      const response = await userService.chooseRole(user.id, role);
      
      if (response.status === "success") {
        console.log('Selected token:', response.data.token);
        // Set the selected role in the context
        // The AppNavigator will handle the navigation automatically based on the selected role
        await AsyncStorage.setItem('token', response.data.token);
        setSelectedRole(role);
      } else {
        Alert.alert('Error', response.message || 'Failed to select role');
      }
    } catch (error) {
      console.error('Error selecting role:', error);
      Alert.alert('Error', 'An error occurred while selecting your role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.subtitle}>Select your role to continue</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f4511e" />
          <Text style={styles.loadingText}>Selecting role...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {user?.role && user.role.length > 0 ? (
            user.role.map((role, index) => (
              <TouchableOpacity
                key={index}
                style={styles.roleCard}
                onPress={() => handleRoleSelect(role)}
              >
                <View style={styles.roleIconContainer}>
                  <Text style={styles.roleIcon}>
                    {role.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.roleInfo}>
                  <Text style={styles.roleTitle}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                  <Text style={styles.roleDescription}>
                    Access your {role.toLowerCase()} dashboard
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noRolesContainer}>
              <Text style={styles.noRolesText}>
                No roles assigned. Please contact support.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f4511e',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  roleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  roleIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
  },
  noRolesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noRolesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default RoleSelectionScreen; 