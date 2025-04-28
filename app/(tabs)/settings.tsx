import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Share,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExpense } from "../../src/context/ExpenseContext";
import { useTheme } from "../../src/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { format } from "date-fns";

export default function Settings() {
  const { expenses, budgets, reset, getCategories } = useExpense();
  const { theme, toggleTheme, colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const generatePDFContent = () => {
    const categories = getCategories();
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .header { text-align: center; color: #3b82f6; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .summary { background: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>homeXpense Report</h1>
            <p>Generated on ${format(new Date(), "MMMM d, yyyy")}</p>
          </div>

          <div class="section">
            <h2 class="section-title">Summary</h2>
            <div class="summary">
              <p>Total Budget: Rs${totalBudget}</p>
              <p>Total Expenses: Rs${totalExpenses}</p>
              <p>Remaining: Rs${totalBudget - totalExpenses}</p>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Budgets by Category</h2>
            <table>
              <tr>
                <th>Category</th>
                <th>Budget Amount</th>
              </tr>
              ${budgets
                .map(
                  (budget) => `
                <tr>
                  <td>${budget.category}</td>
                  <td>Rs${budget.amount}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </div>

          <div class="section">
            <h2 class="section-title">Recent Expenses</h2>
            <table>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
              ${expenses
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map(
                  (expense) => `
                  <tr>
                    <td>${format(new Date(expense.date), "MMM d, yyyy")}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>Rs${expense.amount}</td>
                  </tr>
                `
                )
                .join("")}
            </table>
          </div>
        </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      const html = generatePDFContent();
      const { uri } = await Print.printToFileAsync({ html });

      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      } else {
        const pdfName = `homeXpense_report_${format(
          new Date(),
          "yyyy-MM-dd"
        )}.pdf`;
        const pdfDir = `${FileSystem.documentDirectory}PDFs`;
        const pdfPath = `${pdfDir}/${pdfName}`;

        // Create PDFs directory if it doesn't exist
        const dirInfo = await FileSystem.getInfoAsync(pdfDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });
        }

        // Move the file to PDFs directory
        await FileSystem.moveAsync({
          from: uri,
          to: pdfPath,
        });

        // Share the PDF
        await Sharing.shareAsync(pdfPath);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to generate PDF report. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    const data = {
      expenses,
      budgets,
      exportDate: new Date().toISOString(),
    };

    try {
      await Share.share({
        message: JSON.stringify(data, null, 2),
        title: "homeXpense Data Export",
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled && result.assets && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const response = await fetch(fileUri);
        const text = await response.text();
        const data = JSON.parse(text);

        if (data.expenses && data.budgets) {
          Alert.alert(
            "Import Data",
            "This will replace all your current data. Are you sure?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Import",
                onPress: async () => {
                  setIsLoading(true);
                  try {
                    await AsyncStorage.setItem(
                      "expenses",
                      JSON.stringify(data.expenses)
                    );
                    await AsyncStorage.setItem(
                      "budgets",
                      JSON.stringify(data.budgets)
                    );
                    Alert.alert(
                      "Success",
                      "Data imported successfully. Please restart the app."
                    );
                  } catch (error) {
                    Alert.alert(
                      "Error",
                      "Failed to import data. Please try again."
                    );
                  } finally {
                    setIsLoading(false);
                  }
                },
              },
            ]
          );
        } else {
          Alert.alert("Error", "Invalid data format");
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
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
            setIsLoading(true);
            try {
              await reset();
              Alert.alert("Success", "All data has been cleared successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data. Please try again.");
            } finally {
              setIsLoading(false);
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
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
      {isLoading && (
        <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
          <BlurView intensity={30} tint={theme} className="p-6 rounded-2xl">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.text }} className="mt-4">
              Please wait...
            </Text>
          </BlurView>
        </View>
      )}

      <ScrollView className="flex-1">
        <View className="px-4 pt-12 pb-24">
          {/* Header with gradient background */}
          <LinearGradient
            colors={[`${colors.primary}20`, "transparent"]}
            className="absolute top-0 left-0 right-0 h-72 rounded-b-[40px]"
          />

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

          {/* Settings Sections */}
          <View className="mb-8">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-sm font-medium mb-4 uppercase tracking-wider"
            >
              Data Management
            </Text>
            {renderSettingItem(
              "picture-as-pdf",
              "Export as PDF",
              "Generate a detailed PDF report",
              handleExportPDF
            )}
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
              handleImportData
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
    </SafeAreaView>
  );
}
