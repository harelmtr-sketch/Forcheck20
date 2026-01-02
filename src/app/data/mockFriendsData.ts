import type { Exercise, Meal } from '../App';

export interface FriendStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string;
  timestamp: string;
  dailyScore: number;
  workoutScore: number;
  dietScore: number;
  exercises: Exercise[];
  meals: Meal[];
  profilePic?: string;
  isViewed: boolean;
  isPublic: boolean;
}

export interface FriendData {
  id: string;
  name: string;
  avatar: string;
  profilePic?: string;
  todayScore: number;
  weeklyAverage: number;
  hasStory: boolean;
  storyViewed: boolean;
  isPublic: boolean;
  currentStory?: FriendStory;
}

// Mock friends database with stories
export const mockFriendsDatabase: FriendData[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: '🧑',
    todayScore: 92,
    weeklyAverage: 88,
    hasStory: true,
    storyViewed: false,
    isPublic: true,
    currentStory: {
      id: 'story-1',
      userId: '1',
      userName: 'Alex Chen',
      userAvatar: '🧑',
      date: new Date().toISOString(),
      timestamp: '8:30 AM',
      dailyScore: 92,
      workoutScore: 95,
      dietScore: 89,
      exercises: [
        { name: 'Push-ups', sets: 4, reps: 20, score: 95, timestamp: new Date().toISOString() },
        { name: 'Pull-ups', sets: 3, reps: 12, score: 92, timestamp: new Date().toISOString() },
        { name: 'Dips', sets: 3, reps: 15, score: 97, timestamp: new Date().toISOString() },
      ],
      meals: [
        { name: 'Protein Shake', calories: 350, protein: 40, score: 95 },
        { name: 'Chicken & Rice', calories: 650, protein: 55, score: 88 },
      ],
      isViewed: false,
      isPublic: true,
    }
  },
  {
    id: '2',
    name: 'Sarah Kim',
    avatar: '👩',
    todayScore: 88,
    weeklyAverage: 85,
    hasStory: true,
    storyViewed: false,
    isPublic: true,
    currentStory: {
      id: 'story-2',
      userId: '2',
      userName: 'Sarah Kim',
      userAvatar: '👩',
      date: new Date().toISOString(),
      timestamp: '7:15 AM',
      dailyScore: 88,
      workoutScore: 90,
      dietScore: 86,
      exercises: [
        { name: 'Squats', sets: 4, reps: 15, score: 88, timestamp: new Date().toISOString() },
        { name: 'Lunges', sets: 3, reps: 12, score: 92, timestamp: new Date().toISOString() },
      ],
      meals: [
        { name: 'Oatmeal & Berries', calories: 400, protein: 15, score: 85 },
        { name: 'Salmon Salad', calories: 550, protein: 45, score: 90 },
      ],
      isViewed: false,
      isPublic: true,
    }
  },
  {
    id: '4',
    name: 'Mike Ross',
    avatar: '🧔',
    todayScore: 85,
    weeklyAverage: 82,
    hasStory: true,
    storyViewed: true,
    isPublic: false,
    currentStory: {
      id: 'story-4',
      userId: '4',
      userName: 'Mike Ross',
      userAvatar: '🧔',
      date: new Date().toISOString(),
      timestamp: '6:45 AM',
      dailyScore: 85,
      workoutScore: 87,
      dietScore: 83,
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, score: 85, timestamp: new Date().toISOString() },
        { name: 'Incline Press', sets: 3, reps: 12, score: 88, timestamp: new Date().toISOString() },
      ],
      meals: [
        { name: 'Eggs & Toast', calories: 450, protein: 30, score: 80 },
      ],
      isViewed: true,
      isPublic: false,
    }
  },
  {
    id: '5',
    name: 'Emma Stone',
    avatar: '👱‍♀️',
    todayScore: 82,
    weeklyAverage: 80,
    hasStory: false,
    storyViewed: false,
    isPublic: true,
  },
  {
    id: '6',
    name: 'James Wilson',
    avatar: '👨',
    todayScore: 79,
    weeklyAverage: 76,
    hasStory: true,
    storyViewed: false,
    isPublic: true,
    currentStory: {
      id: 'story-6',
      userId: '6',
      userName: 'James Wilson',
      userAvatar: '👨',
      date: new Date().toISOString(),
      timestamp: '9:00 AM',
      dailyScore: 79,
      workoutScore: 82,
      dietScore: 76,
      exercises: [
        { name: 'Rows', sets: 3, reps: 12, score: 80, timestamp: new Date().toISOString() },
        { name: 'Lat Pulldowns', sets: 3, reps: 15, score: 84, timestamp: new Date().toISOString() },
      ],
      meals: [
        { name: 'Smoothie Bowl', calories: 380, protein: 20, score: 75 },
      ],
      isViewed: false,
      isPublic: true,
    }
  },
];
