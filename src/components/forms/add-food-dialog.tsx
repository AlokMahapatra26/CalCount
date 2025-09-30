'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StorageManager } from '@/lib/storage';
import { FoodItem } from '@/lib/types';
import { toast } from 'sonner';

interface AddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food?: FoodItem | null;
  onFoodAdded: (food: FoodItem) => void;
  onFoodUpdated: (food: FoodItem) => void;
}

export function AddFoodDialog({ 
  open, 
  onOpenChange, 
  food, 
  onFoodAdded, 
  onFoodUpdated 
}: AddFoodDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    caloriesPer100g: '',
    proteinPer100g: '',
    carbsPer100g: '',
    fatPer100g: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        caloriesPer100g: food.caloriesPer100g.toString(),
        proteinPer100g: food.proteinPer100g.toString(),
        carbsPer100g: food.carbsPer100g.toString(),
        fatPer100g: food.fatPer100g.toString()
      });
    } else {
      setFormData({
        name: '',
        caloriesPer100g: '',
        proteinPer100g: '',
        carbsPer100g: '',
        fatPer100g: ''
      });
    }
    setErrors({});
  }, [food, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Food name is required';
    if (!formData.caloriesPer100g || parseFloat(formData.caloriesPer100g) < 0) {
      newErrors.caloriesPer100g = 'Valid calories value required';
    }
    if (!formData.proteinPer100g || parseFloat(formData.proteinPer100g) < 0) {
      newErrors.proteinPer100g = 'Valid protein value required';
    }
    if (!formData.carbsPer100g || parseFloat(formData.carbsPer100g) < 0) {
      newErrors.carbsPer100g = 'Valid carbs value required';
    }
    if (!formData.fatPer100g || parseFloat(formData.fatPer100g) < 0) {
      newErrors.fatPer100g = 'Valid fat value required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (food) {
      // Update existing food
      const updatedFood: FoodItem = {
        ...food,
        name: formData.name.trim(),
        caloriesPer100g: parseFloat(formData.caloriesPer100g),
        proteinPer100g: parseFloat(formData.proteinPer100g),
        carbsPer100g: parseFloat(formData.carbsPer100g),
        fatPer100g: parseFloat(formData.fatPer100g)
      };
      
      StorageManager.updateFoodItem(food.id, updatedFood);
      onFoodUpdated(updatedFood);
      
    toast.success(`${updatedFood.name} has been updated successfully.`);
    } else {
      // Create new food
      const newFood = StorageManager.saveFoodItem({
        name: formData.name.trim(),
        caloriesPer100g: parseFloat(formData.caloriesPer100g),
        proteinPer100g: parseFloat(formData.proteinPer100g),
        carbsPer100g: parseFloat(formData.carbsPer100g),
        fatPer100g: parseFloat(formData.fatPer100g)
      });
      
      onFoodAdded(newFood);
      
    toast.success(`${newFood.name} has been added to your database.`);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{food ? 'Edit Food' : 'Add New Food'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food-name">Food Name</Label>
            <Input
              id="food-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-destructive' : ''}
              placeholder="e.g., Chicken Breast"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories (per 100g)</Label>
              <Input
                id="calories"
                type="number"
                step="0.1"
                value={formData.caloriesPer100g}
                onChange={(e) => setFormData(prev => ({ ...prev, caloriesPer100g: e.target.value }))}
                className={errors.caloriesPer100g ? 'border-destructive' : ''}
              />
              {errors.caloriesPer100g && (
                <p className="text-sm text-destructive">{errors.caloriesPer100g}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g per 100g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={formData.proteinPer100g}
                onChange={(e) => setFormData(prev => ({ ...prev, proteinPer100g: e.target.value }))}
                className={errors.proteinPer100g ? 'border-destructive' : ''}
              />
              {errors.proteinPer100g && (
                <p className="text-sm text-destructive">{errors.proteinPer100g}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g per 100g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={formData.carbsPer100g}
                onChange={(e) => setFormData(prev => ({ ...prev, carbsPer100g: e.target.value }))}
                className={errors.carbsPer100g ? 'border-destructive' : ''}
              />
              {errors.carbsPer100g && (
                <p className="text-sm text-destructive">{errors.carbsPer100g}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g per 100g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={formData.fatPer100g}
                onChange={(e) => setFormData(prev => ({ ...prev, fatPer100g: e.target.value }))}
                className={errors.fatPer100g ? 'border-destructive' : ''}
              />
              {errors.fatPer100g && (
                <p className="text-sm text-destructive">{errors.fatPer100g}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              {food ? 'Update Food' : 'Add Food'}
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
