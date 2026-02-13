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
import { ChevronRight, Search, X } from 'lucide-react-native';
import type { ExerciseData } from '../data/exerciseDatabase';
import { exerciseMenuColors as C } from '../theme/exerciseMenuColors';
import { ScreenShell } from './ScreenShell';
import { TemplateCard } from './TemplateCard';

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
        type: 'exercise' as const,
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
      <ScreenShell>
        <SafeAreaView style={styles.safeArea}>
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
                <ChevronRight size={20} color={C.buttonBlue} style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
            </Animated.View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Choose Exercise</Text>
              <Text style={styles.subtitle}>{totalCount} exercises available</Text>
            </View>
          </View>

          <View style={[styles.searchRow, { borderColor: isFocused ? C.searchBorderFocus : C.searchBorder }]}>
            <Search size={18} color={C.gray500} />
            <TextInput
              placeholder="Search exercises..."
              placeholderTextColor={C.gray500}
              value={searchQuery}
              onChangeText={onChangeSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => onChangeSearch('')} style={styles.clearButton}>
                <X size={16} color={C.gray400} />
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
      </ScreenShell>
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
          <LinearGradient colors={C.tabActiveGradient} style={StyleSheet.absoluteFillObject} />
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

  useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 280,
      delay: index * 50,
      useNativeDriver: true
    }).start();
  }, [entry, index]);

  const animatedStyle = {
    opacity: entry,
    transform: [
      { translateY: entry.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
    ]
  };

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.exerciseCardWrap}>
        <TemplateCard
          title={exercise.name}
          subtitle={`${exercise.baseSets} sets × ${exercise.baseReps} reps`}
          onPress={onPress}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.screen
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
    color: C.white,
    fontSize: 18,
    fontWeight: '700'
  },
  subtitle: {
    color: C.gray400,
    marginTop: 2
  },
  searchRow: {
    marginTop: 16,
    marginHorizontal: 24,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: C.searchBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  searchInput: {
    flex: 1,
    color: C.white,
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
    backgroundColor: C.screen
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.tabInactiveBorder,
    backgroundColor: C.tabInactiveBg,
    marginRight: 8
  },
  pillText: {
    color: C.tabInactiveText,
    fontSize: 11,
    fontWeight: '600'
  },
  activePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.tabActiveBorder,
    marginRight: 8,
    overflow: 'hidden',
    shadowColor: C.buttonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3
  },
  activePillText: {
    color: C.tabActiveText,
    fontSize: 11,
    fontWeight: '600'
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100
  },
  exerciseCardWrap: {
    borderRadius: 16,
    overflow: 'hidden'
  }
});
