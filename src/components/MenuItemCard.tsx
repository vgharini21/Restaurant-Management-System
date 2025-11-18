import { MenuItem } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type MenuItemCardProps = {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3>{item.name}</h3>
          <span className="text-orange-600">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600">{item.description}</p>
        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
          {item.category}
        </span>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onAddToCart(item)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
