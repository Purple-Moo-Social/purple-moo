import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/app/context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { state } = useAuth();

  if(state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if(!state.isAuthenticated) {
    return <Redirect href={{ pathname: "../login" }} />;
  }

  return children;
}