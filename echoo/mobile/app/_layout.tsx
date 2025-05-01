import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name='index'
          options={{
            title: 'Deuces',
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='(tabs)'
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </AuthProvider>
  );
}