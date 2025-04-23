import React, { useState } from 'react';
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
import Avatar from '../../components/Avatar';
import RoleUpgrade from '../../components/RoleUpgrade';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import userService from '../../services/userService';

const UserProfileScreen = () => {
  const { user, setSelectedRole, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      if (user) {
        const updatedUser = { ...user, name: profileData.name };
        setUser(updatedUser);
      }
      await userService.updateProfile(user?.id || '', {
        name: profileData.name,
      });
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: string) => {
    try {
      setLoading(true);
      if (!user?.id) {
        Alert.alert('Error', 'User information not available');
        return;
      }

      const response = await userService.chooseRole(user.id, role);
      if (response.status === 'success') {
        setSelectedRole(role);
        Alert.alert('Success', 'Role updated successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to update role');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchRole = () => {
    setSelectedRole(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f4511e" />
        </View>
      )}

      <View style={styles.header}>
        <Avatar
          name={profileData.name}
          size={120}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.role}>General User</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, name: text })
                }
                placeholder="Your name"
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{profileData.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{profileData.email}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Security Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <TouchableOpacity
            style={styles.securityButton}
            onPress={() => setShowPasswordModal(true)}
          >
            <Text style={styles.securityButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Role Upgrade Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Role Management</Text>
          <RoleUpgrade onSelectRole={handleRoleSelect} />
        </View>

        {/* Account Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Options</Text>
          <TouchableOpacity
            style={[styles.accountButton, styles.switchRoleButton]}
            onPress={handleSwitchRole}
          >
            <Text style={styles.accountButtonText}>Switch Role</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.accountButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.accountButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PasswordChangeModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  header: {
    backgroundColor: '#f4511e',
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    marginTop: -20,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  infoRow: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f4511e',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  securityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  accountButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  accountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchRoleButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
});

export default UserProfileScreen; 