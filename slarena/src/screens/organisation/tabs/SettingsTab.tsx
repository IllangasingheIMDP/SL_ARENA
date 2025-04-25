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
      onPress: () => navigation.navigate("RoleManagement"),
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

  const handleSwitchRole = () => {
    setSelectedRole(null);
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

      <TouchableOpacity
        style={styles.switchRoleButton}
        onPress={handleSwitchRole}
      >
        <Text style={styles.switchRoleButtonText}>Manage Roles</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#f44336",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  switchRoleButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  switchRoleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SettingsTab;
