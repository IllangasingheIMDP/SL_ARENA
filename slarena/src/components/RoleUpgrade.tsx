import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface RoleOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RoleUpgradeProps {
  onSelectRole: (role: string) => void;
}

const AVAILABLE_ROLES: RoleOption[] = [
  {
    id: 'player',
    title: 'Player',
    description: 'Join tournaments and track your progress',
    icon: '🏃',
  },
  {
    id: 'organizer',
    title: 'Organizer',
    description: 'Create and manage tournaments',
    icon: '🎯',
  },
  {
    id: 'trainer',
    title: 'Trainer',
    description: 'Coach players and share your expertise',
    icon: '👨‍🏫',
  },
];

const RoleUpgrade: React.FC<RoleUpgradeProps> = ({ onSelectRole }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade Your Role</Text>
      <Text style={styles.subtitle}>
        Choose a role to unlock more features
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rolesContainer}
      >
        {AVAILABLE_ROLES.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={styles.roleCard}
            onPress={() => onSelectRole(role.id)}
          >
            <Text style={styles.roleIcon}>{role.icon}</Text>
            <Text style={styles.roleTitle}>{role.title}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  rolesContainer: {
    paddingVertical: 10,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleIcon: {
    fontSize: 30,
    marginBottom: 10,
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
});

export default RoleUpgrade; 