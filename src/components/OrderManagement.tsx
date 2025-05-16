import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, CreditCard, DollarSign, Edit, Trash2, X } from "lucide-react";
import MenuSection from "./MenuSection";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
  notes: string;
}

interface OrderManagementProps {
  tableId?: string;
  tableName?: string;
  tableStatus?: "available" | "occupied" | "ordering" | "served" | "paying";
  onClose?: () => void;
}

const OrderManagement = ({
  tableId = "1",
  tableName = "Table 1",
  tableStatus = "occupied",
  onClose = () => {},
}: OrderManagementProps) => {
  const [activeTab, setActiveTab] = useState("menu");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      price: 12.99,
      quantity: 2,
      modifiers: ["Extra Cheese", "Thin Crust"],
      notes: "Well done please",
    },
    {
      id: "2",
      name: "Caesar Salad",
      price: 8.99,
      quantity: 1,
      modifiers: ["No Croutons"],
      notes: "",
    },
    {
      id: "3",
      name: "Sparkling Water",
      price: 3.5,
      quantity: 3,
      modifiers: [],
      notes: "With ice",
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(
    null,
  );
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [fireHoldItems, setFireHoldItems] = useState<
    Record<string, "fire" | "hold">
  >({ "1": "fire", "3": "hold" });
  const [server, setServer] = useState<string>("John Doe");

  const handleAddItem = (item: any, quantity: number, notes: string) => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: item.name,
      price: item.price,
      quantity: quantity,
      modifiers: [],
      notes: notes,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<OrderItem>) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  const handleSubmitOrder = () => {
    // Submit order logic would go here
    console.log("Order submitted", orderItems);
    setActiveTab("details");
  };

  const handleProcessPayment = () => {
    // Process payment logic would go here
    console.log("Payment processed", {
      method: paymentMethod,
      total: calculateTotal(),
    });
    setPaymentDialogOpen(false);
    // In a real app, you might update the order status or navigate away
  };

  const statusColors = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    ordering: "bg-yellow-500",
    served: "bg-purple-500",
    paying: "bg-orange-500",
  };

  return (
    <div className="bg-background w-full h-full flex flex-col rounded-lg border shadow-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{tableName}</h2>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${statusColors[tableStatus]}`}
              ></div>
              <span className="text-sm capitalize">{tableStatus}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b px-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <TabsContent value="menu" className="flex-1 flex p-0 m-0 h-full">
            <div className="flex flex-1 h-full">
              <div className="w-2/3 h-full border-r">
                <MenuSection onAddItemToOrder={handleAddItem} />
              </div>
              <div className="w-1/3 h-full flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Current Order</h3>
                  <p className="text-sm text-muted-foreground">
                    {orderItems.length} items
                  </p>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {orderItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardHeader className="p-3 pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {item.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // Open edit dialog
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-2">
                          {item.modifiers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.modifiers.map((mod, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {mod}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {item.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              Note: {item.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full" onClick={handleSubmitOrder}>
                    Submit Order
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="flex-1 p-0 m-0 h-full">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <p className="text-sm text-muted-foreground">Order #12345</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {item.quantity}× {item.name}
                        </p>
                        {item.modifiers.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {item.modifiers.join(", ")}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-sm italic text-muted-foreground">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveTab("menu")}
                  >
                    Edit Order
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setActiveTab("payment")}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="flex-1 p-0 m-0 h-full">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Select payment method
                </p>
              </div>
              <div className="flex-1 p-6">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    className="h-32 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <DollarSign className="h-10 w-10" />
                    <span>Cash</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    className="h-32 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard className="h-10 w-10" />
                    <span>Card</span>
                  </Button>
                </div>

                <div className="mt-8 max-w-md mx-auto">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveTab("details")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!paymentMethod}
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    Complete Payment
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kitchen" className="flex-1 p-0 m-0 h-full">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Kitchen Display</h3>
                <p className="text-sm text-muted-foreground">
                  Manage order preparation status
                </p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {orderItems
                    .filter(
                      (item) =>
                        item.status !== "delivered" &&
                        item.status !== "cancelled",
                    )
                    .map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardHeader className="p-3 pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {item.quantity}× {item.name}
                                {item.variant && (
                                  <span className="text-sm ml-1">
                                    ({item.variant})
                                  </span>
                                )}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                Table: {tableName} • Order #12345
                              </CardDescription>
                            </div>
                            <Badge
                              className={`${
                                item.status === "preparing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.status === "ready"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.status?.charAt(0).toUpperCase() +
                                item.status?.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-2">
                          {item.modifiers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.modifiers.map((mod, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {mod}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {item.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              Note: {item.notes}
                            </p>
                          )}
                          {fireHoldItems[item.id] && (
                            <Badge
                              className={`text-xs mt-1 ${fireHoldItems[item.id] === "fire" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                            >
                              {fireHoldItems[item.id] === "fire"
                                ? "Fire Now"
                                : "On Hold"}
                            </Badge>
                          )}
                        </CardContent>
                        <CardFooter className="p-3 pt-0 flex justify-between">
                          <div className="text-xs text-muted-foreground">
                            Server: {server}
                          </div>
                          <div className="flex space-x-2">
                            {item.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const updatedItems = orderItems.map((i) =>
                                    i.id === item.id
                                      ? { ...i, status: "preparing" }
                                      : i,
                                  );
                                  setOrderItems(updatedItems);
                                }}
                              >
                                Start Preparing
                              </Button>
                            )}
                            {item.status === "preparing" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const updatedItems = orderItems.map((i) =>
                                    i.id === item.id
                                      ? { ...i, status: "ready" }
                                      : i,
                                  );
                                  setOrderItems(updatedItems);
                                }}
                              >
                                Mark Ready
                              </Button>
                            )}
                            {item.status === "ready" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const updatedItems = orderItems.map((i) =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          status: "delivered",
                                          servedBy: server,
                                        }
                                      : i,
                                  );
                                  setOrderItems(updatedItems);
                                }}
                              >
                                Mark Delivered
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}

                  {orderItems.filter(
                    (item) =>
                      item.status !== "delivered" &&
                      item.status !== "cancelled",
                  ).length === 0 && (
                    <div className="flex items-center justify-center h-40 text-gray-500">
                      No active orders to prepare
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please confirm the payment details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Payment Method</h4>
              <p className="flex items-center space-x-2">
                {paymentMethod === "cash" ? (
                  <>
                    <DollarSign className="h-4 w-4" />
                    <span>Cash</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </>
                )}
              </p>
            </div>

            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <Label htmlFor="amount-tendered">Amount Tendered</Label>
                <Input id="amount-tendered" type="number" placeholder="0.00" />
                <div className="flex justify-between text-sm">
                  <span>Change Due:</span>
                  <span>$0.00</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="payment-notes">Notes</Label>
              <Textarea
                id="payment-notes"
                placeholder="Add any payment notes here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayment}
              className="flex items-center space-x-1"
            >
              <Check className="h-4 w-4" />
              <span>Complete Payment</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="hidden">
            Cancel Order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep order</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground">
              Yes, cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderManagement;
