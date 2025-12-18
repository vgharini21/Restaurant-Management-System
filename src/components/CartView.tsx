// import { CartItem } from '../App';
// import { Button } from './ui/button';
// import { Card, CardContent } from './ui/card';
// import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
// import { ImageWithFallback } from './figma/ImageWithFallback';

// type CartViewProps = {
//   cart: CartItem[];
//   onUpdateQuantity: (itemId: string, quantity: number) => void;
//   onRemoveItem: (itemId: string) => void;
//   onPlaceOrder: () => void;
// };

// export function CartView({ cart, onUpdateQuantity, onRemoveItem, onPlaceOrder }: CartViewProps) {
//   const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const tax = subtotal * 0.08; // 8% tax
//   const total = subtotal + tax;

//   if (cart.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//         <h2 className="mb-2">Your cart is empty</h2>
//         <p className="text-gray-600">Add some delicious items from our menu!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="mb-6">Shopping Cart</h2>

//       <div className="space-y-4 mb-6">
//         {cart.map(item => (
//           <Card key={item.id}>
//             <CardContent className="p-4">
//               <div className="flex gap-4">
//                 <div className="w-24 h-24 rounded overflow-hidden bg-gray-200 flex-shrink-0">
//                   <ImageWithFallback
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3>{item.name}</h3>
//                       <p className="text-gray-600">${item.price.toFixed(2)} each</p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => onRemoveItem(item.id)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
//                       >
//                         <Minus className="w-4 h-4" />
//                       </Button>
//                       <span className="w-12 text-center">{item.quantity}</span>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
//                       >
//                         <Plus className="w-4 h-4" />
//                       </Button>
//                     </div>
//                     <div className="text-orange-600">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Card className="bg-gray-50">
//         <CardContent className="p-6">
//           <div className="space-y-2 mb-4">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>${subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax (8%)</span>
//               <span>${tax.toFixed(2)}</span>
//             </div>
//             <div className="border-t pt-2 flex justify-between">
//               <span>Total</span>
//               <span className="text-orange-600">${total.toFixed(2)}</span>
//             </div>
//           </div>
//           <Button onClick={onPlaceOrder} className="w-full" size="lg">
//             Place Order
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useMemo, useState } from "react";
import { CartItem } from "../App";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Smartphone } from "lucide-react";
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
  onPlaceOrder: () => void; // your existing "place order" logic
};

// 🔥 TODO: replace with your API Gateway endpoint that triggers the payment Lambda
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
    console.log("OPEN PAYMENT CLICKED");
    setPaymentError(null);
    setShowPaymentDialog(true);
  };

  const payAndPlaceOrder = async () => {
    setIsPaying(true);
    setPaymentError(null);

    try {
      // amount as number (your Lambda expects "amount")
      // You can send cents if you prefer; just match in Lambda
      const amount = Number(total.toFixed(2));

      const res = await fetch(PAYMENTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you later protect the endpoint, add Authorization here
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          paymentMethod: selectedPayment, // optional extra field (Lambda can ignore)
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Payment failed");
      }

      // Optional: show transactionId
      console.log("Payment success:", data);

      // close dialog and proceed with your existing order flow
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
    <div className="max-w-4xl mx-auto">
      <h2 className="mb-6">Shopping Cart</h2>

      <div className="space-y-4 mb-6">
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

          {/* ✅ Trigger payment modal instead of placing order immediately */}
          <Button onClick={openPayment} className="w-full" size="lg">
            Place Order
          </Button>
        </CardContent>
      </Card>

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

