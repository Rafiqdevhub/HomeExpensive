import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TabLayout() {
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            position: "absolute",
            bottom: Platform.OS === "ios" ? 24 : 16,
            left: 16,
            right: 16,
            elevation: 0,
            backgroundColor: "transparent",
            borderRadius: 24,
            height: 65,
            paddingBottom: Platform.OS === "ios" ? 20 : 12,
            borderTopWidth: 0,
          },
          tabBarBackground: () => (
            <AnimatedBlurView
              intensity={Platform.OS === "ios" ? 60 : 100}
              tint="light"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                overflow: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
              }}
            />
          ),
          tabBarActiveTintColor: "#3b82f6",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: Platform.OS === "ios" ? "600" : "500",
            marginTop: -5,
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
                    ? "rgba(59, 130, 246, 0.1)"
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
                    ? "rgba(59, 130, 246, 0.1)"
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
                    ? "rgba(59, 130, 246, 0.1)"
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
                    ? "rgba(59, 130, 246, 0.1)"
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
