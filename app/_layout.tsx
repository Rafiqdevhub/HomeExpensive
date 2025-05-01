import { Slot, Stack } from "expo-router";
import { ExpenseProvider } from "../src/context/ExpenseContext";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";
import { UserProvider, useUser } from "../src/context/UserContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";
import "./global.css";

function RootLayoutNav() {
  const { theme, colors } = useTheme();
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <ExpenseProvider>
            <RootLayoutNav />
          </ExpenseProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
