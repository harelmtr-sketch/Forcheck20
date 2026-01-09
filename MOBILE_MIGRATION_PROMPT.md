# Forcheck Mobile App - Codebase Analysis & Native Mobile Migration Guide

## Executive Summary

Forcheck is a comprehensive dark-mode calisthenics training app built as a **React web application** (TypeScript + Tailwind CSS + Vite). It analyzes workout form from uploaded videos using a real AI backend (Gradio API), provides intelligent scoring and feedback, tracks diet, manages workout plans, and includes social features with friend competition and story sharing. This document explains the current architecture and outlines the required changes to convert it into a **native mobile app** (React Native).

---

## 📊 Current Architecture Overview

### **Tech Stack**
- **Framework**: React 18.3.1 (web)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4.1
- **Build Tool**: Vite 6.3.5
- **State Management**: React hooks (useState, useEffect) with props drilling
- **UI Components**: Custom components + Radix UI primitives
- **Animations**: Motion (formerly Framer Motion) v12
- **External API**: @gradio/client for AI video analysis
- **Storage**: localStorage (browser-based)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Canvas Export**: html2canvas for story sharing

### **App Structure**

```
/src/app/
├── App.tsx                    # Main app with tab navigation & centralized state
├── components/
│   ├── CameraScreen.tsx       # Video recording/upload + AI analysis
│   ├── DailyScreen.tsx        # Workout/diet tracking + templates
│   ├── ProfileScreen.tsx      # Stats, history, friends leaderboard
│   ├── SettingsScreen.tsx     # App settings
│   ├── AnalysisResultSheet.tsx # AI analysis results modal
│   ├── DailyBreakdownStory.tsx # Story export for social sharing
│   ├── HumanBodyModel.tsx     # Muscle soreness visualization
│   ├── PlanScreen.tsx         # (Not in current navigation)
│   └── ui/                    # 40+ Radix UI components
├── data/
│   ├── exerciseDatabase.ts    # 68 exercises + 24 workout templates
│   ├── mockFriendsData.ts     # Social features mock data
│   └── profileDatabase.ts     # User profile data
├── utils/
│   ├── aiFormScoring.ts       # Gradio API integration
│   ├── workoutScoring.ts      # Workout score calculation
│   ├── dailyScoring.ts        # Daily score calculation
│   └── workoutStorage.ts      # localStorage utilities
└── styles/
    ├── theme.css              # CSS variables for dark/light mode
    ├── fonts.css              # Font imports
    └── tailwind.css           # Tailwind configuration
```

---

## 🎯 Key Features & Implementation Details

### 1. **State Management** (Centralized in App.tsx)

**Current Implementation:**
```typescript
// App.tsx - State lifted to parent component
const [exercises, setExercises] = useState<Exercise[]>([]);
const [meals, setMeals] = useState<Meal[]>([]);
const [muscleStatus, setMuscleStatus] = useState<MuscleStatus[]>([]);
const [darkMode, setDarkMode] = useState(true);
// 20+ settings states...

// Passed down to child components via props
<DailyScreen 
  exercises={exercises} 
  setExercises={setExercises}
  meals={meals}
  setMeals={setMeals}
  // ... more props
/>
```

**Data Models:**
```typescript
interface Exercise {
  name: string;
  sets: number;
  reps: number;
  score: number | null; // AI-generated score
  timestamp?: string;
  fromTemplate?: boolean;
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  score: number;
}

interface MuscleStatus {
  name: string;
  key: string;
  status: 'ready' | 'sore' | 'recovering';
  lastTrained: string;
  setsToday: number;
}

interface ArchivedWorkout {
  id: string;
  date: string;
  exercises: Exercise[];
  totalScore: number;
  cCoefficient: number;
  progressPic?: string; // Base64
}
```

---

### 2. **Navigation System**

**Current Implementation (Web):**
- Tab-based navigation using simple state switching
- Bottom navigation bar with 3 tabs: Daily, Camera, Profile
- Separate "Settings" view (overlay, not a tab)
- No routing library (manual view switching)

```typescript
type Tab = 'camera' | 'daily' | 'profile';
type View = Tab | 'settings';

const [activeTab, setActiveTab] = useState<Tab>('camera');
const [currentView, setCurrentView] = useState<View>('camera');

const renderScreen = () => {
  switch (currentView) {
    case 'camera': return <CameraScreen />;
    case 'daily': return <DailyScreen />;
    case 'profile': return <ProfileScreen />;
    case 'settings': return <SettingsScreen />;
  }
};
```

---

### 3. **Camera & Video Analysis**

**Current Implementation (CameraScreen.tsx):**
- Uses browser `getUserMedia` API for camera access
- MediaRecorder API for video recording
- File input fallback when camera unavailable
- Sends video Blob to Gradio AI backend via `@gradio/client`

```typescript
// Start camera
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
  audio: false
});
videoRef.current.srcObject = stream;

// Record video
const mediaRecorder = new MediaRecorder(stream);
mediaRecorder.ondataavailable = (e) => recordedChunksRef.current.push(e.data);

// Send to AI backend (aiFormScoring.ts)
import { Client } from '@gradio/client';
const app = await Client.connect("https://gibil-pushup-prototype.hf.space");
const result = await app.predict("/analyze", [videoBlob]);
```

**AI Backend Response:**
```json
{
  "ok": true,
  "rep_count": 12,
  "pushup_score": 85,
  "rep_events": [
    { "pushup_score": 87 },
    { "pushup_score": 83 }
  ]
}
```

**Form Analysis Result:**
```typescript
interface FormAnalysisResult {
  score: number;        // 0-100
  sets: number;         // Rep count from AI
  feedback: string;     // "Excellent form!"
  strengths: string[];  // ["Controlled movement", "Good range of motion"]
  improvements: string[]; // ["Keep core tight", "Full ROM"]
}
```

---

### 4. **Exercise Database & Templates**

**68 Exercises** (exerciseDatabase.ts):
```typescript
interface ExerciseData {
  id: string;
  name: string;
  category: 'push' | 'pull' | 'legs' | 'core' | 'full-body';
  primaryMuscles: string[];   // ['chest', 'triceps']
  secondaryMuscles: string[]; // ['front-delts', 'core']
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: 'bodyweight' | 'weights' | 'resistance-band' | 'none';
  baseReps: number;
  baseSets: number;
  emoji: string;
}
```

**24 Workout Templates** (scientifically designed):
- Categories: Push, Pull, Legs, Full-Body, Core, Functional
- Each template has 4-6 exercises
- Users can create custom templates

---

### 5. **Scoring System**

**Workout Score Calculation** (workoutScoring.ts):
```typescript
// Three-tier scoring system:
1. Individual exercise scores (from AI analysis, 0-100)
2. Workout score = weighted average of all exercises
3. C Coefficient = muscle balance multiplier (0-1)

Final Score = Workout Score × C Coefficient
```

**Daily Score** (dailyScoring.ts):
```typescript
Daily Score = (Workout Score × 0.7) + (Diet Score × 0.3)

Diet Score factors:
- Calorie target adherence
- Protein target adherence
- Meal logging consistency
```

**Dynamic Dopamine System**:
- Scores adapt based on template vs custom workouts
- Score thresholds change as workout progresses
- Example: 90+ = "Excellent" becomes harder to achieve as sets increase

---

### 6. **Social Features**

**Friends System** (mockFriendsData.ts):
- Instagram-style story bubbles
- Friend leaderboards (weekly average scores)
- Daily breakdown stories
- Story export to image (html2canvas)

```typescript
interface FriendData {
  id: string;
  name: string;
  avatar: string;
  todayScore: number;
  weeklyAverage: number;
  hasStory: boolean;
  storyViewed: boolean;
  currentStory?: FriendStory;
}

interface FriendStory {
  dailyScore: number;
  workoutScore: number;
  dietScore: number;
  exercises: Exercise[];
  meals: Meal[];
  profilePic?: string;
}
```

**Story Export** (DailyBreakdownStory.tsx):
- Uses html2canvas to convert React component to image
- Downloads as PNG for social sharing
- Displays workout + diet breakdown with scores

---

### 7. **Storage & Persistence**

**Current Implementation:**
- Uses browser `localStorage` for all data
- Auto-saves workout on every change
- Clears data daily (new day = fresh slate)

```typescript
// workoutStorage.ts
const STORAGE_KEY = 'forcheck_current_workout';

localStorage.setItem(STORAGE_KEY, JSON.stringify({
  exercises,
  meals,
  muscleStatus,
  date: new Date().toISOString()
}));
```

**Stored Data:**
- Current workout session (exercises, meals, muscle status)
- Archived workouts (history)
- Custom templates
- User settings
- Saved meals

---

### 8. **UI/UX Design**

**Design System:**
- Dark mode by default (purple/blue gradient background)
- Glowing white accents on active tabs
- Mobile-first: 448px max-width container
- Smooth animations (Motion/Framer Motion)
- Premium TikTok-ready result screens

**Tailwind CSS v4** (theme.css):
```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: #030213;
  /* 50+ CSS variables for theming */
}
```

**Key UI Components:**
- AnalysisResultSheet: Circular score gauge, count-up animations, staggered reveals
- HumanBodyModel: Interactive 3D muscle visualization (SVG-based)
- DailyBreakdownStory: Export-ready story cards
- 40+ Radix UI components (dialogs, sheets, cards, buttons)

---

## 🔧 Required Changes for Native Mobile (React Native)

### **1. Framework Migration: React → React Native**

| **Web (Current)** | **Mobile (Required)** |
|-------------------|----------------------|
| React 18.3.1 | React Native 0.73+ |
| HTML/CSS/DOM | Native UI components |
| Tailwind CSS | NativeWind OR React Native StyleSheets |
| Vite | Metro bundler |
| Browser APIs | Native modules |

---

### **2. Navigation System**

**Replace manual state switching with React Navigation:**

```typescript
// BEFORE (Web)
const [currentView, setCurrentView] = useState('camera');

// AFTER (React Native)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

<NavigationContainer>
  <Tab.Navigator>
    <Tab.Screen name="Daily" component={DailyScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
</NavigationContainer>
```

**Additional navigation needs:**
- Stack navigator for Settings (modal presentation)
- Nested navigators for sub-screens (templates, exercise picker, etc.)

---

### **3. Camera & Video Recording**

**Replace browser APIs with React Native libraries:**

| **Web API** | **React Native Alternative** |
|------------|------------------------------|
| `getUserMedia` | `expo-camera` or `react-native-vision-camera` |
| `MediaRecorder` | Built-in camera recording |
| `<video>` element | `<Video>` from `expo-av` or `react-native-video` |
| File input | `expo-image-picker` or `react-native-document-picker` |

**Example Migration:**

```typescript
// BEFORE (Web - CameraScreen.tsx)
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
videoRef.current.srcObject = stream;

// AFTER (React Native)
import { Camera } from 'expo-camera';

const [hasPermission, setHasPermission] = useState(null);
const cameraRef = useRef(null);

useEffect(() => {
  (async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
}, []);

<Camera 
  ref={cameraRef} 
  style={styles.camera}
  type={Camera.Constants.Type.back}
/>

// Record video
const video = await cameraRef.current.recordAsync();
```

---

### **4. AI Backend Integration (Gradio)**

**Keep @gradio/client library** (works in React Native):
- No major changes needed for API calls
- FormData and Blob work in React Native
- Network requests remain the same

**Potential optimizations:**
- Add retry logic for unstable connections
- Implement progress tracking for uploads
- Add offline queue for failed uploads

---

### **5. Storage & Persistence**

**Replace localStorage with AsyncStorage or SQLite:**

| **Web** | **React Native** |
|---------|------------------|
| `localStorage` | `@react-native-async-storage/async-storage` |
| No database | `expo-sqlite` (for complex queries) |
| No secure storage | `expo-secure-store` (for sensitive data) |

**Example Migration:**

```typescript
// BEFORE (Web - workoutStorage.ts)
localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
const stored = localStorage.getItem(STORAGE_KEY);

// AFTER (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
const stored = await AsyncStorage.getItem(STORAGE_KEY);
```

**Database recommendation:**
- Use AsyncStorage for simple key-value pairs (settings, current workout)
- Use SQLite for complex data (archived workouts, exercise history, templates)

---

### **6. Styling System**

**Option A: NativeWind (Tailwind for React Native)**
```typescript
// Minimal migration - keeps Tailwind syntax
<View className="flex-1 bg-gray-900 p-4">
  <Text className="text-white text-2xl font-bold">Hello</Text>
</View>
```

**Option B: React Native StyleSheet**
```typescript
// More performant, but requires full rewrite
<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' }
});
```

**Recommendation:** Use **NativeWind** to minimize migration effort.

---

### **7. UI Components Migration**

**Radix UI → React Native equivalents:**

| **Radix UI (Web)** | **React Native Alternative** |
|--------------------|------------------------------|
| `@radix-ui/react-dialog` | `react-native-modal` or RN `Modal` |
| `@radix-ui/react-tabs` | `@react-navigation/material-top-tabs` |
| `@radix-ui/react-progress` | `react-native-progress` |
| `@radix-ui/react-slider` | `@react-native-community/slider` |
| `@radix-ui/react-switch` | RN `Switch` (built-in) |
| `@radix-ui/react-scroll-area` | RN `ScrollView` (built-in) |

**Custom components to migrate:**
- Button, Card, Input → Recreate with RN `TouchableOpacity`, `View`, `TextInput`
- Sheet (bottom drawer) → `@gorhom/bottom-sheet`
- Accordion → Custom implementation or `react-native-collapsible`

---

### **8. Animations**

**Replace Motion/Framer Motion with React Native Animated:**

| **Web** | **React Native** |
|---------|------------------|
| `motion` (Framer Motion) | `react-native-reanimated` (v2/v3) |
| CSS transitions | `Animated.timing()` |
| Gesture handling (web) | `react-native-gesture-handler` |

**Example Migration:**

```typescript
// BEFORE (Web - AnalysisResultSheet.tsx)
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// AFTER (React Native)
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

const opacity = useSharedValue(0);
const translateY = useSharedValue(20);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
  translateY.value = withTiming(0, { duration: 300 });
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ translateY: translateY.value }]
}));

<Animated.View style={animatedStyle}>
  {/* Content */}
</Animated.View>
```

---

### **9. Charts & Visualizations**

**Recharts → React Native alternatives:**

| **Web** | **React Native** |
|---------|------------------|
| `recharts` | `react-native-chart-kit` |
| | `victory-native` (more powerful) |
| | `react-native-svg-charts` |

**Example:**
```typescript
// BEFORE (Web - ProfileScreen.tsx)
import { LineChart, Line } from 'recharts';

// AFTER (React Native)
import { LineChart } from 'react-native-chart-kit';
```

---

### **10. Image Handling**

**Replace html2canvas with React Native solutions:**

| **Feature** | **Web** | **React Native** |
|------------|---------|------------------|
| Image picker | `<input type="file">` | `expo-image-picker` |
| Capture screenshot | `html2canvas` | `react-native-view-shot` |
| Image export | `canvas.toBlob()` | `FileSystem.writeAsStringAsync()` |
| Share image | Download link | `expo-sharing` |

**Story Export Migration:**

```typescript
// BEFORE (Web - DailyBreakdownStory.tsx)
import html2canvas from 'html2canvas';
const canvas = await html2canvas(elementRef.current);
const blob = await canvas.toBlob();

// AFTER (React Native)
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const uri = await viewShotRef.current.capture();
await Sharing.shareAsync(uri);
```

---

### **11. Icons**

**Lucide React → Native alternatives:**

| **Web** | **React Native** |
|---------|------------------|
| `lucide-react` | `@expo/vector-icons` (includes Lucide) |
| | `react-native-vector-icons` |

```typescript
// BEFORE (Web)
import { Camera, BarChart3 } from 'lucide-react';

// AFTER (React Native)
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="camera-outline" size={24} />
```

---

### **12. Permissions Handling**

**Add explicit permission requests:**

```typescript
// Camera permissions
import * as Camera from 'expo-camera';
const { status } = await Camera.requestCameraPermissionsAsync();

// Media library (for saving videos)
import * as MediaLibrary from 'expo-media-library';
const { status } = await MediaLibrary.requestPermissionsAsync();

// Notifications (for workout reminders)
import * as Notifications from 'expo-notifications';
const { status } = await Notifications.requestPermissionsAsync();
```

**Add to app.json (Expo) or AndroidManifest.xml / Info.plist:**
```json
{
  "expo": {
    "permissions": [
      "CAMERA",
      "MEDIA_LIBRARY",
      "NOTIFICATIONS"
    ]
  }
}
```

---

### **13. State Management Upgrade (Recommended)**

**Current web app uses props drilling** (20+ props passed down).

**For mobile, consider upgrading to:**
- **Zustand** (lightweight, TypeScript-friendly)
- **Redux Toolkit** (if you need time-travel debugging)
- **React Context** (if staying simple)

**Example with Zustand:**

```typescript
// BEFORE (Web - App.tsx)
const [exercises, setExercises] = useState<Exercise[]>([]);
const [meals, setMeals] = useState<Meal[]>([]);
// Pass as props...

// AFTER (React Native - useWorkoutStore.ts)
import create from 'zustand';

interface WorkoutStore {
  exercises: Exercise[];
  meals: Meal[];
  addExercise: (exercise: Exercise) => void;
  addMeal: (meal: Meal) => void;
}

const useWorkoutStore = create<WorkoutStore>((set) => ({
  exercises: [],
  meals: [],
  addExercise: (exercise) => set((state) => ({ 
    exercises: [...state.exercises, exercise] 
  })),
  addMeal: (meal) => set((state) => ({ 
    meals: [...state.meals, meal] 
  })),
}));

// Usage in any component (no props!)
const { exercises, addExercise } = useWorkoutStore();
```

---

### **14. Platform-Specific Features**

**Leverage native mobile capabilities:**

| **Feature** | **Library** | **Use Case** |
|------------|------------|--------------|
| Haptic feedback | `expo-haptics` | Vibrate on score milestones |
| Background tasks | `expo-task-manager` | Auto-save workouts in background |
| Local notifications | `expo-notifications` | Workout reminders |
| In-app purchases | `react-native-iap` | Premium features |
| Biometric auth | `expo-local-authentication` | Protect user data |
| App state detection | `@react-native-community/netinfo` | Pause video upload on offline |

---

### **15. Testing & Deployment**

**Web (Current):**
- Vite build → static files
- Deploy to Vercel/Netlify

**Mobile (Required):**
- **Expo:** `expo build` → APK/IPA
- **Bare React Native:** Xcode (iOS) + Android Studio
- **App Stores:** Apple App Store + Google Play Store
- **OTA Updates:** Expo Updates or CodePush

---

## 📋 Migration Checklist

### **Phase 1: Core Infrastructure**
- [ ] Initialize React Native project (Expo recommended)
- [ ] Set up navigation (React Navigation)
- [ ] Migrate styling system (NativeWind or StyleSheets)
- [ ] Replace localStorage with AsyncStorage
- [ ] Set up state management (Zustand/Redux)

### **Phase 2: UI Components**
- [ ] Recreate Button, Card, Input components
- [ ] Migrate all Radix UI components
- [ ] Set up bottom sheet (for modals)
- [ ] Migrate theme system (dark mode)
- [ ] Test responsive layouts on different screen sizes

### **Phase 3: Features**
- [ ] Migrate Camera screen (expo-camera)
- [ ] Migrate Daily screen (workout/diet tracking)
- [ ] Migrate Profile screen (stats, leaderboards)
- [ ] Migrate Settings screen
- [ ] Migrate AnalysisResultSheet (animations)

### **Phase 4: Data & APIs**
- [ ] Test Gradio API integration
- [ ] Set up SQLite for workout history
- [ ] Implement data persistence (AsyncStorage + SQLite)
- [ ] Add offline support
- [ ] Migrate exercise database

### **Phase 5: Advanced Features**
- [ ] Migrate story export (ViewShot)
- [ ] Add sharing functionality (expo-sharing)
- [ ] Migrate charts (react-native-chart-kit)
- [ ] Migrate HumanBodyModel (SVG)
- [ ] Add haptic feedback

### **Phase 6: Polish**
- [ ] Migrate all animations (Reanimated)
- [ ] Add permissions handling
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Optimize performance (useMemo, useCallback)

### **Phase 7: Testing & Deployment**
- [ ] Test on iOS simulator/device
- [ ] Test on Android emulator/device
- [ ] Set up CI/CD (Expo EAS Build)
- [ ] Prepare App Store listings
- [ ] Submit to app stores

---

## 🚀 Recommended Tech Stack (React Native)

### **Core**
- **Framework:** React Native 0.73+ with Expo (managed workflow)
- **Language:** TypeScript
- **Navigation:** React Navigation v6
- **State:** Zustand or Redux Toolkit
- **Styling:** NativeWind (Tailwind) or StyleSheet

### **UI & Animation**
- **Animations:** React Native Reanimated v3
- **Gestures:** React Native Gesture Handler
- **Modals:** @gorhom/bottom-sheet
- **Charts:** victory-native or react-native-chart-kit
- **Icons:** @expo/vector-icons

### **Media & Camera**
- **Camera:** expo-camera or react-native-vision-camera
- **Video:** expo-av
- **Image Picker:** expo-image-picker
- **Screenshots:** react-native-view-shot

### **Storage**
- **Simple:** @react-native-async-storage/async-storage
- **Complex:** expo-sqlite
- **Secure:** expo-secure-store

### **Native Features**
- **Haptics:** expo-haptics
- **Notifications:** expo-notifications
- **Sharing:** expo-sharing
- **Permissions:** expo-permissions

### **Backend**
- **AI Analysis:** @gradio/client (keep existing)
- **HTTP:** axios or fetch (built-in)

---

## 💡 Key Considerations

### **Performance**
- React Native is slower than native (Swift/Kotlin) but faster than webviews
- Use `useMemo` and `useCallback` for expensive calculations
- Optimize FlatList (virtualization) for long lists
- Use Hermes engine (JavaScript optimizer)

### **Bundle Size**
- React Native apps are larger (~50-100MB) than web apps
- Use code splitting and lazy loading
- Optimize images (use WebP format)

### **Platform Differences**
- iOS and Android have different UI paradigms
- Test on both platforms throughout development
- Use Platform-specific code when needed:
  ```typescript
  import { Platform } from 'react-native';
  const fontSize = Platform.OS === 'ios' ? 16 : 14;
  ```

### **Offline Support**
- Mobile apps should work offline
- Queue AI requests when offline
- Sync data when connection restores
- Use NetInfo to detect connectivity

### **App Store Requirements**
- Apple: Privacy policy, app review (can take 1-7 days)
- Google: Less strict, faster approval
- Both require developer accounts ($99/year for Apple, $25 one-time for Google)

---

## 🎓 Learning Resources

- **React Native Docs:** https://reactnative.dev/
- **Expo Docs:** https://docs.expo.dev/
- **React Navigation:** https://reactnavigation.org/
- **Reanimated:** https://docs.swmansion.com/react-native-reanimated/
- **NativeWind:** https://www.nativewind.dev/

---

## ⏱️ Estimated Migration Time

- **Full migration:** 4-8 weeks (solo developer)
- **Phase 1-3 (MVP):** 2-3 weeks
- **Phase 4-7 (polish + deploy):** 2-5 weeks

---

## 🔑 Critical Success Factors

1. **Start with Expo** (managed workflow) - easier to begin, can always eject
2. **Migrate incrementally** - one screen at a time
3. **Test on real devices** - simulators don't catch all issues
4. **Keep web version** - easier to debug/test during migration
5. **Focus on UX** - mobile users expect smooth, native-feeling interactions

---

This document provides a complete roadmap for migrating Forcheck from a React web app to a production-ready React Native mobile app. The core business logic (scoring, AI integration, exercise database) can be reused with minimal changes, while the UI and platform-specific features require full rewrites using React Native equivalents.
