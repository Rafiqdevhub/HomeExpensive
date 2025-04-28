import React from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExpense } from "../../src/context/ExpenseContext";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { expenses, budgets } = useExpense();

  const handleExportData = () => {
    const data = {
      expenses,
      budgets,
      exportDate: new Date().toISOString(),
    };

    Alert.alert(
      "Export Data",
      "Here's your data in JSON format. You can copy and save it:",
      [{ text: "OK" }]
    );
    console.log(JSON.stringify(data, null, 2));
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all your expenses and budgets? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                "Success",
                "All data has been cleared. Please restart the app."
              );
            } catch (error) {
              Alert.alert("Error", "Failed to clear data. Please try again.");
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    iconName: keyof typeof MaterialIcons.glyphMap,
    title: string,
    subtitle: string = "",
    onPress: () => void,
    type: "default" | "danger" = "default"
  ) => (
    <BlurView
      intensity={30}
      tint="light"
      className="rounded-2xl mb-3 overflow-hidden"
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-white/80 backdrop-blur-lg"
      >
        <View className="p-4 flex-row items-center">
          <LinearGradient
            colors={
              type === "danger"
                ? ["#ef4444", "#f87171"]
                : ["#3b82f6", "#60a5fa"]
            }
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          >
            <MaterialIcons name={iconName} size={24} color="white" />
          </LinearGradient>
          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${
                type === "danger" ? "text-red-500" : "text-gray-800"
              }`}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-gray-500 text-sm">{subtitle}</Text>
            ) : null}
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={type === "danger" ? "#ef4444" : "#94a3b8"}
          />
        </View>
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-4 pt-12 pb-24">
          {/* Header with gradient background */}
          <LinearGradient
            colors={["rgba(59, 130, 246, 0.1)", "transparent"]}
            className="absolute top-0 left-0 right-0 h-72 rounded-b-[40px]"
          />

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Settings
            </Text>
            <Text className="text-gray-500 text-lg">
              Customize your experience
            </Text>
          </View>

          {/* Settings Sections */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
              Data Management
            </Text>
            {renderSettingItem(
              "save",
              "Export Data",
              "Backup your expenses and budgets",
              handleExportData
            )}
            {renderSettingItem(
              "restore",
              "Import Data",
              "Restore from a backup",
              () => {}
            )}
            {renderSettingItem(
              "delete-forever",
              "Clear All Data",
              "Remove all your data",
              handleClearData,
              "danger"
            )}
          </View>

          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
              Preferences
            </Text>
            {renderSettingItem(
              "notifications",
              "Notifications",
              "Manage your alerts",
              () => {}
            )}
            {renderSettingItem(
              "color-lens",
              "Appearance",
              "Customize the look and feel",
              () => {}
            )}
            {renderSettingItem(
              "language",
              "Language",
              "Change app language",
              () => {}
            )}
          </View>

          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
              About
            </Text>
            {renderSettingItem("info", "Version", "1.0.0", () => {})}
            {renderSettingItem(
              "privacy-tip",
              "Privacy Policy",
              "Read our privacy policy",
              () => {}
            )}
            {renderSettingItem(
              "description",
              "Terms of Service",
              "Read our terms of service",
              () => {}
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
