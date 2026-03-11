import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { COLORS } from '../utils/theme';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import MembersScreen from '../screens/MembersScreen';
import AddMemberScreen from '../screens/AddMemberScreen';
import MeetingsScreen from '../screens/MeetingsScreen';
import AddMeetingScreen from '../screens/AddMeetingScreen';
import ReportsScreen from '../screens/ReportsScreen';
import BackupScreen from '../screens/BackupScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    Dashboard: focused ? '🏠' : '🏡',
    Accounts: focused ? '💰' : '💳',
    Members: focused ? '👥' : '👤',
    Meetings: focused ? '📅' : '📆',
    More: focused ? '☰' : '≡',
  };
  return <Text style={{ fontSize: 20 }}>{icons[name] || '•'}</Text>;
}

// Accounts Stack
function AccountsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Transactions' }} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
    </Stack.Navigator>
  );
}

// Members Stack
function MembersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="MembersList" component={MembersScreen} options={{ title: 'Members' }} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} options={{ title: 'Add Member' }} />
    </Stack.Navigator>
  );
}

// Meetings Stack
function MeetingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="MeetingsList" component={MeetingsScreen} options={{ title: 'Meetings' }} />
      <Stack.Screen name="AddMeeting" component={AddMeetingScreen} options={{ title: 'Add Meeting' }} />
    </Stack.Navigator>
  );
}

// More Stack (Reports, Backup, Settings)
function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports & Share' }} />
      <Stack.Screen name="Backup" component={BackupScreen} options={{ title: 'Backup & Restore' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          elevation: 8,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: 'bold' },
          title: 'FPO Accounting',
        }}
      />
      <Tab.Screen name="Accounts" component={AccountsStack} />
      <Tab.Screen name="Members" component={MembersStack} />
      <Tab.Screen name="Meetings" component={MeetingsStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
