# MindfulBite 🍎
**Smart Calorie Tracking Powered by AI**

MindfulBite is an advanced calorie and nutrition tracker built with React Native (Expo) that uses Google's Gemini AI to analyze food photos and automatically log meals. It features a beautiful, dynamic UI, robust state management, and offline persistence.

## 🌟 Key Features

*   **📸 AI Food Analysis**: Snap a photo of your meal, and the Gemini API identifies the food and estimates calories, protein, carbs, and fat.
*   **📊 Smart Dashboard**: Visualize your daily progress with animated rings and a timeline of your meals.
*   **📈 Weekly Insights**: Track your history with interactive charts to see trends over the last 7 days.
*   **💧 Water Tracker**: Stay hydrated with a dedicated tracker that resets daily and logs history.
*   **🛒 Shopping List**: Manage your groceries with a persistent shopping list that survives app restarts.
*   **🔔 Smart Notifications**: Customizable reminders for meals and hydration to keep you on track.
*   **🏆 Achievements**: Earn badges for streaks and healthy habits.
*   **⚙️ Personalized Goals**: Set and edit your calorie and macro targets based on your body stats using the Mifflin-St Jeor equation.

## 🛠 Tech Stack

*   **Framework**: [Expo](https://expo.dev/) (React Native)
*   **Language**: TypeScript
*   **State Management**: Redux Toolkit
*   **Persistence**: AsyncStorage
*   **AI**: Google Gemini API
*   **Navigation**: Expo Router (File-based routing)
*   **Charts**: react-native-chart-kit

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS recommended)
*   Expo Go app on your iOS or Android device

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SammedDoshi03/MindfulBite.git
    cd MindfulBite
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (copy from `.env.example`) and add your Google Gemini API Key:
    ```bash
    EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the App**
    ```bash
    npm start
    ```
    Scan the QR code with the Expo Go app on your phone to launch MindfulBite!

## 📱 Project Structure

```
MindfulBite/
├── app/                  # Screens and Navigation (Expo Router)
│   ├── (tabs)/           # Main Tab Navigation
│   ├── (auth)/           # Authentication Screens
│   └── ...               # Feature Screens (Water, History, etc.)
├── components/           # Reusable UI Components
├── store/                # Redux State Management
│   ├── slices/           # Feature Slices (Log, Water, Auth)
│   └── store.ts          # Store Configuration
├── services/             # External Services (Gemini API)
└── assets/               # Images and Fonts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
Built with ❤️ using React Native & Gemini AI
