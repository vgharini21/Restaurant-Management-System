import { useState } from 'react';
import { MenuItem, Restaurant } from '../App';
import { MenuItemCard } from './MenuItemCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Star, Clock } from 'lucide-react';

type MenuViewProps = {
  restaurant: Restaurant;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuView({ restaurant, onAddToCart }: MenuViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(restaurant.menu.map(item => item.category)))];

  const filteredItems = restaurant.menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Restaurant Header */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="mb-2">{restaurant.name}</h2>
        <p className="text-gray-600 mb-4">{restaurant.description}</p>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded">
            {restaurant.cuisine}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4">Menu</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No menu items found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}