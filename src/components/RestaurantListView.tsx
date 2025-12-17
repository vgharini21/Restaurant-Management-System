import { useEffect, useMemo, useState } from "react";
import { Restaurant } from "../App";
import { RestaurantCard } from "./RestaurantCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { restaurantImages } from "../utils/restaurantImages";

const API_BASE = "https://80t28u337e.execute-api.us-east-1.amazonaws.com/v2";

type RestaurantListViewProps = {
  onViewMenu: (restaurant: Restaurant) => void;
};

// Fallback restaurant image (generic restaurant)
const DEFAULT_RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800";

// Category-based menu images (so they aren’t all identical)
const MENU_CATEGORY_IMAGES: Record<string, string> = {
  Pizza:
    "https://images.unsplash.com/photo-1548365328-9c2d5b8f7c41?auto=format&fit=crop&w=800",
  "Extra Large Pizza":
    "https://images.unsplash.com/photo-1548365328-9c2d5b8f7c41?auto=format&fit=crop&w=800",
  Wings:
    "https://images.unsplash.com/photo-1604909053259-2f23a5ef8c49?auto=format&fit=crop&w=800",
  "Jumbo Wings":
    "https://images.unsplash.com/photo-1604909053259-2f23a5ef8c49?auto=format&fit=crop&w=800",
  "Spicy Jumbo Wings":
    "https://images.unsplash.com/photo-1604909053259-2f23a5ef8c49?auto=format&fit=crop&w=800",
  Smoothies:
    "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800",
  Coffee:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800",
  Burgers:
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800",
  Snacks:
    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800",
};

// Default menu item image (generic food)
const DEFAULT_MENU_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800";

export function RestaurantListView({ onViewMenu }: RestaurantListViewProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        setError(null);

        // Load first 6 restaurants from your friend's API
        const ids = [1, 2, 3, 4, 5, 6];

        const result = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`${API_BASE}/menu/${id}`);
            if (!res.ok) throw new Error(`Restaurant ${id} not found`);

            const items = await res.json(); // array of menu items
            if (!Array.isArray(items) || items.length === 0) return null;

            const first = items[0];

            const restaurantName: string = first.restaurant_name;
            const restaurantImage =
              restaurantImages[restaurantName] ?? DEFAULT_RESTAURANT_IMAGE;

            const restaurant: Restaurant = {
              id: first.restaurant_id,
              name: restaurantName,
              cuisine: first.cuisine,
              description: `${first.cuisine} • Popular choices available`,
              rating: 4.7,
              deliveryTime: "20–40 min",
              image: restaurantImage,
              menu: items.map((item: any) => {
                const category: string = item.category ?? "Food";
                const menuImage =
                  MENU_CATEGORY_IMAGES[category] ?? DEFAULT_MENU_IMAGE;

                return {
                  id: item.menu_item_id,
                  name: item.name,
                  description: item.description ?? "Delicious menu item",
                  price: item.price,
                  category,
                  image: menuImage,
                };
              }),
            };
            console.log(first.restaurant_name)
            return restaurant;
          })
        );

        setRestaurants(result.filter(Boolean) as Restaurant[]);
      } catch (err: any) {
        setError(err.message ?? "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  const cuisines = useMemo(
    () => ["All", ...Array.from(new Set(restaurants.map((r) => r.cuisine)))],
    [restaurants]
  );

  // Filtering logic
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      restaurant.name.toLowerCase().includes(q) ||
      restaurant.cuisine.toLowerCase().includes(q);
    const matchesCuisine =
      selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  if (loading) return <div className="py-12 text-center">Loading…</div>;
  if (error)
    return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-4">Restaurants Near You</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search restaurants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {cuisines.map((cuisine) => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? "default" : "outline"}
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onViewMenu={onViewMenu}
          />
        ))}
      </div>
    </div>
  );
}
