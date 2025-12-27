import { Apple, TrendingUp, Dumbbell, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface MacroData {
  name: string;
  current: number;
  target: number;
  color: string;
}

export function DietScreen() {
  const macros: MacroData[] = [
    { name: 'Protein', current: 145, target: 180, color: 'bg-blue-500' },
    { name: 'Carbs', current: 220, target: 250, color: 'bg-green-500' },
    { name: 'Fats', current: 55, target: 70, color: 'bg-orange-500' },
  ];

  const todaysMeals = [
    {
      name: 'Breakfast',
      time: '8:00 AM',
      items: ['Oatmeal with banana', 'Protein shake', '2 eggs'],
      calories: 520,
    },
    {
      name: 'Lunch',
      time: '1:00 PM',
      items: ['Grilled chicken breast', 'Brown rice', 'Mixed vegetables'],
      calories: 650,
    },
    {
      name: 'Snack',
      time: '4:00 PM',
      items: ['Greek yogurt', 'Almonds'],
      calories: 280,
    },
  ];

  const totalCalories = 1450;
  const targetCalories = 2400;
  const caloriesProgress = (totalCalories / targetCalories) * 100;
  
  // Training day logic
  const isTrainingDay = true;
  const proteinDeficit = macros[0].target - macros[0].current;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="mb-2 font-bold">Nutrition</h1>
        <p className="text-muted-foreground font-medium">
          Track your macros and stay on target
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
        {/* Training Day Indicator */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/15 to-gray-100/10 border border-white/30 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            {isTrainingDay ? (
              <>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Dumbbell className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Today is a Training Day</p>
                  <p className="text-xs text-gray-300">Higher protein & carbs recommended</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Today is a Rest Day</p>
                  <p className="text-xs text-gray-300">Lower carbs, maintain protein</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Calories Card */}
        <Card className="p-6 bg-gradient-to-br from-white/15 to-gray-100/10 border-white/40 shadow-xl shadow-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-medium">Daily Calories</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {totalCalories}
                </span>
                <span className="text-muted-foreground font-medium">/ {targetCalories}</span>
              </div>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <Apple className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            </div>
          </div>
          <Progress value={caloriesProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {targetCalories - totalCalories} calories remaining
          </p>
        </Card>

        {/* Training-Linked Nutrition Tip */}
        {proteinDeficit > 20 && (
          <div className="bg-orange-500/15 border border-orange-400/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h4 className="text-orange-400 mb-1 font-bold">Nutrition Alert</h4>
                <p className="text-sm text-orange-300/90 font-medium">
                  Low protein today ({proteinDeficit}g short) → recovery may be slower tomorrow. Consider adding a protein shake!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Macros */}
        <div>
          <h3 className="mb-4">Macronutrients</h3>
          <div className="space-y-3">
            {macros.map((macro) => {
              const percentage = (macro.current / macro.target) * 100;
              return (
                <Card key={macro.name} className="p-4 bg-card border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{macro.name}</span>
                    <span className="text-sm text-muted-foreground font-medium">
                      {macro.current}g / {macro.target}g
                    </span>
                  </div>
                  <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${macro.color} transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Today's Meals */}
        <div>
          <h3 className="mb-4">Today's Meals</h3>
          <div className="space-y-3">
            {todaysMeals.map((meal, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4>{meal.name}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{meal.calories}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                </div>
                <ul className="space-y-1 mt-3">
                  {meal.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-sm text-muted-foreground font-medium"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Hydration */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-3">
            <h4>Hydration</h4>
            <span className="text-sm text-muted-foreground font-medium">6 / 8 glasses</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < 6 ? 'bg-blue-500' : 'bg-secondary'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Weekly Insights */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-green-500 mb-1 font-bold">Great Progress!</h4>
              <p className="text-sm text-green-400/80 font-medium">
                You're maintaining a consistent calorie intake. Keep it up for optimal recovery and performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
