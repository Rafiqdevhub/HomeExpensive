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
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeInRight,
  withSpring,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  Layout,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { useExpense, CATEGORIES } from "../../src/context/ExpenseContext";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

export default function Expenses() {
  const {
    expenses,
    addExpense,
    deleteExpense,
    getTotalExpenses,
    getCategories,
    formatCurrency,
  } = useExpense();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const fabScale = useSharedValue(1);
  const deleteScale = useSharedValue(1);
  const categories = getCategories();

  const animateFAB = () => {
    fabScale.value = withSequence(withSpring(0.9), withSpring(1));
    setModalVisible(true);
  };

  const handleDeleteExpense = (id: string) => {
    deleteScale.value = withSequence(withSpring(0.9), withSpring(1));
    deleteExpense(id);
  };

  const handleCategoryPress = (categoryName: string) => {
    setCategory(categoryName);
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  const handleAddExpense = () => {
    if (!amount || !description) return;

    addExpense({
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
    });

    setModalVisible(false);
    setAmount("");
    setDescription("");
    setCategory(CATEGORIES[0].name);
  };

  const totalExpenses = getTotalExpenses();

  const groupedExpenses = expenses.reduce(
    (groups: { [key: string]: Expense[] }, expense) => {
      const date = format(new Date(expense.date), "MMM d, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
      return groups;
    },
    {}
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }} className="bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-4 pb-32">
          {/* Header with gradient background */}
          <LinearGradient
            colors={["rgba(239, 68, 68, 0.1)", "transparent"]}
            className="absolute top-0 left-0 right-0 h-72 rounded-b-[40px]"
          />

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="mb-6"
          >
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Expenses
            </Text>
            <Text className="text-gray-500 text-lg">Track your spending</Text>
          </Animated.View>

          {/* Total Expense Card */}
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            className="rounded-2xl overflow-hidden mb-8"
          >
            <View>
              <BlurView intensity={30} tint="light">
                <LinearGradient
                  colors={["#ef4444", "#f87171"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-6 shadow-lg"
                >
                  <Text className="text-white text-lg opacity-80 mb-3">
                    Total Expenses
                  </Text>
                  <Animated.Text
                    entering={FadeInUp.delay(600).springify()}
                    className="text-white text-4xl font-bold"
                  >
                    {formatCurrency(totalExpenses)}
                  </Animated.Text>
                </LinearGradient>
              </BlurView>
            </View>
          </Animated.View>

          {/* Expenses List */}
          {Object.entries(groupedExpenses).map(
            ([date, dayExpenses], groupIndex) => (
              <Animated.View
                key={date}
                entering={FadeInDown.delay(800 + groupIndex * 100).springify()}
                className="mb-6"
              >
                <Text className="text-gray-600 text-sm mb-3 font-medium">
                  {date}
                </Text>
                <View className="bg-white/80 rounded-2xl shadow-sm overflow-hidden backdrop-blur-lg">
                  {dayExpenses.map((expense, index) => (
                    <Animated.View
                      key={expense.id}
                      entering={FadeInRight.delay(
                        1000 + index * 100
                      ).springify()}
                      exiting={FadeOutDown}
                      layout={Layout.springify()}
                      className={`flex-row items-center justify-between p-4 ${
                        index < dayExpenses.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center flex-1">
                        <LinearGradient
                          colors={
                            categories.find(
                              (cat) => cat.name === expense.category
                            )?.gradient || ["#3b82f6", "#60a5fa"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                        >
                          <MaterialIcons
                            name={
                              categories.find(
                                (cat) => cat.name === expense.category
                              )?.icon || "paid"
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
                      <View className="flex-row items-center">
                        <Text className="font-semibold text-red-500 text-base mr-3">
                          {formatCurrency(expense.amount)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteExpense(expense.id)}
                          className="bg-red-50 rounded-full p-2"
                        >
                          <Animated.View style={deleteAnimatedStyle}>
                            <MaterialIcons
                              name="delete-outline"
                              size={20}
                              color="#ef4444"
                            />
                          </Animated.View>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            )
          )}

          {expenses.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(800).springify()}
              className="items-center justify-center py-12"
            >
              <LinearGradient
                colors={["#ef4444", "#f87171"]}
                className="w-20 h-20 rounded-full items-center justify-center mb-4 opacity-50"
              >
                <MaterialIcons name="receipt-long" size={40} color="white" />
              </LinearGradient>
              <Text className="text-gray-400 text-xl text-center font-medium">
                No expenses yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Add your first expense by tapping the + button
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Add Expense FAB */}
      <Animated.View style={fabAnimatedStyle}>
        <TouchableOpacity
          onPress={animateFAB}
          className="absolute bottom-32 right-6 bg-red-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Add Expense Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
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
                            Add Expense
                          </Text>
                          <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="bg-gray-100 rounded-full p-2"
                          >
                            <MaterialIcons
                              name="close"
                              size={24}
                              color="#374151"
                            />
                          </TouchableOpacity>
                        </View>

                        <View className="space-y-6">
                          <View>
                            <Text className="text-gray-600 mb-2 font-medium">
                              Amount
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

                          <View>
                            <Text className="text-gray-600 mb-2 font-medium">
                              Description
                            </Text>
                            <TextInput
                              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                              value={description}
                              onChangeText={setDescription}
                              placeholder="What did you spend on?"
                              placeholderTextColor="#9ca3af"
                            />
                          </View>

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
                                    onPress={() =>
                                      handleCategoryPress(cat.name)
                                    }
                                    style={{
                                      transform: [
                                        {
                                          scale:
                                            category === cat.name ? 1.05 : 1,
                                        },
                                      ],
                                    }}
                                    className="transition-all duration-200"
                                  >
                                    <View
                                      className={`rounded-2xl overflow-hidden ${
                                        category === cat.name
                                          ? "border-2 border-blue-500 shadow-lg shadow-blue-500/50"
                                          : "border border-gray-200"
                                      }`}
                                    >
                                      <BlurView intensity={30} tint="light">
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
                                    </View>
                                  </TouchableOpacity>
                                </Animated.View>
                              ))}
                            </ScrollView>
                          </View>

                          <TouchableOpacity
                            onPress={handleAddExpense}
                            className="bg-red-500 p-4 rounded-xl mt-6"
                          >
                            <Text className="text-white text-center text-lg font-semibold">
                              Add Expense
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ScrollView>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </BlurView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
