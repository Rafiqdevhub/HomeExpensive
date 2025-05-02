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
      <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden">
        <View className="absolute inset-0 bg-primary/10" />
        <MaterialIcons name={icon} size={20} color={colors.primary} />
        <Text
          style={{ color: colors.primary }}
          className="text-base font-semibold ml-2"
        >
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
          backgroundColor: colors.card,
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.cardBorder,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="widgets" title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="receipt-long" title="Expenses" />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="account-balance" title="Budget" />
          ),
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          title: "Data",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="import-export" title="Data" />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="settings" title="Setting" />
          ),
        }}
      />
    </Tabs>
  );
}
