import { Restaurant } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Star, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type RestaurantCardProps = {
  restaurant: Restaurant;
  onViewMenu: (restaurant: Restaurant) => void;
};

export function RestaurantCard({ restaurant, onViewMenu }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <h3 className="mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 mb-3">{restaurant.description}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            {restaurant.cuisine}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onViewMenu(restaurant)}
          className="w-full"
        >
          View Menu
        </Button>
      </CardFooter>
    </Card>
  );
}
