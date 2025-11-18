import { useState } from 'react';
import { Restaurant } from '../App';
import { RestaurantCard } from './RestaurantCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: "Bella Italia",
    description: "Authentic Italian cuisine with fresh pasta and wood-fired pizzas",
    cuisine: "Italian",
    rating: 4.8,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1532117472055-4d0734b51f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjMwNjE1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    menu: [
      {
        id: '1-1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomatoes, basil, and olive oil on thin crust',
        price: 14.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1703073186021-021fb5a0bde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZvb2R8ZW58MXx8fHwxNzYzMTA3Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '1-2',
        name: 'Creamy Carbonara',
        description: 'Traditional Italian pasta with bacon, eggs, and parmesan',
        price: 13.99,
        category: 'Pasta',
        image: 'https://images.unsplash.com/photo-1706051555972-579324abeb9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGZvb2R8ZW58MXx8fHwxNzYzMTAzNTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '1-3',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso and mascarpone',
        price: 7.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1669472546359-418a98630699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGZvb2R8ZW58MXx8fHwxNzYzMTQzMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  },
  {
    id: '2',
    name: "Tokyo Sushi Bar",
    description: "Fresh sushi and traditional Japanese dishes",
    cuisine: "Japanese",
    rating: 4.9,
    deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1568018508399-e53bc8babdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYzMDk2NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    menu: [
      {
        id: '2-1',
        name: 'Sushi Platter',
        description: 'Assorted fresh sushi rolls with wasabi and soy sauce',
        price: 18.99,
        category: 'Sushi',
        image: 'https://images.unsplash.com/photo-1563612116891-9b03e4bb9318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGZvb2R8ZW58MXx8fHwxNzYzMTQ2NzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '2-2',
        name: 'Ramen Bowl',
        description: 'Rich tonkotsu broth with noodles, pork, and soft-boiled egg',
        price: 14.99,
        category: 'Noodles',
        image: 'https://images.unsplash.com/photo-1706051555972-579324abeb9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGZvb2R8ZW58MXx8fHwxNzYzMTAzNTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  },
  {
    id: '3',
    name: "El Mariachi",
    description: "Vibrant Mexican flavors and traditional recipes",
    cuisine: "Mexican",
    rating: 4.7,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1653084019129-1f2303bb5bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjMxNDA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    menu: [
      {
        id: '3-1',
        name: 'Beef Tacos',
        description: 'Three soft tacos with seasoned beef, lettuce, cheese, and salsa',
        price: 11.99,
        category: 'Tacos',
        image: 'https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc2MzA2OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '3-2',
        name: 'Chicken Burrito',
        description: 'Large flour tortilla filled with chicken, rice, beans, and guacamole',
        price: 12.99,
        category: 'Burritos',
        image: 'https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc2MzA2OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  },
  {
    id: '4',
    name: "The All-American Diner",
    description: "Classic American comfort food done right",
    cuisine: "American",
    rating: 4.6,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGRpbmVyfGVufDF8fHx8MTc2MzE1MjEzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    menu: [
      {
        id: '4-1',
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, cheese, and our special sauce',
        price: 12.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc2MzA2OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '4-2',
        name: 'Grilled Ribeye Steak',
        description: 'Premium ribeye steak grilled to perfection with herb butter',
        price: 24.99,
        category: 'Steaks',
        image: 'https://images.unsplash.com/photo-1676471755539-d99326272d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhayUyMGZvb2R8ZW58MXx8fHwxNzYzMTQzMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '4-3',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce, croutons, parmesan, and Caesar dressing',
        price: 9.99,
        category: 'Salads',
        image: 'https://images.unsplash.com/photo-1669472546359-418a98630699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGZvb2R8ZW58MXx8fHwxNzYzMTQzMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  },
  {
    id: '5',
    name: "Golden Dragon",
    description: "Authentic Chinese cuisine with dim sum specialties",
    cuisine: "Chinese",
    rating: 4.7,
    deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1591214896508-22fc74d84a75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjMwODg3MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    menu: [
      {
        id: '5-1',
        name: 'Sweet and Sour Chicken',
        description: 'Crispy chicken with bell peppers in tangy sweet and sour sauce',
        price: 13.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc2MzA2OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '5-2',
        name: 'Fried Rice',
        description: 'Classic fried rice with eggs, peas, and your choice of protein',
        price: 10.99,
        category: 'Rice',
        image: 'https://images.unsplash.com/photo-1669472546359-418a98630699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGZvb2R8ZW58MXx8fHwxNzYzMTQzMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  },
  {
    id: '6',
    name: "Bangkok Street Kitchen",
    description: "Bold Thai flavors from the streets of Bangkok",
    cuisine: "Thai",
    rating: 4.8,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1526234362653-3b75a0c07438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjMxMjg3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    menu: [
      {
        id: '6-1',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with shrimp, peanuts, and tamarind sauce',
        price: 13.99,
        category: 'Noodles',
        image: 'https://images.unsplash.com/photo-1706051555972-579324abeb9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGZvb2R8ZW58MXx8fHwxNzYzMTAzNTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: '6-2',
        name: 'Green Curry',
        description: 'Spicy coconut curry with bamboo shoots and Thai basil',
        price: 14.99,
        category: 'Curry',
        image: 'https://images.unsplash.com/photo-1669472546359-418a98630699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGZvb2R8ZW58MXx8fHwxNzYzMTQzMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  }
];

type RestaurantListViewProps = {
  onViewMenu: (restaurant: Restaurant) => void;
};

export function RestaurantListView({ onViewMenu }: RestaurantListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');

  const cuisines = ['All', ...Array.from(new Set(RESTAURANTS.map(r => r.cuisine)))];

  const filteredRestaurants = RESTAURANTS.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-4">Restaurants Near You</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {cuisines.map(cuisine => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? 'default' : 'outline'}
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No restaurants found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onViewMenu={onViewMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}
