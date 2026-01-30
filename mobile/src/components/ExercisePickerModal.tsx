import { useMemo, useRef, useState, useEffect, type ReactNode } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Dumbbell, Search, X } from 'lucide-react-native';
import type { ExerciseData } from '../data/exerciseDatabase';

type ExercisePickerModalProps = {
  visible: boolean;
  exercises: ExerciseData[];
  totalCount: number;
  selectedCategory: string;
  searchQuery: string;
  onChangeSearch: (value: string) => void;
  onSelectCategory: (value: string) => void;
  onSelectExercise: (exercise: ExerciseData) => void;
  onClose: () => void;
};

type ListItem =
  | { type: 'tabs'; key: string }
  | { type: 'exercise'; key: string; exercise: ExerciseData; index: number };

const CATEGORIES = ['all', 'push', 'pull', 'legs', 'core', 'full-body'];

export function ExercisePickerModal({
  visible,
  exercises,
  totalCount,
  selectedCategory,
  searchQuery,
  onChangeSearch,
  onSelectCategory,
  onSelectExercise,
  onClose
}: ExercisePickerModalProps) {
  const [isFocused, setIsFocused] = useState(false);
  const backScale = useRef(new Animated.Value(1)).current;

  const listData = useMemo<ListItem[]>(() => {
    return [
      { type: 'tabs', key: 'tabs' },
      ...exercises.map((exercise, index) => ({
        type: 'exercise',
        key: exercise.id,
        exercise,
        index
      }))
    ];
  }, [exercises]);

  const handleBackPressIn = () => {
    Animated.spring(backScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handleBackPressOut = () => {
    Animated.spring(backScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'tabs') {
      return (
        <View style={styles.tabsRow}>
          {CATEGORIES.map((category) => (
            <CategoryPill
              key={category}
              label={category.toUpperCase()}
              isActive={selectedCategory === category}
              onPress={() => onSelectCategory(category)}
            />
          ))}
        </View>
      );
    }

    return (
      <ExerciseCard
        exercise={item.exercise}
        index={item.index}
        onPress={() => onSelectExercise(item.exercise)}
      />
    );
  };

  return (
    <ModalWrapper visible={visible}>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#0a0f16', '#0b1118', '#0a0f16']} style={StyleSheet.absoluteFillObject} />
        <LinearGradient colors={['rgba(59,130,246,0.12)', 'transparent']} style={styles.blueTint} />
        <View style={styles.orb} />

        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: backScale }] }}>
            <Pressable
              onPress={onClose}
              onPressIn={handleBackPressIn}
              onPressOut={handleBackPressOut}
              style={({ pressed }) => [
                styles.backButton,
                { backgroundColor: pressed ? 'rgba(42,46,56,0.7)' : 'rgba(42,46,56,0.5)' }
              ]}
            >
              <ChevronRight size={20} color="#60a5fa" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
          </Animated.View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Choose Exercise</Text>
            <Text style={styles.subtitle}>{totalCount} exercises available</Text>
          </View>
        </View>

        <View style={[styles.searchRow, { borderColor: isFocused ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.2)' }]}>
          <Search size={18} color="#64748b" />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={onChangeSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onChangeSearch('')} style={styles.clearButton}>
              <X size={16} color="#94a3b8" />
            </Pressable>
          )}
        </View>

        <FlatList
          data={listData}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={styles.listContent}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ModalWrapper>
  );
}

function ModalWrapper({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      {children}
    </Modal>
  );
}

function CategoryPill({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: isActive ? 1.05 : 1, useNativeDriver: true }).start();
  }, [isActive, scale]);

  if (isActive) {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable onPress={onPress} style={styles.activePill}>
          <LinearGradient colors={['rgba(59,130,246,0.35)', 'rgba(37,99,235,0.25)']} style={StyleSheet.absoluteFillObject} />
          <Text style={styles.activePillText}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={onPress} style={styles.pill}>
        <Text style={styles.pillText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function ExerciseCard({ exercise, index, onPress }: { exercise: ExerciseData; index: number; onPress: () => void }) {
  const entry = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 280,
      delay: index * 50,
      useNativeDriver: true
    }).start();
  }, [entry, index]);

  const handlePressIn = () => {
    Animated.spring(press, { toValue: 0.98, useNativeDriver: true }).start();
    Animated.spring(borderAnim, { toValue: 1, useNativeDriver: false }).start();
  };

  const handlePressOut = () => {
    Animated.spring(press, { toValue: 1, useNativeDriver: true }).start();
    Animated.spring(borderAnim, { toValue: 0, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.4)']
  });

  const animatedStyle = {
    opacity: entry,
    transform: [
      { translateY: entry.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
      { scale: press }
    ]
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[styles.exerciseCardWrap, { borderColor }]}>
          <LinearGradient colors={['#0f1419', 'rgba(37,41,50,0.5)']} style={styles.exerciseCard}>
            <View style={styles.exerciseLeft}>
              <View style={styles.exerciseIcon}>
                <Dumbbell size={24} color="#60a5fa" strokeWidth={2} />
              </View>
              <View style={styles.exerciseCopy}>
                <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                <Text style={styles.exerciseSubtitle}>{exercise.baseSets} sets × {exercise.baseReps} reps</Text>
                <View style={styles.tagRow}>
                  {exercise.primaryMuscles.map((muscle) => (
                    <View key={muscle} style={styles.muscleTag}>
                      <Text style={styles.muscleTagText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <ChevronRight size={20} color="#94a3b8" />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1d23'
  },
  blueTint: {
    ...StyleSheet.absoluteFillObject
  },
  orb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(59,130,246,0.15)',
    top: -60,
    right: -40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    marginLeft: 12
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700'
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 2
  },
  searchRow: {
    marginTop: 16,
    marginHorizontal: 24,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(15,20,27,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    marginLeft: 8
  },
  clearButton: {
    padding: 4
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#1a1d23'
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: 8
  },
  pillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600'
  },
  activePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.6)',
    marginRight: 8,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3
  },
  activePillText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600'
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100
  },
  exerciseCardWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)'
  },
  exerciseCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  exerciseCopy: {
    flexShrink: 1
  },
  exerciseTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700'
  },
  exerciseSubtitle: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  muscleTag: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4
  },
  muscleTagText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '600'
  }
});
