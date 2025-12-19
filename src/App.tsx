import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Header } from "./components/Header";
import { RestaurantListView } from "./components/RestaurantListView";
import { MenuView } from "./components/MenuView";
import { CartView } from "./components/CartView";
import { ProfileView } from "./components/ProfileView";
import { OrderHistoryView } from "./components/OrderHistoryView";

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
  status: "pending" | "preparing" | "completed";
  restaurantName: string;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type Review = {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

// ----------------------
// localStorage helpers
// ----------------------
const profileKeyFor = (email: string) => `rms_profile_${email}`;
const reviewKey = "rms_reviews_v1";

function loadStoredProfile(email: string) {
  try {
    const raw = localStorage.getItem(profileKeyFor(email));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredProfile(email: string, profile: any) {
  try {
    localStorage.setItem(profileKeyFor(email), JSON.stringify(profile));
  } catch {
    // ignore storage errors
  }
}

function loadStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(reviewKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredReviews(reviews: Review[]) {
  try {
    localStorage.setItem(reviewKey, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}

export default function App() {
  const auth = useAuth();

  const [currentView, setCurrentView] = useState<
    "restaurants" | "menu" | "cart" | "profile" | "orders"
  >("restaurants");

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
  });

  // Reviews (persisted in browser)
  const [reviews, setReviews] = useState<Review[]>(() => loadStoredReviews());

  useEffect(() => {
    saveStoredReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) return;

    const email = (auth.user.profile.email as string) || "";
    if (!email) return;

    const stored = loadStoredProfile(email);

    // Always start from Cognito for name/email/phone if available
    const profile = auth.user.profile;
    const nameFromCognito =
      (profile.name as string) ||
      [profile.given_name, profile.family_name].filter(Boolean).join(" ") ||
      "";

    setUserProfile({
      name: stored?.name ?? nameFromCognito ?? "John Doe",
      email: email,
      phone: stored?.phone ?? (profile.phone_number as string) ?? "",
      address: stored?.address ?? "",
    });
  }, [auth.isAuthenticated, auth.user]);

  // Basic auth state handling
  if (auth.isLoading) {
    return <div className="p-4">Loading authentication...</div>;
  }

  if (auth.error) {
    return (
      <div className="p-4 text-red-600">
        Authentication error: {auth.error.message}
      </div>
    );
  }

  const isSignedIn = auth.isAuthenticated;

  const handleSignIn = () => {
    auth.signinRedirect();
  };

  const handleSignOut = async () => {
    await auth.removeUser();

    const clientId = "2mdsov6q0up9jhfml2k5o9tdgi";
    const logoutUri = "https://d3t9ac16dxeckl.cloudfront.net";
    const cognitoDomain =
      "https://us-east-1abkju3ton.auth.us-east-1.amazoncognito.com";

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  // const handleSignOut = async () => {
  //   await auth.removeUser();

  //   const clientId = "2mdsov6q0up9jhfml2k5o9tdgi";
  //   const cognitoDomain =
  //     "https://us-east-1abkju3ton.auth.us-east-1.amazoncognito.com";

  //   const logoutUri = window.location.origin; // ✅ uses CloudFront in prod, localhost in dev

  //   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
  //     logoutUri
  //   )}`;
  // };


  const handleViewRestaurantMenu = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView("menu");
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setCurrentView("restaurants");
  };

  const addToCart = (item: MenuItem) => {
    if (!selectedRestaurant) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [
        ...prevCart,
        {
          ...item,
          quantity: 1,
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
        },
      ];
    });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const customerEmail = auth.user?.profile?.email;
    if (!customerEmail) {
      alert("Please sign in to place an order.");
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: "pending",
      restaurantName: cart[0].restaurantName,
    };

    try {
      await fetch(
        "https://80t28u337e.execute-api.us-east-1.amazonaws.com/prod/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: newOrder,
            customerEmail: customerEmail,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to send order to Lambda:", error);
    }

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setCurrentView("orders");
  };

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);

    const email = profile.email;
    if (!email) return;

    saveStoredProfile(email, {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    });
  };

  // NEW: add review
  const addReview = (restaurantId: string, rating: number, comment: string) => {
    if (!auth.isAuthenticated || !auth.user) {
      alert("Please sign in to leave a review.");
      return;
    }

    const userId =
      (auth.user.profile.sub as string) ||
      (auth.user.profile.email as string) ||
      "anonymous";

    const userName =
      (auth.user.profile.name as string) || userProfile.name || "Anonymous";

    const newReview: Review = {
      id: `review-${Date.now()}`,
      restaurantId,
      userId,
      userName,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          if (view === "restaurants") {
            handleBackToRestaurants();
          } else {
            setCurrentView(view);
          }
        }}
        cartItemCount={cartItemCount}
        showBackButton={currentView === "menu"}
        onBackClick={handleBackToRestaurants}
        isSignedIn={isSignedIn}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "restaurants" && (
          <RestaurantListView onViewMenu={handleViewRestaurantMenu} />
        )}

        {currentView === "menu" && selectedRestaurant && (
          <MenuView
            restaurant={selectedRestaurant}
            onAddToCart={addToCart}
            reviews={reviews.filter(
              (r) => r.restaurantId === selectedRestaurant.id
            )}
            onAddReview={addReview}
            userName={userProfile.name}
            isSignedIn={isSignedIn}
          />
        )}

        {currentView === "cart" && (
          <CartView
            cart={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onPlaceOrder={placeOrder}
          />
        )}

        {currentView === "profile" && (
          <>
            {!isSignedIn ? (
              <div className="text-center">
                <p className="mb-4">
                  Please sign in with Cognito to view your profile.
                </p>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Sign in
                </button>
              </div>
            ) : (
              <ProfileView profile={userProfile} onUpdateProfile={saveProfile} />
            )}
          </>
        )}

        {currentView === "orders" && (
          <>
            {!isSignedIn ? (
              <div className="text-center">
                <p className="mb-4">
                  Please sign in with Cognito to view your orders.
                </p>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Sign in
                </button>
              </div>
            ) : (
              <OrderHistoryView orders={orders} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
