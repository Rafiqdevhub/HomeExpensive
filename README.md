# homeXpense - Personal Finance Tracker

A modern, beautifully designed personal finance tracking application built with React Native and Expo. homeXpense helps you manage your expenses, set budgets, and track your spending with an intuitive and user-friendly interface.

## Features

- 📊 **Dashboard Overview**: Get a quick glance at your financial status with beautiful visualizations
- 💰 **Expense Tracking**: Easily log and categorize your daily expenses
- 🎯 **Budget Management**: Set and monitor budgets for different expense categories
- 📱 **Modern UI/UX**: Sleek design with smooth animations and interactions
- 🌓 **Theme Support**: Automatic light/dark theme based on system preferences
- 💾 **Data Persistence**: Local storage for all your financial data
- 📊 **Category Management**: Pre-defined expense categories with custom icons and colors

## Tech Stack

- React Native with Expo
- TypeScript for type safety
- Expo Router for navigation
- NativeWind (TailwindCSS) for styling
- React Native Reanimated for animations
- Expo Blur for glass-morphism effects
- AsyncStorage for data persistence
- Context API for state management

## Getting Started

1. Clone the repository

   ```bash
   git clone
   cd homeXpense
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press 'a' for Android
   - Press 'i' for iOS
   - Press 'w' for web

## Project Structure

```
homeXpense/
├── app/                   # Main application code
│   ├── (tabs)/           # Tab-based navigation screens
│   │   ├── index.tsx     # Dashboard screen
│   │   ├── expenses.tsx  # Expenses management
│   │   ├── budget.tsx    # Budget tracking
│   │   └── settings.tsx  # App settings
│   └── _layout.tsx       # Root layout configuration
├── src/
│   └── context/          # Application context providers
│       ├── ExpenseContext.tsx  # Expense management logic
│       └── ThemeContext.tsx    # Theme management
└── assets/               # Static assets
    └── images/          # App images and icons
```

## Features in Detail

### Dashboard

- Overview of total budget and expenses
- Quick access to recent transactions
- Visual representation of spending patterns
- Quick action buttons for common tasks

### Expense Management

- Add new expenses with categories
- View expense history by date
- Delete unwanted expense entries
- Categorize expenses with custom icons

### Budget Tracking

- Set budgets for different categories
- Visual progress bars for budget utilization
- Warnings for near-budget and over-budget situations
- Monthly budget overview

### Settings

- Data export/import functionality
- Clear all data option
- App customization options
- Version information

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.
