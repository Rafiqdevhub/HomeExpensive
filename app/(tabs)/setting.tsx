import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../src/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const { theme, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderSettingItem = (
    iconName: keyof typeof MaterialIcons.glyphMap,
    title: string,
    subtitle: string = "",
    onPress: () => void,
    type: "default" | "danger" = "default"
  ) => (
    <BlurView
      intensity={30}
      tint={theme}
      className="rounded-2xl mb-3 overflow-hidden"
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ backgroundColor: colors.card }}
        className="backdrop-blur-lg"
      >
        <View className="p-4 flex-row items-center">
          <LinearGradient
            colors={
              type === "danger"
                ? [colors.danger, colors.danger]
                : [colors.primary, colors.primary]
            }
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          >
            <MaterialIcons name={iconName} size={24} color="white" />
          </LinearGradient>
          <View className="flex-1">
            <Text
              style={{
                color: type === "danger" ? colors.danger : colors.text,
              }}
              className="text-base font-semibold"
            >
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                {subtitle}
              </Text>
            ) : null}
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={type === "danger" ? colors.danger : colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: 32 + (Platform.OS === "ios" ? insets.bottom : 0),
        }}
      >
        <View className="px-4 pb-24">
          {/* Header with gradient background */}
          <LinearGradient
            colors={[`${colors.primary}20`, "transparent"]}
            className="absolute top-0 left-0 right-0 h-72 rounded-b-[40px]"
          />

          {/* Large Settings Icon */}
          <View className="items-center mb-6 mt-4">
            <BlurView intensity={30} tint={theme} className="rounded-full p-4">
              <LinearGradient
                colors={["#8b5cf6", "#a78bfa"]}
                className="rounded-full p-4"
              >
                <MaterialIcons name="settings" size={48} color="white" />
              </LinearGradient>
            </BlurView>
          </View>

          {/* Header */}
          <View className="mb-8">
            <Text
              style={{ color: colors.text }}
              className="text-3xl font-bold mb-2"
            >
              Settings
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-lg">
              Customize your experience
            </Text>
          </View>

          <View className="mb-8">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-sm font-medium mb-4 uppercase tracking-wider"
            >
              Preferences
            </Text>
            {renderSettingItem(
              "dark-mode",
              "Theme",
              theme === "dark" ? "Dark Mode" : "Light Mode",
              toggleTheme
            )}
            {renderSettingItem(
              "notifications",
              "Notifications",
              "Coming soon",
              () =>
                Alert.alert(
                  "Coming Soon",
                  "This feature will be available in a future update."
                )
            )}
            {renderSettingItem("language", "Language", "Coming soon", () =>
              Alert.alert(
                "Coming Soon",
                "This feature will be available in a future update."
              )
            )}
          </View>

          <View className="mb-8">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-sm font-medium mb-3 uppercase tracking-wider"
            >
              About
            </Text>
            {renderSettingItem("info", "Version", "1.0.0", () => {})}
            {renderSettingItem(
              "privacy-tip",
              "Privacy Policy",
              "Read our privacy policy",
              () =>
                Alert.alert(
                  "Coming Soon",
                  "This feature will be available in a future update."
                )
            )}
            {renderSettingItem(
              "description",
              "Terms of Service",
              "Read our terms of service",
              () =>
                Alert.alert(
                  "Coming Soon",
                  "This feature will be available in a future update."
                )
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
