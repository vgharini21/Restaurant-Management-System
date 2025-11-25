import { useEffect, useState } from "react";
import { Restaurant } from "../App";
import { RestaurantCard } from "./RestaurantCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const API_BASE = "https://80t28u337e.execute-api.us-east-1.amazonaws.com/v2";

type RestaurantListViewProps = {
  onViewMenu: (restaurant: Restaurant) => void;
};

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

        // Load first 6 restaurants from your friend's API
        const ids = [1, 2, 3, 4, 5, 6];

        const result = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`${API_BASE}/menu/${id}`);
            if (!res.ok) throw new Error(`Restaurant ${id} not found`);

            const items = await res.json(); // array of menu items

            if (!Array.isArray(items) || items.length === 0) return null;

            const first = items[0];

            const restaurant: Restaurant = {
              id: first.restaurant_id,
              name: first.restaurant_name,
              cuisine: first.cuisine,
              description: `${first.cuisine} • Popular choices available`,
              rating: 4.7,
              deliveryTime: "20–40 min",
              image:
                "https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=800",
              menu: items.map((item: any) => ({
                id: item.menu_item_id,
                name: item.name,
                description: item.description ?? "Delicious menu item",
                price: item.price,
                category: item.category,
                image:
                  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800",
              })),
            };

            return restaurant;
          })
        );

        setRestaurants(result.filter(Boolean) as Restaurant[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  const cuisines = [
    "All",
    ...Array.from(new Set(restaurants.map((r) => r.cuisine))),
  ];

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
