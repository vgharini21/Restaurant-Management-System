import { useMemo, useState } from "react";
import { MenuItem, Restaurant, Review } from "../App";
import { MenuItemCard } from "./MenuItemCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Star, Clock } from "lucide-react";

export type MenuViewProps = {
  restaurant: Restaurant;
  onAddToCart: (item: MenuItem) => void;

  // 🔹 Review-related props
  reviews: Review[];
  onAddReview: (restaurantId: string, rating: number, comment: string) => void;
  userName: string;
  isSignedIn: boolean;
};

export function MenuView({
  restaurant,
  onAddToCart,
  reviews,
  onAddReview,
  userName,
  isSignedIn,
}: MenuViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const categories = [
    "All",
    ...Array.from(new Set(restaurant.menu.map((item) => item.category))),
  ];

  const filteredItems = restaurant.menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const submitReview = () => {
    if (!comment.trim()) return;
    onAddReview(restaurant.id, rating, comment.trim());
    setComment("");
    setRating(5);
  };

  return (
    <div className="space-y-10">
      {/* ================= Restaurant Header ================= */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="mb-2">{restaurant.name}</h2>
        <p className="text-gray-600 mb-4">{restaurant.description}</p>

        <div className="flex flex-wrap items-center gap-4">
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

          {averageRating && (
            <span className="ml-auto text-sm text-gray-600">
              ⭐ {averageRating}/5 ({reviews.length} reviews)
            </span>
          )}
        </div>
      </div>

      {/* ================= Menu Section ================= */}
      <div>
        <h3 className="mb-4">Menu</h3>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No menu items found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= Reviews Section ================= */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="mb-4">Customer Reviews</h3>

        {/* Add Review */}
        <div className="border rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            Reviewing as <span className="font-medium">{userName}</span>
          </p>

          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm">Rating</label>
            <select
              className="border rounded px-2 py-1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              disabled={!isSignedIn}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder={
              isSignedIn
                ? "Write your review..."
                : "Sign in to write a review"
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!isSignedIn}
          />

          <div className="mt-3 flex justify-end">
            <Button
              onClick={submitReview}
              disabled={!isSignedIn || comment.trim().length === 0}
            >
              Post Review
            </Button>
          </div>
        </div>

        {/* Review List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{review.userName}</span>
                  <span className="text-sm text-gray-600">
                    {review.rating}/5 •{" "}
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
