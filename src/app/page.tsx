'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { calculateNutritionGoals } from '@/lib/calculations';
import { FoodEntry, FoodItem, UserProfile, NutritionGoals } from '@/lib/types';
import { format } from 'date-fns';
import { AddFoodEntryDialog } from '@/components/forms/add-food-entry-dialog';
import Link from 'next/link';

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const userProfile = StorageManager.getUserProfile();
    const allFoods = StorageManager.getFoodItems();
    const allEntries = StorageManager.getFoodEntries();

    setProfile(userProfile);
    setFoods(allFoods);

    if (userProfile) {
      setGoals(calculateNutritionGoals(userProfile));
    }

    const todaysEntries = allEntries.filter(entry => entry.date === today);
    setTodayEntries(todaysEntries);
  }, [today]);

  const calculateDailyTotals = () => {
    return todayEntries.reduce((totals, entry) => {
      const food = foods.find(f => f.id === entry.foodId);
      if (!food) return totals;

      const multiplier = entry.quantity / 100;
      return {
        calories: totals.calories + (food.caloriesPer100g * multiplier),
        protein: totals.protein + (food.proteinPer100g * multiplier),
        carbs: totals.carbs + (food.carbsPer100g * multiplier),
        fat: totals.fat + (food.fatPer100g * multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleDeleteEntry = (entryId: string) => {
    StorageManager.deleteFoodEntry(entryId);
    setTodayEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const totals = calculateDailyTotals();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Icon/Logo Area */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome to Calcount
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Start your wellness journey by creating your personal profile.
              We&apos;ll calculate your nutrition goals and help you track your progress.
            </p>
          </div>

          {/* Action Button */}
          <Button asChild className="w-full h-11">
            <Link href="/profile" className="flex items-center justify-center gap-2">
              Get Started
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </Button>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">Track Progress</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">Set Goals</p>
            </div>
            {/* <div className="text-center">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Stay Healthy</p>
          </div> */}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Today&apos;s Nutrition</h1>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Food
        </Button>
      </div>

      {goals && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={Math.round(totals.calories) > goals.calories ? 'text-destructive font-semibold' : ''}>
                    {Math.round(totals.calories)}
                  </span>
                  <span className="text-muted-foreground">/ {goals.calories}</span>
                </div>
                <Progress
                  value={(totals.calories / goals.calories) * 100}
                  className={
                    totals.calories > goals.calories
                      ? '[&>*]:bg-destructive'
                      : ''
                  }
                />
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Protein</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{Math.round(totals.protein)}g</span>
                  <span className="text-muted-foreground">/ {goals.protein}g</span>
                </div>
                <Progress value={(totals.protein / goals.protein) * 100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Carbs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{Math.round(totals.carbs)}g</span>
                  <span className="text-muted-foreground">/ {goals.carbs}g</span>
                </div>
                <Progress value={(totals.carbs / goals.carbs) * 100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Fat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{Math.round(totals.fat)}g</span>
                  <span className="text-muted-foreground">/ {goals.fat}g</span>
                </div>
                <Progress value={(totals.fat / goals.fat) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {todayEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No meals logged today
            </p>
          ) : (
            <div className="space-y-3">
              {todayEntries.map(entry => {
                const food = foods.find(f => f.id === entry.foodId);
                if (!food) return null;

                const multiplier = entry.quantity / 100;
                const calories = Math.round(food.caloriesPer100g * multiplier);

                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{food.name}</span>
                        <Badge variant="secondary">{entry.mealType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.quantity}g • {calories} cal
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddFoodEntryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        foods={foods}
        onEntryAdded={(entry: any) => {
          setTodayEntries(prev => [...prev, entry]);
        }}
      />
    </div>
  );
}
