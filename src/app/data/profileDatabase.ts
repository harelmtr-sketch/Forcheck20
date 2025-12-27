export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  requirement: string;
  category: 'streak' | 'score' | 'volume' | 'social' | 'milestone';
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  todayScore: number;
  weekScore: number;
  streak: number;
  totalWorkouts: number;
  status: 'online' | 'offline';
}

export interface PersonalRecord {
  id: string;
  exercise: string;
  type: 'reps' | 'weight' | 'time' | 'score';
  value: number;
  unit: string;
  date: string;
  emoji: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first-workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    icon: '🎯',
    unlocked: true,
    unlockedDate: 'Dec 20, 2024',
    requirement: '1 workout',
    category: 'milestone'
  },
  {
    id: '7-day-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlocked: true,
    unlockedDate: 'Dec 27, 2024',
    requirement: '7 day streak',
    category: 'streak'
  },
  {
    id: 'perfect-form',
    name: 'Perfect Form',
    description: 'Score 95+ on any exercise',
    icon: '⭐',
    unlocked: true,
    unlockedDate: 'Dec 25, 2024',
    requirement: '95+ score',
    category: 'score'
  },
  {
    id: '30-workouts',
    name: 'Consistency King',
    description: 'Complete 30 total workouts',
    icon: '👑',
    unlocked: false,
    requirement: '30 workouts',
    category: 'volume'
  },
  {
    id: '90-daily-score',
    name: 'Excellence',
    description: 'Achieve 90+ daily score',
    icon: '💎',
    unlocked: true,
    unlockedDate: 'Dec 26, 2024',
    requirement: '90+ daily score',
    category: 'score'
  },
  {
    id: '100-sets',
    name: 'Volume Master',
    description: 'Complete 100 total sets',
    icon: '💪',
    unlocked: false,
    requirement: '100 sets',
    category: 'volume'
  },
  {
    id: '30-day-streak',
    name: 'Iron Will',
    description: 'Maintain a 30-day streak',
    icon: '🛡️',
    unlocked: false,
    requirement: '30 day streak',
    category: 'streak'
  },
  {
    id: 'beat-friend',
    name: 'Competitive',
    description: 'Beat a friend\'s weekly score',
    icon: '⚔️',
    unlocked: true,
    unlockedDate: 'Dec 24, 2024',
    requirement: 'Beat friend',
    category: 'social'
  },
  {
    id: 'perfect-balance',
    name: 'Balanced Beast',
    description: 'Achieve 100% workout balance',
    icon: '⚖️',
    unlocked: false,
    requirement: '100% balance',
    category: 'score'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 10 morning workouts',
    icon: '🌅',
    unlocked: false,
    requirement: '10 morning workouts',
    category: 'milestone'
  },
  {
    id: 'muscle-up-master',
    name: 'Muscle Up Master',
    description: 'Perform 10 muscle-ups in one session',
    icon: '🦅',
    unlocked: false,
    requirement: '10 muscle-ups',
    category: 'milestone'
  },
  {
    id: 'full-body-hero',
    name: 'Full Body Hero',
    description: 'Train all 14 muscle groups in one week',
    icon: '🌟',
    unlocked: false,
    requirement: 'Hit all muscles',
    category: 'milestone'
  }
];

export const friends: Friend[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: '@sarahfit',
    avatar: '👩',
    todayScore: 92,
    weekScore: 615,
    streak: 12,
    totalWorkouts: 45,
    status: 'online'
  },
  {
    id: '2',
    name: 'Mike Torres',
    username: '@miketorres',
    avatar: '👨',
    todayScore: 88,
    weekScore: 580,
    streak: 9,
    totalWorkouts: 38,
    status: 'online'
  },
  {
    id: '3',
    name: 'Emily Watson',
    username: '@emwatson',
    avatar: '👩‍🦰',
    todayScore: 85,
    weekScore: 560,
    streak: 5,
    totalWorkouts: 32,
    status: 'offline'
  },
  {
    id: '4',
    name: 'James Liu',
    username: '@jliu_fit',
    avatar: '🧑',
    todayScore: 78,
    weekScore: 495,
    streak: 3,
    totalWorkouts: 28,
    status: 'offline'
  },
  {
    id: '5',
    name: 'Alex Morgan',
    username: '@alexmorgan',
    avatar: '👤',
    todayScore: 95,
    weekScore: 640,
    streak: 15,
    totalWorkouts: 52,
    status: 'online'
  }
];

export const personalRecords: PersonalRecord[] = [
  {
    id: '1',
    exercise: 'Pull-ups',
    type: 'reps',
    value: 25,
    unit: 'reps',
    date: 'Dec 22, 2024',
    emoji: '🏋️'
  },
  {
    id: '2',
    exercise: 'Push-ups',
    type: 'score',
    value: 98,
    unit: 'score',
    date: 'Dec 25, 2024',
    emoji: '💪'
  },
  {
    id: '3',
    exercise: 'Plank',
    type: 'time',
    value: 180,
    unit: 'seconds',
    date: 'Dec 20, 2024',
    emoji: '⏱️'
  },
  {
    id: '4',
    exercise: 'Pistol Squat',
    type: 'reps',
    value: 15,
    unit: 'reps/leg',
    date: 'Dec 18, 2024',
    emoji: '🦵'
  }
];

export const favoriteExercises = [
  { name: 'Pull-ups', emoji: '🏋️', frequency: 24 },
  { name: 'Push-ups', emoji: '💪', frequency: 28 },
  { name: 'Squats', emoji: '🦵', frequency: 22 },
  { name: 'Plank', emoji: '⏱️', frequency: 20 }
];
