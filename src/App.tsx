import { useState } from 'react';
import { Header } from './components/Header';
import { RestaurantListView } from './components/RestaurantListView';
import { MenuView } from './components/MenuView';
import { CartView } from './components/CartView';
import { ProfileView } from './components/ProfileView';
import { OrderHistoryView } from './components/OrderHistoryView';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  menu: MenuItem[];
};

export type CartItem = MenuItem & {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'preparing' | 'completed';
  restaurantName: string;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function App() {
  const [currentView, setCurrentView] = useState<'restaurants' | 'menu' | 'cart' | 'profile' | 'orders'>('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345'
  });

  const handleViewRestaurantMenu = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('menu');
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setCurrentView('restaurants');
  };

  const addToCart = (item: MenuItem) => {
    if (!selectedRestaurant) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { 
        ...item, 
        quantity: 1,
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name
      }];
    });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'pending',
      restaurantName: cart[0].restaurantName
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCart([]);
    setCurrentView('orders');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'restaurants') {
            handleBackToRestaurants();
          } else {
            setCurrentView(view);
          }
        }}
        cartItemCount={cartItemCount}
        showBackButton={currentView === 'menu'}
        onBackClick={handleBackToRestaurants}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'restaurants' && (
          <RestaurantListView onViewMenu={handleViewRestaurantMenu} />
        )}

        {currentView === 'menu' && selectedRestaurant && (
          <MenuView 
            restaurant={selectedRestaurant}
            onAddToCart={addToCart}
          />
        )}
        
        {currentView === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onPlaceOrder={placeOrder}
          />
        )}
        
        {currentView === 'profile' && (
          <ProfileView
            profile={userProfile}
            onUpdateProfile={setUserProfile}
          />
        )}
        
        {currentView === 'orders' && (
          <OrderHistoryView orders={orders} />
        )}
      </main>
    </div>
  );
}