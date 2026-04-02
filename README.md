# MindfulBite 🍏
**Smart Calorie Tracking Powered by AI & React Native**

MindfulBite is an advanced, production-grade calorie and nutrition tracker built with Expo. It utilizes **Google's Gemini AI** for computer vision food analysis, a **Native Barcode Scanner**, and an embedded **AI Nutrition Coach**. Designed with premium aesthetics, fluid animations, and a high-performance offline-first data layer.

## 🌟 Next-Gen Features

*   **📸 AI Food Analysis:** Snap a photo of your meal. The Gemini API executes localized image manipulation and vision parsing to automatically detect food and exact macros.
*   **🛒 Native Barcode Scanning:** Powered by `expo-camera` and `@tanstack/react-query`, scan any consumer packaged good to fetch real-time nutritional metrics from the OpenFoodFacts API.
*   **🧠 AI Nutrition Coach:** Chat natively with an embedded Mindful Coach. The AI automatically ingests your daily Redux state context (Calories/Macros consumed) to give personalized health advice.
*   **📊 Historic Tracking & Charts:** Beautiful daily progress SVG rings and interactive weekly UI charts powered by `react-native-chart-kit`.
*   **💨 Lightning Fast Persistence:** Transitioned off AsyncStorage. Built entirely on **Redux Persist + MMKV** for synchronized, sub-millisecond offline storage.
*   **🗂️ CSV Data Exports:** Native ability to format, sanitize, and share tracking history directly via an iOS/Android native share sheet utilizing `expo-sharing`.
*   **✨ Fluid Micro-Animations:** Staggered list renderings and layout transitions elegantly powered by `react-native-reanimated`.
*   **💧 Water Tracker:** Stay hydrated with a dedicated tracker that resets daily and logs history.

## 🛠 Advanced Tech Stack

*   **Framework**: [Expo SDK](https://expo.dev/) (React Native)
*   **Language**: TypeScript
*   **State Management**: Redux Toolkit + MMKV + Redux Persist
*   **Data Fetching:** TanStack React Query v5
*   **AI Engine**: Google Gemini API (gemini-2.5-flash)
*   **Native APIs**: Expo Camera, Expo Image Manipulator, Expo File System, Expo Sharing
*   **Animations**: React Native Reanimated
*   **Routing**: Expo Router (File-based navigation)
*   **CI/CD**: Fully automated pipeline via GitHub Actions and Expo Application Services (EAS)

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS recommended)
*   React Native development environment (Due to native modules like MMKV and Camera, standard Expo Go will not work; create a dev client). 

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
    The app securely expects an AI api key.
    ```bash
    EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run Development Build (Native)**
    Because this project uses native modules (`react-native-mmkv`, `expo-camera`), compile the app:
    ```bash
    npx expo run:ios
    # or
    npx expo run:android
    ```

## 📱 Architecture

```
MindfulBite/
├── app/                  # File-system routing using Expo Router
│   ├── (tabs)/           # Dashboard, Profile
│   ├── ai-coach.tsx      # Gemini powered Chat
│   └── log.tsx           # Barcode & Camera API logic
├── components/           # Extracted Reusable HOCs (Modals, Charts)
├── store/                # MMKV persisted Redux store
├── services/             # Gemini API networking layer
└── .github/workflows/    # Automated CI/CD Pipelines
```

## 🤝 Contributing

Contributions are completely welcome! Please feel free to submit a Pull Request.

---
Built with ❤️ tracking health smarter.
