import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { userService } from '../../services/userService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type User = {
  user_id: number;
  name: string;
  email: string;
  current_role: string;
  requested_roles: string[];
};

const RoleManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsersWithRoles();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      await userService.updateUserRole(userId, newRole);
      Alert.alert('Success', 'User role updated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update user role. Please try again.');
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.currentRole}>Current Role: {item.current_role}</Text>
      </View>
      <View style={styles.roleActions}>
        {item.requested_roles.map((role, index) => (
          <TouchableOpacity
            key={index}
            style={styles.roleButton}
            onPress={() => handleUpdateRole(item.user_id, role)}
          >
            <Text style={styles.roleButtonText}>Approve {role}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Role Management</Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.user_id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  userItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentRole: {
    fontSize: 14,
    color: '#666',
  },
  roleActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RoleManagementScreen; 