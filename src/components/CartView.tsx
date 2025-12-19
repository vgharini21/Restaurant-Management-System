import { useMemo, useState } from "react";
import { CartItem } from "../App";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type CartViewProps = {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: () => void;
};

// TODO: replace with your API Gateway endpoint that triggers the payment Lambda
const PAYMENTS_API_URL =
  "https://80t28u337e.execute-api.us-east-1.amazonaws.com/prod/payments";

export function CartView({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
}: CartViewProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const paymentMethods = [
    { id: "credit-card", label: "Credit Card", Icon: CreditCard },
    { id: "debit-card", label: "Debit Card", Icon: CreditCard },
    { id: "paypal", label: "PayPal", Icon: CreditCard },
    { id: "apple-pay", label: "Apple Pay", Icon: Smartphone },
  ];

  const openPayment = () => {
    setPaymentError(null);
    setShowPaymentDialog(true);
  };

  const payAndPlaceOrder = async () => {
    setIsPaying(true);
    setPaymentError(null);

    try {
      const amount = Number(total.toFixed(2));

      const res = await fetch(PAYMENTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          paymentMethod: selectedPayment,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Payment failed");
      }

      setShowPaymentDialog(false);
      onPlaceOrder();
    } catch (e: any) {
      setPaymentError(e?.message ?? "Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

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
    <div className="max-w-6xl mx-auto">
      <h2 className="mb-6">Shopping Cart</h2>

      {/* ✅ New layout: items on left, sticky summary on right */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Cart items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
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
                        <p className="text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
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
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
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

        {/* RIGHT: Sticky summary (not at bottom anymore) */}
        <div className="w-full lg:w-96">
          <Card className="bg-gray-50 lg:sticky lg:top-24">
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
                  <span className="font-medium">Total</span>
                  <span className="text-orange-600 font-medium">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button onClick={openPayment} className="w-full" size="lg">
                Place Order
              </Button>

              <p className="text-xs text-gray-500 mt-3">
                You’ll choose a payment method on the next step.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              Select a payment method, then confirm to pay ${total.toFixed(2)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {paymentMethods.map(({ id, label, Icon }) => (
              <label
                key={id}
                className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={id}
                  checked={selectedPayment === id}
                  onChange={() => setSelectedPayment(id)}
                />
                <Icon className="w-5 h-5" />
                <span className="flex-1">{label}</span>
              </label>
            ))}
          </div>

          {paymentError && (
            <div className="text-sm text-red-600 mt-2">{paymentError}</div>
          )}

          <DialogFooter>
            <Button
              onClick={payAndPlaceOrder}
              className="w-full"
              disabled={isPaying}
            >
              {isPaying ? "Processing..." : "Pay & Place Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
