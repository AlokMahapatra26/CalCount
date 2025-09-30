'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StorageManager } from '@/lib/storage';
import { calculateBMI, calculateNutritionGoals } from '@/lib/calculations';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    lifestyle: '',
    goal: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const userProfile = StorageManager.getUserProfile();
    if (userProfile) {
      setProfile(userProfile);
      setFormData({
        name: userProfile.name,
        age: userProfile.age.toString(),
        height: userProfile.height.toString(),
        weight: userProfile.weight.toString(),
        lifestyle: userProfile.lifestyle,
        goal: userProfile.goal
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || parseInt(formData.age) < 10 || parseInt(formData.age) > 120) {
      newErrors.age = 'Age must be between 10 and 120';
    }
    if (!formData.height || parseInt(formData.height) < 100 || parseInt(formData.height) > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }
    if (!formData.weight || parseInt(formData.weight) < 20 || parseInt(formData.weight) > 300) {
      newErrors.weight = 'Weight must be between 20 and 300 kg';
    }
    if (!formData.lifestyle) newErrors.lifestyle = 'Lifestyle is required';
    if (!formData.goal) newErrors.goal = 'Goal is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const profileData: UserProfile = {
      id: profile?.id || '1',
      name: formData.name.trim(),
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      lifestyle: formData.lifestyle as UserProfile['lifestyle'],
      goal: formData.goal as UserProfile['goal'],
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageManager.saveUserProfile(profileData);
    setProfile(profileData);
    
    toast.success("Profile saved successfully", {
      description: "Your nutrition goals have been updated."
    });
  };

  const handleExportData = () => {
    const csvData = StorageManager.exportAllData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrition-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Data exported successfully", {
      description: "Your nutrition data has been downloaded as CSV."
    });
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      StorageManager.clearAllData();
      setProfile(null);
      setFormData({
        name: '',
        age: '',
        height: '',
        weight: '',
        lifestyle: '',
        goal: ''
      });
      
    toast.error("All data cleared", {
      description: "Your nutrition data has been completely removed."
    });
    }
  };

  const bmiData = profile ? calculateBMI(profile.height, profile.weight) : null;
  const goals = profile ? calculateNutritionGoals(profile) : null;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className={errors.age ? 'border-destructive' : ''}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className={errors.height ? 'border-destructive' : ''}
              />
              {errors.height && (
                <p className="text-sm text-destructive">{errors.height}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className={errors.weight ? 'border-destructive' : ''}
            />
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Lifestyle</Label>
            <Select value={formData.lifestyle} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, lifestyle: value }))
            }>
              <SelectTrigger className={errors.lifestyle ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select your lifestyle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (2x/day or intense)</SelectItem>
              </SelectContent>
            </Select>
            {errors.lifestyle && (
              <p className="text-sm text-destructive">{errors.lifestyle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Goal</Label>
            <Select value={formData.goal} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, goal: value }))
            }>
              <SelectTrigger className={errors.goal ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
            {errors.goal && (
              <p className="text-sm text-destructive">{errors.goal}</p>
            )}
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {bmiData && (
        <Card>
          <CardHeader>
            <CardTitle>Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">BMI</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{bmiData.bmi}</span>
                <Badge variant={
                  bmiData.category === 'normal' ? 'default' :
                  bmiData.category === 'underweight' ? 'secondary' :
                  'destructive'
                }>
                  {bmiData.category.charAt(0).toUpperCase() + bmiData.category.slice(1)}
                </Badge>
              </div>
            </div>

            {bmiData.category !== 'normal' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {bmiData.category === 'underweight' && 
                    'Consider consulting with a healthcare provider about healthy weight gain strategies.'
                  }
                  {bmiData.category === 'overweight' && 
                    'Consider consulting with a healthcare provider about healthy weight management.'
                  }
                  {bmiData.category === 'obese' && 
                    'It\'s recommended to consult with a healthcare provider for personalized advice.'
                  }
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {goals && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Nutrition Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{goals.calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{goals.protein}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{goals.carbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{goals.fat}g</div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleExportData} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export All Data as CSV
          </Button>
          <Button 
            onClick={handleClearAllData} 
            variant="destructive" 
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
