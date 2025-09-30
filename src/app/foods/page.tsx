'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { FoodItem } from '@/lib/types';
import { AddFoodDialog } from '@/components/forms/add-food-dialog';
import { toast } from 'sonner';

export default function FoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);


  useEffect(() => {
    const allFoods = StorageManager.getFoodItems();
    setFoods(allFoods);
  }, []);

  const handleDeleteFood = (id: string) => {
    if (confirm('Are you sure you want to delete this food item?')) {
      StorageManager.deleteFoodItem(id);
      setFoods(prev => prev.filter(f => f.id !== id));
    toast.success("Food deleted", {
      description: "The food item has been removed."
    });
    }
  };

  const handleFoodAdded = (food: FoodItem) => {
    setFoods(prev => [...prev, food]);
  };

  const handleFoodUpdated = (updatedFood: FoodItem) => {
    setFoods(prev => prev.map(f => f.id === updatedFood.id ? updatedFood : f));
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Food Database</h1>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Food
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search foods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredFoods.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No foods found matching your search.' : 'No foods added yet.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Food
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFoods.map(food => (
            <Card key={food.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{food.name}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div>Calories: {food.caloriesPer100g}/100g</div>
                      <div>Protein: {food.proteinPer100g}g/100g</div>
                      <div>Carbs: {food.carbsPer100g}g/100g</div>
                      <div>Fat: {food.fatPer100g}g/100g</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingFood(food);
                        setShowAddDialog(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFood(food.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddFoodDialog
        open={showAddDialog}
        onOpenChange={(open:any) => {
          setShowAddDialog(open);
          if (!open) setEditingFood(null);
        }}
        food={editingFood}
        onFoodAdded={handleFoodAdded}
        onFoodUpdated={handleFoodUpdated}
      />
    </div>
  );
}
