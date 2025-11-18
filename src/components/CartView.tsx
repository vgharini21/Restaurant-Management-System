import { CartItem } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type CartViewProps = {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: () => void;
};

export function CartView({ cart, onUpdateQuantity, onRemoveItem, onPlaceOrder }: CartViewProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some delicious items from our menu!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="mb-6">Shopping Cart</h2>

      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-orange-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span>Total</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <Button onClick={onPlaceOrder} className="w-full" size="lg">
            Place Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
