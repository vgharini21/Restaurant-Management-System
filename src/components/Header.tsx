import { ShoppingCart, User, UtensilsCrossed, History, ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';

type HeaderProps = {
  currentView: 'restaurants' | 'menu' | 'cart' | 'profile' | 'orders';
  onViewChange: (view: 'restaurants' | 'menu' | 'cart' | 'profile' | 'orders') => void;
  cartItemCount: number;
  showBackButton?: boolean;
  onBackClick?: () => void;
};

export function Header({ currentView, onViewChange, cartItemCount, showBackButton, onBackClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              <h1 className="text-orange-600">Foodie Delivery</h1>
            </div>
            
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={onBackClick}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Restaurants
              </Button>
            )}
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'restaurants' ? 'default' : 'ghost'}
              onClick={() => onViewChange('restaurants')}
            >
              <Home className="w-4 h-4 mr-2" />
              Restaurants
            </Button>
            
            <Button
              variant={currentView === 'cart' ? 'default' : 'ghost'}
              onClick={() => onViewChange('cart')}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Button
              variant={currentView === 'orders' ? 'default' : 'ghost'}
              onClick={() => onViewChange('orders')}
            >
              <History className="w-4 h-4 mr-2" />
              Orders
            </Button>
            
            <Button
              variant={currentView === 'profile' ? 'default' : 'ghost'}
              onClick={() => onViewChange('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}