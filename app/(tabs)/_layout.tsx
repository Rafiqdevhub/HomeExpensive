import { Tabs } from "expo-router";
import { Text, View, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../src/context/ThemeContext";

function TabIcon({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
}) {
  const { colors } = useTheme();

  if (focused) {
    return (
      <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden bg-primary/10">
        <MaterialIcons name={icon} size={20} color={colors.primary} />
        <Text className="text-primary text-base font-semibold ml-2">
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <MaterialIcons name={icon} size={20} color={colors.textSecondary} />
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="dashboard" title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="account-balance-wallet"
              title="Expenses"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="pie-chart" title="Budget" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="settings" title="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}
