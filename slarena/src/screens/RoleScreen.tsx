import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RoleScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoleScreen'
>;

interface RoleRequest {
  id: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const RoleScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [isInitialSelection, setIsInitialSelection] = useState(false);
  const { user, setSelectedRole, logout } = useAuth();
  const navigation = useNavigation<RoleScreenNavigationProp>();

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    try {
      setLoading(true);
      // Check if user has any roles
      if (user?.role && user.role.length > 0) {
        setCurrentRoles(user.role);
        setIsInitialSelection(false);
      } else {
        setIsInitialSelection(true);
      }
      
      // Load role requests - this is a placeholder since the service doesn't exist yet
      // In a real implementation, you would call an API to get role requests
      setRoleRequests([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: string) => {
    try {
      setLoading(true);
      const response = await userService.chooseRole(user?.id || '', role);
      if (response.data?.token) {
        setSelectedRole(role);
        await AsyncStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select role');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRole = (role: string) => {
    navigation.navigate('RoleRequestForm', { role });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const renderCurrentRoles = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Current Roles</Text>
      {currentRoles.length > 0 ? (
        currentRoles.map((role, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.roleButton} 
            onPress={() => handleRoleSelect(role)}
          >
            <Text style={styles.roleText}>{role}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>You don't have any roles yet</Text>
      )}
    </View>
  );

  const renderRoleRequests = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Role Requests</Text>
      {roleRequests.length > 0 ? (
        roleRequests.map((request) => (
          <View key={request.id} style={styles.requestItem}>
            <Text style={styles.requestRole}>{request.role}</Text>
            <Text style={[
              styles.requestStatus, 
              request.status === 'approved' ? styles.approved : 
              request.status === 'rejected' ? styles.rejected : styles.pending
            ]}>
              {request.status}
            </Text>
            <Text style={styles.requestDate}>
              {new Date(request.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No pending role requests</Text>
      )}
    </View>
  );

  const renderAvailableRoles = () => {
    // Define all possible roles
    const allRoles = [
      { id: 'player', title: 'Player', description: 'Join tournaments and track your progress' },
      { id: 'organization', title: 'Organization', description: 'Create and manage tournaments' },
      { id: 'trainer', title: 'Trainer', description: 'Coach players and improve their skills' }
    ];
    
    // Filter out roles that the user already has
    const availableRoles = allRoles.filter(role => !currentRoles.includes(role.id));
    
    // If there are no available roles to request, show a message
    if (availableRoles.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isInitialSelection ? 'Select Your Role' : 'Available Roles'}
          </Text>
          <Text style={styles.emptyText}>You already have all available roles</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isInitialSelection ? 'Select Your Role' : 'Request Additional Roles'}
        </Text>
        <View style={styles.roleGrid}>
          {availableRoles.map((role) => (
            <TouchableOpacity 
              key={role.id}
              style={styles.roleCard} 
              onPress={() => isInitialSelection ? handleRoleSelect(role.id) : handleRequestRole(role.id)}
            >
              <Text style={styles.roleCardTitle}>{role.title}</Text>
              <Text style={styles.roleCardDescription}>{role.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Role Management</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="#FFD700" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000080" />
        </View>
      ) : (
        <>
          {!isInitialSelection && renderCurrentRoles()}
          {renderAvailableRoles()}
          {!isInitialSelection && renderRoleRequests()}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  section: {
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080', // Navy blue
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700', // Gold
    paddingBottom: 8,
  },
  roleButton: {
    backgroundColor: '#000080', // Navy blue
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  roleText: {
    color: '#FFD700', // Gold
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#5f6368',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  roleCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000080', // Navy blue
  },
  roleCardDescription: {
    fontSize: 12,
    color: '#5f6368',
  },
  requestItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  requestRole: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000080', // Navy blue
  },
  requestStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  pending: {
    color: '#f39c12',
  },
  approved: {
    color: '#27ae60',
  },
  rejected: {
    color: '#e74c3c',
  },
  requestDate: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 5,
  },
  header: {
    backgroundColor: '#000080',
    padding: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default RoleScreen; 