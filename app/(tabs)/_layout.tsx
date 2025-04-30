import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { useTheme } from "../../src/context/ThemeContext";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TabLayout() {
  const { theme, colors } = useTheme();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: "transparent",
            height: Platform.OS === "ios" ? 85 : 65,
            paddingBottom: Platform.OS === "ios" ? 20 : 8,
            paddingTop: 8,
            borderTopWidth: 0,
          },
          tabBarBackground: () => (
            <AnimatedBlurView
              intensity={Platform.OS === "ios" ? 60 : 100}
              tint={theme}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                backgroundColor: colors.card,
                borderTopWidth: 0.5,
                borderTopColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: theme === "dark" ? 0.2 : 0.1,
                shadowRadius: 3,
                elevation: 10,
              }}
            />
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused
                    ? `${colors.primary}20`
                    : "transparent",
                  padding: 8,
                  borderRadius: 12,
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                <MaterialIcons name="dashboard" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused
                    ? `${colors.primary}20`
                    : "transparent",
                  padding: 8,
                  borderRadius: 12,
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: "Budget",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused
                    ? `${colors.primary}20`
                    : "transparent",
                  padding: 8,
                  borderRadius: 12,
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                <MaterialIcons name="pie-chart" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused
                    ? `${colors.primary}20`
                    : "transparent",
                  padding: 8,
                  borderRadius: 12,
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                <MaterialIcons name="settings" size={24} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
