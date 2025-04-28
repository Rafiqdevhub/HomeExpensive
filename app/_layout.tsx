import { Stack } from "expo-router";
import { ExpenseProvider } from "../src/context/ExpenseContext";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

function RootLayoutNav() {
  const { theme, colors } = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <RootLayoutNav />
      </ExpenseProvider>
    </ThemeProvider>
  );
}
