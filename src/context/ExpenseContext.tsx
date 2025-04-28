import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

// Move CATEGORIES to context level
export const CATEGORIES = [
  {
    name: "Groceries",
    icon: "shopping-cart" as keyof typeof MaterialIcons.glyphMap,
    color: "#10b981",
    gradient: ["#059669", "#10b981"] as [string, string],
  },
  {
    name: "Utilities",
    icon: "flash-on" as keyof typeof MaterialIcons.glyphMap,
    color: "#f59e0b",
    gradient: ["#d97706", "#f59e0b"] as [string, string],
  },
  {
    name: "Rent",
    icon: "home" as keyof typeof MaterialIcons.glyphMap,
    color: "#3b82f6",
    gradient: ["#2563eb", "#3b82f6"] as [string, string],
  },
  {
    name: "Transportation",
    icon: "directions-car" as keyof typeof MaterialIcons.glyphMap,
    color: "#6366f1",
    gradient: ["#4f46e5", "#6366f1"] as [string, string],
  },
  {
    name: "Entertainment",
    icon: "movie" as keyof typeof MaterialIcons.glyphMap,
    color: "#ec4899",
    gradient: ["#db2777", "#ec4899"] as [string, string],
  },
  {
    name: "Healthcare",
    icon: "medical-services" as keyof typeof MaterialIcons.glyphMap,
    color: "#ef4444",
    gradient: ["#dc2626", "#ef4444"] as [string, string],
  },
  {
    name: "Other",
    icon: "more-horiz" as keyof typeof MaterialIcons.glyphMap,
    color: "#8b5cf6",
    gradient: ["#7c3aed", "#8b5cf6"] as [string, string],
  },
];

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

type Budget = {
  category: string;
  amount: number;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

type ExpenseContextType = {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (category: string, amount: number) => void;
  deleteExpense: (id: string) => void;
  getTotalExpenses: () => number;
  getExpensesByCategory: (category: string) => Expense[];
  getBudgetByCategory: (category: string) => Budget | undefined;
  getCategories: () => typeof CATEGORIES;
  reset: () => Promise<void>; // Add this line
};

const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem("expenses");
      const storedBudgets = await AsyncStorage.getItem("budgets");

      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
      await AsyncStorage.setItem("budgets", JSON.stringify(budgets));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    saveData();
  }, [expenses, budgets]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const addBudget = (budget: Budget) => {
    setBudgets([...budgets, budget]);
  };

  const updateBudget = (category: string, amount: number) => {
    setBudgets(
      budgets.map((b) => (b.category === category ? { ...b, amount } : b))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = (category: string) => {
    return expenses.filter((expense) => expense.category === category);
  };

  const getBudgetByCategory = (category: string) => {
    return budgets.find((budget) => budget.category === category);
  };

  const getCategories = () => CATEGORIES;

  const reset = async () => {
    try {
      await AsyncStorage.clear();
      setExpenses([]);
      setBudgets([]);
    } catch (error) {
      console.error("Error resetting data:", error);
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        addExpense,
        addBudget,
        updateBudget,
        deleteExpense,
        getTotalExpenses,
        getExpensesByCategory,
        getBudgetByCategory,
        getCategories,
        reset, // Add this line
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};

// Export the context component as default
export default ExpenseContext;
export { ExpenseProvider, useExpense };
