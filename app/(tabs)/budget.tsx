import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  withSpring,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { useExpense, CATEGORIES } from "../../src/context/ExpenseContext";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { format } from "date-fns";

export default function Budget() {
  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getExpensesByCategory,
    getCategories,
    formatCurrency,
    expenses,
  } = useExpense();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const fabScale = useSharedValue(1);
  const categories = getCategories();

  // Calculate total expenses this month
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.reduce((sum, exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === thisMonth &&
      expDate.getFullYear() === thisYear
      ? sum + exp.amount
      : sum;
  }, 0);

  // Calculate last month's total expenses for comparison
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const lastMonthExpenses = expenses.reduce((sum, exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === lastMonth &&
      expDate.getFullYear() === lastMonthYear
      ? sum + exp.amount
      : sum;
  }, 0);

  const spendingTrend =
    lastMonthExpenses === 0
      ? 0
      : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  const animateFAB = () => {
    fabScale.value = withSequence(withSpring(0.9), withSpring(1));
    setModalVisible(true);
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleAddBudget = () => {
    if (!amount) return;

    if (editingBudget) {
      updateBudget(category, parseFloat(amount));
    } else {
      addBudget({
        amount: parseFloat(amount),
        category,
      });
    }

    setModalVisible(false);
    setAmount("");
    setCategory(CATEGORIES[0].name);
    setEditingBudget(null);
  };

  const handleEditBudget = (categoryName: string) => {
    const budget = budgets.find((b) => b.category === categoryName);
    if (budget) {
      setCategory(categoryName);
      setAmount(budget.amount.toString());
      setEditingBudget(categoryName);
      setModalVisible(true);
    }
  };

  const handleDeleteBudget = (categoryName: string) => {
    Alert.alert(
      "Delete Budget",
      "Are you sure you want to delete this budget?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteBudget(categoryName);
          },
        },
      ]
    );
  };

  const handleCategoryPress = (categoryName: string) => {
    setCategory(categoryName);
  };

  const getBudgetUtilization = (category: string) => {
    const expenses = getExpensesByCategory(category);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budget = budgets.find((b) => b.category === category);
    if (!budget) return { percentage: 0, amount: totalExpenses };
    return {
      percentage: (totalExpenses / budget.amount) * 100,
      amount: totalExpenses,
      budgetAmount: budget.amount,
    };
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }} className="bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-4 pb-32">
          {/* Header with gradient background */}
          <LinearGradient
            colors={["rgba(59, 130, 246, 0.1)", "transparent"]}
            className="absolute top-0 left-0 right-0 h-72 rounded-b-[40px]"
          />

          {/* Large Budget Icon */}
          <View className="items-center mb-6 mt-4">
            <BlurView intensity={30} tint="light" className="rounded-full p-4">
              <LinearGradient
                colors={["#3b82f6", "#60a5fa"]}
                className="rounded-full p-4"
              >
                <MaterialIcons name="account-balance" size={48} color="white" />
              </LinearGradient>
            </BlurView>
          </View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="mb-6"
          >
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Budget
            </Text>
            <Text className="text-gray-500 text-lg">Manage your limits</Text>
          </Animated.View>

          {/* Total Budget Card */}
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            className="rounded-2xl overflow-hidden mb-8"
          >
            <BlurView intensity={30} tint="light">
              <LinearGradient
                colors={["#3b82f6", "#60a5fa"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6 shadow-lg"
              >
                <Text className="text-white text-lg opacity-80 mb-3">
                  Total Budget
                </Text>
                <Text className="text-white text-4xl font-bold">
                  {formatCurrency(totalBudget)}
                </Text>
                <Text className="text-white text-lg opacity-80 mt-3">
                  This Month's Expenses: {formatCurrency(thisMonthExpenses)}
                </Text>
                <Text className="text-white text-lg opacity-80 mt-1">
                  Spending Trend: {spendingTrend.toFixed(2)}%
                </Text>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Budget Categories */}
          <View className="space-y-4">
            {categories.map((cat, index) => {
              const utilization = getBudgetUtilization(cat.name);
              const hasBudget = budgets.some((b) => b.category === cat.name);
              const progressWidth = useSharedValue(0);

              React.useEffect(() => {
                progressWidth.value = 0;
                if (hasBudget) {
                  progressWidth.value = withDelay(
                    600 + index * 100,
                    withSpring(Math.min(utilization.percentage, 100) / 100, {
                      damping: 15,
                      stiffness: 100,
                    })
                  );
                }
              }, [hasBudget, utilization.percentage]);

              const progressStyle = useAnimatedStyle(() => ({
                width: `${progressWidth.value * 100}%`,
              }));

              return (
                <Animated.View
                  key={cat.name}
                  entering={FadeInRight.delay(600 + index * 100).springify()}
                >
                  <BlurView
                    intensity={30}
                    tint="light"
                    className="rounded-2xl overflow-hidden"
                  >
                    <View className="bg-white/80 p-4">
                      <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center flex-1">
                          <LinearGradient
                            colors={cat.gradient}
                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                          >
                            <MaterialIcons
                              name={cat.icon}
                              size={24}
                              color="white"
                            />
                          </LinearGradient>
                          <View className="flex-1">
                            <Text className="font-semibold text-base text-gray-800 mb-1">
                              {cat.name}
                            </Text>
                            {hasBudget && (
                              <Text className="text-gray-500 text-sm">
                                {formatCurrency(utilization.amount)} /{" "}
                                {formatCurrency(utilization.budgetAmount || 0)}
                              </Text>
                            )}
                          </View>
                        </View>
                        {!hasBudget ? (
                          <TouchableOpacity
                            onPress={() => {
                              setCategory(cat.name);
                              setModalVisible(true);
                            }}
                            className="bg-blue-50 px-4 py-2 rounded-xl"
                          >
                            <Text className="text-blue-600 font-medium">
                              Set Budget
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View className="flex-row space-x-2">
                            <TouchableOpacity
                              onPress={() => handleEditBudget(cat.name)}
                              className="bg-yellow-50 px-4 py-2 rounded-xl"
                            >
                              <Text className="text-yellow-600 font-medium">
                                Edit
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteBudget(cat.name)}
                              className="bg-red-50 px-4 py-2 rounded-xl"
                            >
                              <Text className="text-red-600 font-medium">
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {hasBudget && (
                        <View>
                          <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <Animated.View style={progressStyle}>
                              <LinearGradient
                                colors={
                                  utilization.percentage > 100
                                    ? ["#ef4444", "#f87171"]
                                    : utilization.percentage > 80
                                    ? ["#f59e0b", "#fbbf24"]
                                    : ["#10b981", "#34d399"]
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-full w-full"
                              />
                            </Animated.View>
                          </View>
                          {utilization.percentage > 80 && (
                            <Animated.View
                              entering={FadeInDown.delay(
                                1000 + index * 100
                              ).springify()}
                              className="flex-row items-center mt-2"
                            >
                              <MaterialIcons
                                name={
                                  utilization.percentage > 100
                                    ? "error"
                                    : "warning"
                                }
                                size={16}
                                color={
                                  utilization.percentage > 100
                                    ? "#ef4444"
                                    : "#f59e0b"
                                }
                                style={{ marginRight: 4 }}
                              />
                              <Text
                                className={`text-sm ${
                                  utilization.percentage > 100
                                    ? "text-red-500"
                                    : "text-yellow-500"
                                }`}
                              >
                                {utilization.percentage > 100
                                  ? "Over budget!"
                                  : "Near budget limit!"}
                              </Text>
                            </Animated.View>
                          )}
                        </View>
                      )}
                    </View>
                  </BlurView>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Add Budget FAB */}
      <Animated.View style={fabAnimatedStyle}>
        <TouchableOpacity
          onPress={animateFAB}
          className="absolute bottom-32 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Add Budget Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={20} tint="dark" className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View
                entering={FadeInUp.springify()}
                className="flex-1 justify-end"
              >
                <ScrollView bounces={false}>
                  <View className="bg-white rounded-t-3xl p-6 min-h-[60%]">
                    <View className="flex-row justify-between items-center mb-6">
                      <Text className="text-2xl font-bold text-gray-800">
                        {editingBudget ? "Edit Budget" : "Set Budget"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className="bg-gray-100 rounded-full p-2"
                      >
                        <MaterialIcons name="close" size={24} color="#374151" />
                      </TouchableOpacity>
                    </View>

                    <View className="space-y-6">
                      {/* Category Selection */}
                      <View>
                        <Text className="text-gray-600 mb-4 font-medium">
                          Category
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{
                            paddingLeft: 8,
                            paddingRight: 24,
                          }}
                          className="flex-row"
                        >
                          {categories.map((cat, index) => (
                            <Animated.View
                              key={cat.name}
                              entering={FadeInRight.delay(
                                200 + index * 100
                              ).springify()}
                              className="mr-3"
                            >
                              <TouchableOpacity
                                onPress={() => handleCategoryPress(cat.name)}
                                style={{
                                  transform: [
                                    { scale: category === cat.name ? 1.05 : 1 },
                                  ],
                                }}
                                className="transition-all duration-200"
                              >
                                <BlurView
                                  intensity={30}
                                  tint="light"
                                  className={`rounded-2xl overflow-hidden ${
                                    category === cat.name
                                      ? "border-2 border-blue-500 shadow-lg shadow-blue-500/50"
                                      : "border border-gray-200"
                                  }`}
                                >
                                  <LinearGradient
                                    colors={cat.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="p-4 items-center min-w-[110px]"
                                  >
                                    <View
                                      className={`w-12 h-12 rounded-xl items-center justify-center mb-3 ${
                                        category === cat.name
                                          ? "bg-white/20"
                                          : "bg-white/10"
                                      }`}
                                    >
                                      <MaterialIcons
                                        name={cat.icon}
                                        size={24}
                                        color="white"
                                      />
                                    </View>
                                    <Text
                                      className={`text-white font-semibold text-center ${
                                        category === cat.name
                                          ? "text-base"
                                          : "text-sm opacity-90"
                                      }`}
                                    >
                                      {cat.name}
                                    </Text>
                                  </LinearGradient>
                                </BlurView>
                              </TouchableOpacity>
                            </Animated.View>
                          ))}
                        </ScrollView>
                      </View>

                      {/* Budget Amount Input */}
                      <View>
                        <Text className="text-gray-600 mb-2 font-medium">
                          Budget Amount
                        </Text>
                        <TextInput
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg"
                          keyboardType="numeric"
                          value={amount}
                          onChangeText={setAmount}
                          placeholder="0.00"
                          placeholderTextColor="#9ca3af"
                        />
                      </View>

                      <TouchableOpacity
                        onPress={handleAddBudget}
                        className="bg-blue-500 p-4 rounded-xl mt-6"
                      >
                        <Text className="text-white text-center text-lg font-semibold">
                          {editingBudget ? "Update Budget" : "Set Budget"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}
