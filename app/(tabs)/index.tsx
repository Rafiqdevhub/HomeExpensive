import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { useExpense } from "../../src/context/ExpenseContext";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dashboard() {
  const { expenses, getTotalExpenses, budgets, formatCurrency } = useExpense();
  const insets = useSafeAreaInsets();

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = getTotalExpenses();
  const remainingBudget = totalBudget - totalExpenses;

  // Calculate this month's vs last month's expenses
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const thisMonthExpenses = expenses.reduce((sum, exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === thisMonth &&
      expDate.getFullYear() === thisYear
      ? sum + exp.amount
      : sum;
  }, 0);

  const lastMonthExpenses = expenses.reduce((sum, exp) => {
    const expDate = new Date(exp.date);
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    return expDate.getMonth() === lastMonth &&
      expDate.getFullYear() === lastMonthYear
      ? sum + exp.amount
      : sum;
  }, 0);

  const expenseChange =
    lastMonthExpenses === 0
      ? 100
      : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(20);
  const subtextOpacity = useSharedValue(0);
  const subtextTranslateY = useSharedValue(20);

  useEffect(() => {
    welcomeOpacity.value = withDelay(200, withSpring(1));
    welcomeTranslateY.value = withDelay(200, withSpring(0));
    subtextOpacity.value = withDelay(400, withSpring(1));
    subtextTranslateY.value = withDelay(400, withSpring(0));
  }, []);

  const welcomeStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
    transform: [{ translateY: welcomeTranslateY.value }],
  }));

  const subtextStyle = useAnimatedStyle(() => ({
    opacity: subtextOpacity.value,
    transform: [{ translateY: subtextTranslateY.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(243, 244, 246, 1)" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16), // Ensure minimum padding even without notch
          paddingBottom: 32 + (Platform.OS === "ios" ? insets.bottom : 0),
        }}
      >
        <View className="px-4 pb-32">
          {/* Enhanced Header with gradient background */}
          <LinearGradient
            colors={["rgba(59, 130, 246, 0.15)", "transparent"]}
            className="absolute top-0 left-0 right-0 h-96 rounded-b-[40px]"
          />

          {/* Large Expense Icon */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="items-center mb-6"
          >
            <BlurView intensity={30} tint="light" className="rounded-full p-4">
              <LinearGradient
                colors={["#3b82f6", "#60a5fa"]}
                className="rounded-full p-4"
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={48}
                  color="white"
                />
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Current Month's Total Spending */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="items-center mb-6 mt-4"
          >
            <BlurView
              intensity={30}
              tint="light"
              className="rounded-3xl overflow-hidden w-full"
            >
              <LinearGradient
                colors={["#3b82f6", "#60a5fa"]}
                className="p-6 items-center"
              >
                <Text className="text-white text-lg opacity-80 mt-4 mb-2">
                  Current Month's Spending
                </Text>
                <Text className="text-white text-4xl font-bold mb-2">
                  {formatCurrency(thisMonthExpenses)}
                </Text>
                <Text className="text-white text-base opacity-80">
                  Monthly Budget: {formatCurrency(totalBudget)}
                </Text>
                <View className="w-full h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                  <Animated.View
                    entering={FadeInRight.delay(400).springify()}
                    style={{
                      width: `${Math.min(
                        (thisMonthExpenses / totalBudget) * 100,
                        100
                      )}%`,
                      height: "100%",
                      backgroundColor:
                        thisMonthExpenses > totalBudget ? "#ef4444" : "#4ade80",
                    }}
                  />
                </View>
                <Text className="text-white text-sm mt-2">
                  {((thisMonthExpenses / totalBudget) * 100).toFixed(1)}% spent
                </Text>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Summary Cards */}
          <View className="flex-row justify-between mb-8 gap-4">
            <Animated.View
              entering={FadeInRight.delay(400).springify()}
              className="flex-1"
            >
              <BlurView
                intensity={30}
                tint="light"
                className="rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={["#3b82f6", "#60a5fa"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-6"
                >
                  <View className="mb-3">
                    <MaterialIcons
                      name="account-balance"
                      size={32}
                      color="white"
                    />
                  </View>
                  <Text className="text-white text-sm mb-2 opacity-80">
                    Total Budget
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {formatCurrency(totalBudget)}
                  </Text>
                  <Text className="text-white text-xs opacity-70 mt-1">
                    {budgets.length}{" "}
                    {budgets.length === 1 ? "category" : "categories"}
                  </Text>
                </LinearGradient>
              </BlurView>
            </Animated.View>

            <Animated.View
              entering={FadeInRight.delay(600).springify()}
              className="flex-1"
            >
              <BlurView
                intensity={30}
                tint="light"
                className="rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={
                    remainingBudget >= 0
                      ? ["#22c55e", "#4ade80"]
                      : ["#ef4444", "#f87171"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-6"
                >
                  <View className="mb-3">
                    <MaterialIcons
                      name={remainingBudget >= 0 ? "savings" : "warning"}
                      size={32}
                      color="white"
                    />
                  </View>
                  <Text className="text-white text-sm mb-2 opacity-80">
                    {remainingBudget >= 0 ? "Remaining" : "Overspent"}
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {formatCurrency(Math.abs(remainingBudget))}
                  </Text>
                  <Text className="text-white text-xs opacity-70 mt-1">
                    {remainingBudget >= 0
                      ? "Available to spend"
                      : "Over budget"}
                  </Text>
                </LinearGradient>
              </BlurView>
            </Animated.View>
          </View>

          {/* Recent Activity Summary */}
          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            className="mb-8"
          >
            <View className="flex-row gap-4">
              <View className="flex-1">
                <BlurView
                  intensity={30}
                  tint="light"
                  className="rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={["#8b5cf6", "#a78bfa"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4"
                  >
                    <View className="mb-2">
                      <MaterialIcons name="today" size={24} color="white" />
                    </View>
                    <Text className="text-white text-xs opacity-80">
                      This Month
                    </Text>
                    <Text className="text-white text-lg font-semibold">
                      {formatCurrency(getTotalExpenses())}
                    </Text>
                  </LinearGradient>
                </BlurView>
              </View>

              <View className="flex-1">
                <BlurView
                  intensity={30}
                  tint="light"
                  className="rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={["#f59e0b", "#fbbf24"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4"
                  >
                    <View className="mb-2">
                      <MaterialIcons name="receipt" size={24} color="white" />
                    </View>
                    <Text className="text-white text-xs opacity-80">
                      Last 7 Days
                    </Text>
                    <Text className="text-white text-lg font-semibold">
                      {
                        expenses.filter(
                          (e) =>
                            new Date(e.date).getTime() >
                            Date.now() - 7 * 24 * 60 * 60 * 1000
                        ).length
                      }{" "}
                      txns
                    </Text>
                  </LinearGradient>
                </BlurView>
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            entering={FadeInDown.delay(700).springify()}
            className="mb-8"
          >
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Actions
            </Text>
            <View className="flex-row flex-wrap gap-4">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/expenses")}
                className="flex-1 min-w-[150px]"
              >
                <BlurView
                  intensity={30}
                  tint="light"
                  className="rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={["#ef4444", "#f87171"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4"
                  >
                    <View className="mb-2">
                      <MaterialIcons
                        name="account-balance-wallet"
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text className="text-white font-semibold mb-1">
                      New Expense
                    </Text>
                    <Text className="text-white text-xs opacity-80">
                      Quick add
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(tabs)/budget")}
                className="flex-1 min-w-[150px]"
              >
                <BlurView
                  intensity={30}
                  tint="light"
                  className="rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={["#3b82f6", "#60a5fa"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4"
                  >
                    <View className="mb-2">
                      <MaterialIcons name="pie-chart" size={24} color="white" />
                    </View>
                    <Text className="text-white font-semibold mb-1">
                      Budget
                    </Text>
                    <Text className="text-white text-xs opacity-80">
                      {budgets.length === 0 ? "Set up now" : "Manage limits"}
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(tabs)/setting")}
                className="flex-1 min-w-[150px]"
              >
                <BlurView
                  intensity={30}
                  tint="light"
                  className="rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={["#8b5cf6", "#a78bfa"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4"
                  >
                    <View className="mb-2">
                      <MaterialIcons name="settings" size={24} color="white" />
                    </View>
                    <Text className="text-white font-semibold mb-1">
                      Settings
                    </Text>
                    <Text className="text-white text-xs opacity-80">
                      Customize your app
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View
            entering={FadeInDown.delay(800).springify()}
            className="bg-white/80 rounded-3xl p-6 shadow-sm backdrop-blur-lg"
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-semibold text-gray-800">
                Recent
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/expenses")}
                className="bg-blue-50 px-4 py-2 rounded-full"
              >
                <Text className="text-blue-500 font-medium">See All</Text>
              </TouchableOpacity>
            </View>

            {recentExpenses.map((expense, index) => (
              <Animated.View
                key={expense.id}
                entering={FadeInRight.delay(1000 + index * 100).springify()}
                className="flex-row items-center justify-between py-4 border-b border-gray-100"
              >
                <View className="flex-row items-center">
                  <LinearGradient
                    colors={["#3b82f6", "#60a5fa"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                  >
                    <MaterialIcons
                      name={
                        expense.category === "Groceries"
                          ? "shopping-cart"
                          : expense.category === "Entertainment"
                          ? "movie"
                          : expense.category === "Transportation"
                          ? "directions-car"
                          : expense.category === "Utilities"
                          ? "flash-on"
                          : expense.category === "Healthcare"
                          ? "medical-services"
                          : "paid"
                      }
                      size={24}
                      color="white"
                    />
                  </LinearGradient>
                  <View>
                    <Text className="font-semibold text-base text-gray-800">
                      {expense.description}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {expense.category}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-semibold text-red-500 text-base">
                    -{formatCurrency(expense.amount)}
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    {format(new Date(expense.date), "MMM d")}
                  </Text>
                </View>
              </Animated.View>
            ))}

            {recentExpenses.length === 0 && (
              <Animated.View
                entering={FadeInDown.delay(1000).springify()}
                className="py-12 items-center"
              >
                <LinearGradient
                  colors={["#3b82f6", "#60a5fa"]}
                  className="w-16 h-16 rounded-full items-center justify-center mb-4 opacity-50"
                >
                  <MaterialIcons name="receipt-long" size={32} color="white" />
                </LinearGradient>
                <Text className="text-gray-400 text-lg text-center">
                  Start Fresh
                </Text>
                <Text className="text-gray-400 text-center mt-1">
                  Add your first transaction
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
