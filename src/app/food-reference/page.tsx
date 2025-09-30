'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Utensils, Zap, Salad, Beef } from 'lucide-react';


const indianFoodData = {
  grains: [
    { name: 'Rice (Raw milled)', calories: 356, protein: 6.8, carbs: 78.2, fat: 0.5, diet: 'veg' },
    { name: 'Wheat Flour (Atta)', calories: 320, protein: 12.1, carbs: 69.4, fat: 1.7, diet: 'veg' },
    { name: 'Ragi (Finger Millet)', calories: 321, protein: 7.3, carbs: 72.0, fat: 1.3, diet: 'veg' },
    { name: 'Bajra (Pearl Millet)', calories: 348, protein: 11.6, carbs: 67.5, fat: 5.0, diet: 'veg' },
    { name: 'Semolina (Suji)', calories: 334, protein: 12.7, carbs: 67.7, fat: 1.2, diet: 'veg' },
    { name: 'Brown Rice (Cooked, 1 cup)', calories: 216, protein: 5.0, carbs: 45.0, fat: 1.8, diet: 'veg' },
  ],
  
  legumes: [
    { name: 'Arhar Dal (Toor Dal)', calories: 335, protein: 22.3, carbs: 57.6, fat: 1.7, diet: 'veg' }, // High Protein
    { name: 'Chana Dal (Bengal Gram)', calories: 329, protein: 22.5, carbs: 57.2, fat: 2.8, diet: 'veg' }, // High Protein
    { name: 'Masoor Dal (Red Lentil)', calories: 323, protein: 25.1, carbs: 56.3, fat: 1.1, diet: 'veg' }, // High Protein
    { name: 'Rajma (Kidney Beans)', calories: 333, protein: 22.9, carbs: 60.3, fat: 1.4, diet: 'veg' }, // High Protein
    { name: 'Soybean', calories: 432, protein: 43.2, carbs: 20.9, fat: 19.5, diet: 'veg' }, // High Protein
  ],

  vegetables: [
    { name: 'Potato', calories: 97, protein: 1.6, carbs: 22.6, fat: 0.1, diet: 'veg' },
    { name: 'Spinach (Palak)', calories: 26, protein: 2.0, carbs: 2.9, fat: 0.7, diet: 'veg' },
    { name: 'Green Peas (Matar)', calories: 93, protein: 7.2, carbs: 15.9, fat: 0.1, diet: 'veg' },
    { name: 'Onion', calories: 42, protein: 1.2, carbs: 11.1, fat: 0.1, diet: 'veg' },
    { name: 'Mushroom', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, diet: 'veg' },
    // --- ADDED VEGETABLES ---
    { name: 'Carrot', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, diet: 'veg' },
    { name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, diet: 'veg' },
  ],

  meatsAndSeafood: [
    { name: 'Chicken Breast (Raw)', calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, diet: 'non-veg' }, // High Protein
    { name: 'Mutton (Goat Meat, Lean)', calories: 143, protein: 27.1, carbs: 0.0, fat: 3.0, diet: 'non-veg' }, // High Protein
    { name: 'Rohu Fish (Raw)', calories: 127, protein: 17.0, carbs: 0.0, fat: 6.0, diet: 'non-veg' },
    { name: 'Egg (Boiled, 1 Large)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, diet: 'non-veg' },
    { name: 'Prawns (Raw)', calories: 85, protein: 20.0, carbs: 0.0, fat: 0.5, diet: 'non-veg' }, // High Protein
  ],

  dairy: [
    { name: 'Paneer (Cottage Cheese)', calories: 265, protein: 18.3, carbs: 6.2, fat: 20.8, diet: 'veg' }, // High Fat
    { name: 'Ghee (Clarified Butter)', calories: 900, protein: 0.0, carbs: 0.0, fat: 99.5, diet: 'veg' }, // High Fat
    { name: 'Curd (Dahi)', calories: 60, protein: 3.1, carbs: 4.0, fat: 4.0, diet: 'veg' },
    { name: 'Skimmed Milk', calories: 35, protein: 3.4, carbs: 5.0, fat: 0.1, diet: 'veg' },
    // --- ADDED DAIRY ---
    { name: 'Lassi (Sweet, 1 cup)', calories: 150, protein: 5.0, carbs: 25.0, fat: 3.0, diet: 'veg' },
  ],

  dishes: [
    { name: 'Plain Roti (1 piece)', calories: 120, protein: 3.1, carbs: 18.0, fat: 4.0, diet: 'veg' },
    { name: 'Dal Tadka (1 cup)', calories: 150, protein: 11.0, carbs: 20.0, fat: 3.0, diet: 'veg' }, // High Protein
    { name: 'Palak Paneer (1 cup)', calories: 270, protein: 15.0, carbs: 12.0, fat: 18.0, diet: 'veg' },
    { name: 'Butter Chicken (1 cup)', calories: 360, protein: 30.0, carbs: 10.0, fat: 22.0, diet: 'non-veg' }, // High Protein, High Fat
    { name: 'Chicken Biryani (1 cup)', calories: 450, protein: 25.0, carbs: 55.0, fat: 20.0, diet: 'non-veg' }, // High Protein, High Carb, High Fat
    { name: 'Masala Dosa (1 piece)', calories: 387, protein: 7.0, carbs: 77.0, fat: 5.6, diet: 'veg' }, // High Carb
    { name: 'Aloo Paratha (1 piece)', calories: 230, protein: 5.0, carbs: 30.0, fat: 15.0, diet: 'veg' },
    { name: 'Sambar (1 cup)', calories: 105, protein: 6.0, carbs: 16.0, fat: 2.0, diet: 'veg' },
    { name: 'Idli (2 pieces)', calories: 130, protein: 4.0, carbs: 26.0, fat: 1.0, diet: 'veg' },
    { name: 'Vada Pav (1 piece)', calories: 200, protein: 6.0, carbs: 28.0, fat: 7.0, diet: 'veg' },
    { name: 'Rajma Chawal (1 cup curry + 1 cup rice)', calories: 480, protein: 20.0, carbs: 65.0, fat: 15.0, diet: 'veg' }, // High Carb, High Protein, High Fat
    { name: 'Tandoori Chicken (1 breast piece)', calories: 250, protein: 40.0, carbs: 4.0, fat: 8.0, diet: 'non-veg' }, // High Protein
    { name: 'Fish Curry (1 cup)', calories: 320, protein: 28.0, carbs: 10.0, fat: 18.0, diet: 'non-veg' }, // High Protein
    // --- ADDED MEAL COMPONENTS ---
    { name: 'Jeera Rice (1 cup cooked)', calories: 200, protein: 4.0, carbs: 40.0, fat: 3.0, diet: 'veg' },
    { name: 'Naan (Plain, 1 piece)', calories: 260, protein: 7.0, carbs: 45.0, fat: 5.0, diet: 'veg' },
    { name: 'Bhindi Masala (Okra Curry, 1 cup)', calories: 180, protein: 4.0, carbs: 20.0, fat: 10.0, diet: 'veg' },
    { name: 'Mix Veg Curry (1 cup)', calories: 160, protein: 5.0, carbs: 25.0, fat: 5.0, diet: 'veg' },
    { name: 'Raita (Cucumber/Boondi, 1 cup)', calories: 80, protein: 4.0, carbs: 8.0, fat: 4.0, diet: 'veg' },
  ],

  snacksAndSweets: [
    { name: 'Samosa (1 piece)', calories: 140, protein: 3.0, carbs: 13.0, fat: 9.0, diet: 'veg' },
    { name: 'Pani Puri (6 pieces)', calories: 120, protein: 3.0, carbs: 20.0, fat: 3.0, diet: 'veg' },
    { name: 'Jalebi (100g)', calories: 383, protein: 4.4, carbs: 79.2, fat: 5.5, diet: 'veg' }, // High Carb
    { name: 'Gulab Jamun (2 pieces)', calories: 220, protein: 5.0, carbs: 35.0, fat: 15.0, diet: 'veg' },
    { name: 'Peanuts (Roasted, 100g)', calories: 567, protein: 25.3, carbs: 26.1, fat: 40.1, diet: 'veg' }, // High Protein, High Fat
  ],

  oilsAndSpices: [
    { name: 'Mustard Oil (100g)', calories: 900, protein: 0.0, carbs: 0.0, fat: 100.0, diet: 'veg' }, // High Fat
    { name: 'Coconut Oil (100g)', calories: 900, protein: 0.0, carbs: 0.0, fat: 100.0, diet: 'veg' }, // High Fat
    { name: 'Turmeric Powder (100g)', calories: 354, protein: 7.8, carbs: 64.9, fat: 9.9, diet: 'veg' }, // High Carb
    { name: 'Cumin Seeds (100g)', calories: 375, protein: 17.8, carbs: 44.2, fat: 22.3, diet: 'veg' }, // High Fat
  ],

  // --- NEW CATEGORY FOR THALI-STYLE CONDIMENTS/SIDES ---
  sidesAndCondiments: [
    { name: 'Papad/Pappadam (Fried, 1 piece)', calories: 60, protein: 3.0, carbs: 8.0, fat: 2.0, diet: 'veg' },
    { name: 'Plain Curd/Dahi (1/2 cup)', calories: 30, protein: 1.5, carbs: 2.0, fat: 2.0, diet: 'veg' },
    { name: 'Pickle (Achar, 1 tbsp)', calories: 30, protein: 0.1, carbs: 2.0, fat: 2.5, diet: 'veg' },
    { name: 'Green Chutney (Coriander/Mint, 2 tbsp)', calories: 15, protein: 0.5, carbs: 2.5, fat: 0.5, diet: 'veg' },
    { name: 'Salad (Cucumber/Carrot, 1 cup)', calories: 30, protein: 1.5, carbs: 6.0, fat: 0.2, diet: 'veg' },
  ],
};


// --- Component Logic ---
export default function FoodReferencePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [macroFilter, setMacroFilter] = useState('all'); // 'all', 'protein', 'carbs', 'fat'

  const getAllFoods = () => {
    return [
      ...indianFoodData.grains.map(item => ({ ...item, category: 'Grains & Millets' })),
      ...indianFoodData.legumes.map(item => ({ ...item, category: 'Legumes & Pulses' })),
      ...indianFoodData.vegetables.map(item => ({ ...item, category: 'Vegetables' })),
      ...indianFoodData.meatsAndSeafood.map(item => ({ ...item, category: 'Meat & Seafood' })),
      ...indianFoodData.dairy.map(item => ({ ...item, category: 'Dairy Products' })),
      ...indianFoodData.dishes.map(item => ({ ...item, category: 'Cooked Dishes' })),
      ...indianFoodData.snacksAndSweets.map(item => ({ ...item, category: 'Snacks & Sweets' })),
      ...indianFoodData.oilsAndSpices.map(item => ({ ...item, category: 'Oils, Fats & Spices' })),
    ];
  };

  const isHighMacro = (food:any) => {
    switch (macroFilter) {
      case 'protein':
        return food.protein >= 20; // 20g/100g or serving as "High Protein" threshold
      case 'carbs':
        return food.carbs >= 50; // 50g/100g or serving as "High Carb" threshold
      case 'fat':
        return food.fat >= 20; // 20g/100g or serving as "High Fat" threshold
      default:
        return true;
    }
  };

  const filteredFoods = getAllFoods().filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    const matchesDiet = dietFilter === 'all' || food.diet === dietFilter;
    const matchesMacro = isHighMacro(food);
    
    return matchesSearch && matchesCategory && matchesDiet && matchesMacro;
  });

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'Grains & Millets', label: 'Grains' },
    { key: 'Legumes & Pulses', label: 'Legumes' },
    { key: 'Vegetables', label: 'Vegetables' },
    { key: 'Meat & Seafood', label: 'Non-Veg' },
    { key: 'Dairy Products', label: 'Dairy' },
    { key: 'Cooked Dishes', label: 'Dishes' },
    { key: 'Snacks & Sweets', label: 'Snacks' },
    { key: 'Oils, Fats & Spices', label: 'Oils/Spices' }
  ];

  const getMacroBadge = (food:any) => {
    if (food.protein >= 20) return { label: 'High Protein', color: 'text-green-500 border-green-500' };
    if (food.carbs >= 50) return { label: 'High Carb', color: 'text-blue-500 border-blue-500' };
    if (food.fat >= 20) return { label: 'High Fat', color: 'text-orange-500 border-orange-500' };
    return null;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Food Nutrition Chart</h1>
        <p className="text-sm text-muted-foreground">
          Expanded nutritional data for essential Indian foods (per 100g/serving specified)
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search for any Indian food (e.g., Paneer, Dal, Biryani)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 text-base"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Diet Filter */}
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Diet Type</label>
          <Select value={dietFilter} onValueChange={setDietFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Diet Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All (Veg & Non-Veg)</SelectItem>
              <SelectItem value="veg"><Salad className="inline-block w-4 h-4 mr-2 text-green-600" /> Vegetarian Only</SelectItem>
              <SelectItem value="non-veg"><Beef className="inline-block w-4 h-4 mr-2 text-red-600" /> Non-Vegetarian Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Macro Filter */}
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Focus Filter</label>
          <Select value={macroFilter} onValueChange={setMacroFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Macro Focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><Zap className="inline-block w-4 h-4 mr-2" /> All Foods</SelectItem>
              <SelectItem value="protein">High Protein</SelectItem>
              <SelectItem value="carbs">High Carb </SelectItem>
              <SelectItem value="fat">High Fat </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 lg:grid-cols-9 h-auto p-1 bg-muted/60">
          {categories.map(category => (
            <TabsTrigger 
              key={category.key} 
              value={category.key}
              className="text-xs px-1 py-1 h-auto data-[state=active]:bg-background transition-colors"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">
          {filteredFoods.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No foods found matching your search and filter criteria. Try adjusting the filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFoods.map((food, index) => {
                const macroBadge = getMacroBadge(food);
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-base">{food.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                    variant="outline" 
                                    className={`text-xs font-medium ${food.diet === 'veg' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}
                                >
                                    {food.diet === 'veg' ? 'VEG' : 'NON-VEG'}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    {food.category}
                                </Badge>
                                {macroBadge && (
                                    <Badge variant="outline" className={`text-xs font-semibold ${macroBadge.color}`}>
                                        {macroBadge.label}
                                    </Badge>
                                )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-extrabold text-primary">
                              {food.calories}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0">
                                Total Cal
                            </div>
                          </div>
                        </div>
                        
                        {/* Macronutrient breakdown */}
                        <div className="grid grid-cols-3 gap-3 text-sm border-t pt-3">
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-bold text-green-700">{food.protein.toFixed(1)}g</div>
                            <div className="text-xs text-green-700/80">Protein</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-bold text-blue-700">{food.carbs.toFixed(1)}g</div>
                            <div className="text-xs text-blue-700/80">Carbs</div>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded">
                            <div className="font-bold text-orange-700">{food.fat.toFixed(1)}g</div>
                            <div className="text-xs text-orange-700/80">Fat</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Tabs>

      
    </div>
  );
}