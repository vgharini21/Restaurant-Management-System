import { useMemo, useState } from "react";
import { Review } from "../App";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

type Props = {
  reviews: Review[];
  onAddReview: (restaurantId: string, rating: number, comment: string) => void;
  restaurantId: string;
  userName: string;
  isSignedIn: boolean;
};

export function RestaurantReviews({
  reviews,
  onAddReview,
  restaurantId,
  userName,
  isSignedIn,
}: Props) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const avg = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const submit = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;
    onAddReview(restaurantId, rating, trimmed);
    setComment("");
    setRating(5);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-700">
            {avg ? (
              <>
                <span className="font-medium">{avg}</span>/5 • {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </>
            ) : (
              "No reviews yet"
            )}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Posting as <span className="font-medium">{userName}</span>
        </span>
      </div>

      {/* Add review */}
      <div className="border rounded-lg p-4 mb-6">
        {!isSignedIn && (
          <div className="mb-3 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded p-3">
            Please sign in to leave a review.
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm text-gray-600">Rating</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            disabled={!isSignedIn}
          >
            {[5, 4, 3, 2, 1].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={3}
          placeholder={isSignedIn ? "Write your review..." : "Sign in to write a review"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!isSignedIn}
        />

        <div className="mt-3 flex justify-end">
          <Button onClick={submit} disabled={!isSignedIn || !comment.trim()}>
            Post Review
          </Button>
        </div>
      </div>

      {/* List */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.userName}</div>
                <div className="text-sm text-gray-600">
                  {r.rating}/5 • {new Date(r.date).toLocaleDateString()}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
