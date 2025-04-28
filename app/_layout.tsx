import { Stack } from "expo-router";
import { ExpenseProvider } from "../src/context/ExpenseContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <ExpenseProvider>
        <SafeAreaProvider>
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
            translucent={true}
            backgroundColor="transparent"
          />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </ExpenseProvider>
    </ThemeProvider>
  );
}
