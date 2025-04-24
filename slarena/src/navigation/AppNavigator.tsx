import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RoleScreen from '../screens/RoleScreen';
import GeneralDashboard from '../screens/user/GeneralDashboard';
import PlayerDashboard from '../screens/player/PlayerDashboard';
import PlayerProfileScreen from '../screens/player/PlayerProfileScreen';
import OrganisationDashboard from '../screens/organisation/OrganisationDashboard';
import TrainerDashboard from '../screens/trainer/TrainerDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import { ActivityIndicator, View } from 'react-native';
import RoleRequestForm from '../screens/RoleRequestForm';
import NotificationScreen from '../screens/NotificationScreen';
import Navbar from '../components/common/Navbar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Route } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RoleScreen: undefined;
  GeneralDashboard: undefined;
  PlayerDashboard: undefined;
  PlayerProfile: undefined;
  OrganisationDashboard: undefined;
  TrainerDashboard: undefined;
  AdminDashboard: undefined;
  UserProfile: undefined;
  RoleRequestForm: { role: string };
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface CustomHeaderProps {
  route: Route<string>;
  navigation: any; // Using any for now to bypass the type error
  options: {
    title?: string;
    headerBackVisible?: boolean;
  };
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ route, navigation, options }) => {
  return (
    <Navbar 
      title={options.title} 
      showBackButton={options.headerBackVisible} 
      showNotification={route.name !== 'Notifications'}
    />
  );
};

const AppNavigator = () => {
  const { user, loading, selectedRole } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          header: (props) => <CustomHeader {...props} />,
        }}
      >
        {user ? (
          // If a role is selected, navigate to the appropriate dashboard
          selectedRole ? (
            (() => {
              const role = selectedRole.toLowerCase();
              switch (role) {
                case 'player':
                  return (
                    <>
                      <Stack.Screen
                        name="PlayerDashboard"
                        component={PlayerDashboard}
                        options={{
                          title: 'Player Dashboard',
                          headerBackVisible: false,
                        }}
                      />
                      <Stack.Screen
                        name="PlayerProfile"
                        component={PlayerProfileScreen}
                        options={{
                          title: 'Player Profile',
                        }}
                      />
                      <Stack.Screen
                        name="Notifications"
                        component={NotificationScreen}
                        options={{
                          title: 'Notifications',
                        }}
                      />
                    </>
                  );
                case 'organisation':
                  return (
                    <>
                      <Stack.Screen
                        name="OrganisationDashboard"
                        component={OrganisationDashboard}
                        options={{
                          title: 'Organisation Dashboard',
                          headerBackVisible: false,
                        }}
                      />
                      <Stack.Screen
                        name="Notifications"
                        component={NotificationScreen}
                        options={{
                          title: 'Notifications',
                        }}
                      />
                    </>
                  );
                case 'trainer':
                  return (
                    <>
                      <Stack.Screen
                        name="TrainerDashboard"
                        component={TrainerDashboard}
                        options={{
                          title: 'Trainer Dashboard',
                          headerBackVisible: false,
                        }}
                      />
                      <Stack.Screen
                        name="Notifications"
                        component={NotificationScreen}
                        options={{
                          title: 'Notifications',
                        }}
                      />
                    </>
                  );
                case 'admin':
                  return (
                    <>
                      <Stack.Screen
                        name="AdminDashboard"
                        component={AdminDashboard}
                        options={{
                          title: 'Admin Dashboard',
                          headerBackVisible: false,
                        }}
                      />
                      <Stack.Screen
                        name="Notifications"
                        component={NotificationScreen}
                        options={{
                          title: 'Notifications',
                        }}
                      />
                    </>
                  );
                default:
                  return (
                    <>
                      <Stack.Screen
                        name="GeneralDashboard"
                        component={GeneralDashboard}
                        options={{
                          title: 'Dashboard',
                          headerBackVisible: false,
                        }}
                      />
                      <Stack.Screen
                        name="UserProfile"
                        component={UserProfileScreen}
                        options={{
                          title: 'Profile',
                        }}
                      />
                      <Stack.Screen
                        name="Notifications"
                        component={NotificationScreen}
                        options={{
                          title: 'Notifications',
                        }}
                      />
                    </>
                  );
              }
            })()
          ) : (
            // No role selected - show role screen
            <>
              <Stack.Screen
                name="RoleScreen"
                component={RoleScreen}
                options={{
                  title: 'Role Selection',
                  headerBackVisible: false,
                }}
              />
              <Stack.Screen
                name="RoleRequestForm"
                component={RoleRequestForm}
                options={{
                  title: 'Role Request Form',
                }}
              />
            </>
          )
        ) : (
          // Auth stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Login',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Register',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 