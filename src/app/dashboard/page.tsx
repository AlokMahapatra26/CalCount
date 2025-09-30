'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, TrendingUp, Target } from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { calculateNutritionGoals } from '@/lib/calculations';
import { FoodEntry, FoodItem, UserProfile } from '@/lib/types';
import { format, subDays, startOfDay } from 'date-fns';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [entries, setEntries] = useState<FoodEntry[]>([]);

  useEffect(() => {
    setProfile(StorageManager.getUserProfile());
    setFoods(StorageManager.getFoodItems());
    setEntries(StorageManager.getFoodEntries());
  }, []);

  const calculateDailyStats = (date: string) => {
    const dayEntries = entries.filter(entry => entry.date === date);
    
    return dayEntries.reduce((totals, entry) => {
      const food = foods.find(f => f.id === entry.foodId);
      if (!food) return totals;
      
      const multiplier = entry.quantity / 100;
      return {
        calories: totals.calories + (food.caloriesPer100g * multiplier),
        protein: totals.protein + (food.proteinPer100g * multiplier),
        carbs: totals.carbs + (food.carbsPer100g * multiplier),
        fat: totals.fat + (food.fatPer100g * multiplier),
        entries: totals.entries + 1
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 });
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      days.push({
        date,
        displayDate: format(subDays(new Date(), i), 'MMM dd'),
        ...calculateDailyStats(date)
      });
    }
    return days;
  };

  const weekData = getLast7Days();
  const goals = profile ? calculateNutritionGoals(profile) : null;
  const todayStats = calculateDailyStats(format(new Date(), 'yyyy-MM-dd'));

  const weeklyAverages = {
    calories: weekData.reduce((sum, day) => sum + day.calories, 0) / 7,
    protein: weekData.reduce((sum, day) => sum + day.protein, 0) / 7,
    carbs: weekData.reduce((sum, day) => sum + day.carbs, 0) / 7,
    fat: weekData.reduce((sum, day) => sum + day.fat, 0) / 7,
    entries: weekData.reduce((sum, day) => sum + day.entries, 0) / 7
  };

  if (!profile) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No Profile Found</h2>
              <p className="text-muted-foreground">
                Create your profile to view dashboard statistics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Today&apos;s Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goals && (
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span>{Math.round(todayStats.calories)} / {goals.calories}</span>
                </div>
                <Progress value={(todayStats.calories / goals.calories) * 100} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Protein</span>
                  <span>{Math.round(todayStats.protein)}g / {goals.protein}g</span>
                </div>
                <Progress value={(todayStats.protein / goals.protein) * 100} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Carbs</span>
                  <span>{Math.round(todayStats.carbs)}g / {goals.carbs}g</span>
                </div>
                <Progress value={(todayStats.carbs / goals.carbs) * 100} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fat</span>
                  <span>{Math.round(todayStats.fat)}g / {goals.fat}g</span>
                </div>
                <Progress value={(todayStats.fat / goals.fat) * 100} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            7-Day Averages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{Math.round(weeklyAverages.calories)}</div>
              <div className="text-xs text-muted-foreground">Avg Calories</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{Math.round(weeklyAverages.protein)}g</div>
              <div className="text-xs text-muted-foreground">Avg Protein</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{Math.round(weeklyAverages.carbs)}g</div>
              <div className="text-xs text-muted-foreground">Avg Carbs</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{Math.round(weeklyAverages.fat)}g</div>
              <div className="text-xs text-muted-foreground">Avg Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weekData.map(day => (
              <div key={day.date} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{day.displayDate}</div>
                  <Badge variant="secondary">
                    {day.entries} meals
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{Math.round(day.calories)} cal</div>
                  <div className="text-xs text-muted-foreground">
                    P: {Math.round(day.protein)}g • C: {Math.round(day.carbs)}g • F: {Math.round(day.fat)}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{foods.length}</div>
              <div className="text-xs text-muted-foreground">Food Items</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold">{entries.length}</div>
              <div className="text-xs text-muted-foreground">Total Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
