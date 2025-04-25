import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SettingsItem from "../../../components/organisation/SettingsItem";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsTab = () => {
  const { logout, setSelectedRole } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const settingsOptions = [
    {
      id: "1",
      title: "Role Management",
      icon: "admin-panel-settings",
      description: "Manage user roles and permissions",
      onPress: () => {
        setSelectedRole(null);
        navigation.navigate("RoleManagement");
      },
    },
    {
      id: "2",
      title: "Profile Settings",
      icon: "person",
      description: "Update organization profile information",
      onPress: () => console.log("Navigate to profile settings"),
    },
    {
      id: "3",
      title: "Team Management",
      icon: "groups",
      description: "Manage teams and players",
      onPress: () => console.log("Navigate to team management"),
    },
    {
      id: "4",
      title: "Help & Support",
      icon: "help",
      description: "Get help and contact support",
      onPress: () => console.log("Navigate to help and support"),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderSettingsItem = ({ item }: { item: any }) => (
    <SettingsItem
      title={item.title}
      description={item.description}
      icon={item.icon}
      onPress={item.onPress}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tabTitle}>Settings</Text>
      <FlatList
        data={settingsOptions}
        renderItem={renderSettingsItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#FFD700" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  tabTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    paddingBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#000080',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default SettingsTab;
