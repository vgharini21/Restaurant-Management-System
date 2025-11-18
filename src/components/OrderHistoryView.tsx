import { Order } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Package } from 'lucide-react';

type OrderHistoryViewProps = {
  orders: Order[];
};

export function OrderHistoryView({ orders }: OrderHistoryViewProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="mb-2">No orders yet</h2>
        <p className="text-gray-600">Your order history will appear here</p>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="mb-6">Order History</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{order.id.slice(-8)}</CardTitle>
                  <p className="text-orange-600 mt-1">{order.restaurantName}</p>
                  <p className="text-gray-600 text-sm mt-1">{formatDate(order.date)}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span>{item.name}</span>
                      <span className="text-gray-600"> × {item.quantity}</span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span>Total</span>
                <span className="text-orange-600">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}