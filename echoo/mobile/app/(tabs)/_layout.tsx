import { Tabs } from 'expo-router';
import ProtectedRoute  from '../../components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs>
        <Tabs.Screen 
          name="home"
          options={{
            title: 'Home',
            headerRight: () => <LogoutButton />
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
            headerRight: () => <LogoutButton />
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}