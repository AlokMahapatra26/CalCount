'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StorageManager } from '@/lib/storage';
import { FoodItem, FoodEntry } from '@/lib/types';
import { format } from 'date-fns';
import { toast } from 'sonner';


interface AddFoodEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foods: FoodItem[];
  onEntryAdded: (entry: FoodEntry) => void;
}

export function AddFoodEntryDialog({ 
  open, 
  onOpenChange, 
  foods, 
  onEntryAdded 
}: AddFoodEntryDialogProps) {
  const [formData, setFormData] = useState({
    foodId: '',
    quantity: '',
    mealType: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  ;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.foodId) newErrors.foodId = 'Please select a food';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity required';
    }
    if (!formData.mealType) newErrors.mealType = 'Please select meal type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newEntry = StorageManager.saveFoodEntry({
      foodId: formData.foodId,
      quantity: parseFloat(formData.quantity),
      mealType: formData.mealType as FoodEntry['mealType'],
      date: formData.date
    });

    onEntryAdded(newEntry);
    
    const selectedFood = foods.find(f => f.id === formData.foodId);
    toast.success("Meal logged", {
      description: `${selectedFood?.name} (${formData.quantity}g) added to ${formData.mealType}.`
    });

    // Reset form
    setFormData({
      foodId: '',
      quantity: '',
      mealType: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setErrors({});
    onOpenChange(false);
  };

  const selectedFood = foods.find(f => f.id === formData.foodId);
  const quantity = parseFloat(formData.quantity) || 0;
  const calories = selectedFood ? Math.round((selectedFood.caloriesPer100g * quantity) / 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Food Entry</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Food Item</Label>
            <Select value={formData.foodId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, foodId: value }))
            }>
              <SelectTrigger className={errors.foodId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a food" />
              </SelectTrigger>
              <SelectContent>
                {foods.map(food => (
                  <SelectItem key={food.id} value={food.id}>
                    {food.name} ({food.caloriesPer100g} cal/100g)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.foodId && (
              <p className="text-sm text-destructive">{errors.foodId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (grams)</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className={errors.quantity ? 'border-destructive' : ''}
                placeholder="100"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select value={formData.mealType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, mealType: value }))
              }>
                <SelectTrigger className={errors.mealType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select meal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
              {errors.mealType && (
                <p className="text-sm text-destructive">{errors.mealType}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          {selectedFood && quantity > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Nutrition Preview</div>
              <div className="text-sm text-muted-foreground">
                Calories: {calories} • 
                Protein: {Math.round((selectedFood.proteinPer100g * quantity) / 100)}g • 
                Carbs: {Math.round((selectedFood.carbsPer100g * quantity) / 100)}g • 
                Fat: {Math.round((selectedFood.fatPer100g * quantity) / 100)}g
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              Log Entry
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
