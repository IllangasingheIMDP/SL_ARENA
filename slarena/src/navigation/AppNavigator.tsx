import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens (to be created)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/general/HomeScreen';
import ProfileScreen from '../screens/general/ProfileScreen';
import DiscoverScreen from '../screens/general/DiscoverScreen';
import NotificationsScreen from '../screens/general/NotificationsScreen';
import SettingsScreen from '../screens/general/SettingsScreen';

// Player screens
import PlayerDashboardScreen from '../screens/player/DashboardScreen';
import MatchDiscoveryScreen from '../screens/player/MatchDiscoveryScreen';
import TeamScreen from '../screens/player/TeamScreen';
import PerformanceAnalyticsScreen from '../screens/player/PerformanceAnalyticsScreen';
import TrainingScreen from '../screens/player/TrainingScreen';
import VideoAnalysisScreen from '../screens/player/VideoAnalysisScreen';
import LeaderboardsScreen from '../screens/player/LeaderboardsScreen';

// Organizer screens
import OrganizerDashboardScreen from '../screens/organizer/DashboardScreen';
import CreateMatchScreen from '../screens/organizer/CreateMatchScreen';
import ManageMatchesScreen from '../screens/organizer/ManageMatchesScreen';
import MatchScoringScreen from '../screens/organizer/MatchScoringScreen';
import VenueManagementScreen from '../screens/organizer/VenueManagementScreen';
import TournamentAnalyticsScreen from '../screens/organizer/TournamentAnalyticsScreen';

// Admin screens
import AdminDashboardScreen from '../screens/admin/DashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import MatchManagementScreen from '../screens/admin/MatchManagementScreen';
import AnalyticsScreen from '../screens/admin/AnalyticsScreen';
import NotificationsManagementScreen from '../screens/admin/NotificationsManagementScreen';
import SettingsManagementScreen from '../screens/admin/SettingsManagementScreen';

// Import types
import { RootStackParamList, GeneralUserTabParamList } from './types';

// Define navigation types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type PlayerTabParamList = {
  Dashboard: undefined;
  MatchDiscovery: undefined;
  Team: undefined;
  PerformanceAnalytics: undefined;
  Training: undefined;
  VideoAnalysis: undefined;
  Leaderboards: undefined;
};

export type OrganizerTabParamList = {
  Dashboard: undefined;
  CreateMatch: undefined;
  ManageMatches: undefined;
  MatchScoring: undefined;
  VenueManagement: undefined;
  TournamentAnalytics: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  UserManagement: undefined;
  MatchManagement: undefined;
  Analytics: undefined;
  NotificationsManagement: undefined;
  SettingsManagement: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<GeneralUserTabParamList>();
const PlayerTab = createBottomTabNavigator<PlayerTabParamList>();
const OrganizerTab = createBottomTabNavigator<OrganizerTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// General User Tab Navigator
const GeneralUserTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Player Navigator
const PlayerNavigator = () => {
  const theme = useTheme();
  
  return (
    <PlayerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
      }}
    >
      <PlayerTab.Screen 
        name="Dashboard" 
        component={PlayerDashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <PlayerTab.Screen 
        name="MatchDiscovery" 
        component={MatchDiscoveryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="compass" color={color} size={size} />
          ),
        }}
      />
      <PlayerTab.Screen 
        name="Team" 
        component={TeamScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" color={color} size={size} />
          ),
        }}
      />
      <PlayerTab.Screen 
        name="PerformanceAnalytics" 
        component={PerformanceAnalyticsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <PlayerTab.Screen 
        name="Training" 
        component={TrainingScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dumbbell" color={color} size={size} />
          ),
        }}
      />
      <PlayerTab.Screen 
        name="VideoAnalysis" 
        component={VideoAnalysisScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="video" color={color} size={size} />
          ),
        }}
      />
      <PlayerTab.Screen 
        name="Leaderboards" 
        component={LeaderboardsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy" color={color} size={size} />
          ),
        }}
      />
    </PlayerTab.Navigator>
  );
};

// Organizer Navigator
const OrganizerNavigator = () => {
  const theme = useTheme();
  
  return (
    <OrganizerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
      }}
    >
      <OrganizerTab.Screen 
        name="Dashboard" 
        component={OrganizerDashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <OrganizerTab.Screen 
        name="CreateMatch" 
        component={CreateMatchScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" color={color} size={size} />
          ),
        }}
      />
      <OrganizerTab.Screen 
        name="ManageMatches" 
        component={ManageMatchesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" color={color} size={size} />
          ),
        }}
      />
      <OrganizerTab.Screen 
        name="MatchScoring" 
        component={MatchScoringScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="scoreboard" color={color} size={size} />
          ),
        }}
      />
      <OrganizerTab.Screen 
        name="VenueManagement" 
        component={VenueManagementScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <OrganizerTab.Screen 
        name="TournamentAnalytics" 
        component={TournamentAnalyticsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" color={color} size={size} />
          ),
        }}
      />
    </OrganizerTab.Navigator>
  );
};

// Admin Navigator
const AdminNavigator = () => {
  const theme = useTheme();
  
  return (
    <AdminTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
      }}
    >
      <AdminTab.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen 
        name="UserManagement" 
        component={UserManagementScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-cog" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen 
        name="MatchManagement" 
        component={MatchManagementScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen 
        name="NotificationsManagement" 
        component={NotificationsManagementScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bell-ring" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen 
        name="SettingsManagement" 
        component={SettingsManagementScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </AdminTab.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  // This would come from your authentication state
  const userRole = 'GeneralUser'; // 'GeneralUser', 'Player', 'Organizer', 'Admin'
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            {userRole === 'GeneralUser' && (
              <Stack.Screen name="Home" component={GeneralUserTabNavigator} />
            )}
            {userRole === 'Player' && (
              <Stack.Screen name="Player" component={PlayerNavigator} />
            )}
            {userRole === 'Organizer' && (
              <Stack.Screen name="Organizer" component={OrganizerNavigator} />
            )}
            {userRole === 'Admin' && (
              <Stack.Screen name="Admin" component={AdminNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 