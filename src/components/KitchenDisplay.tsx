import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
  notes: string;
  status?: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  variant?: string;
  servedBy?: string;
}

interface KitchenDisplayProps {
  orderItems?: OrderItem[];
  onUpdateOrderItem?: (itemId: string, updates: Partial<OrderItem>) => void;
  tableName?: string;
  server?: string;
}

const KitchenDisplay = ({
  orderItems = [],
  onUpdateOrderItem = () => {},
  tableName = "Table 1",
  server = "John Doe",
}: KitchenDisplayProps) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [fireHoldItems, setFireHoldItems] = useState<
    Record<string, "fire" | "hold">
  >({
    "1": "fire",
    "3": "hold",
  });

  const toggleFireHold = (itemId: string) => {
    setFireHoldItems((prev) => {
      const current = { ...prev };
      if (!current[itemId]) {
        current[itemId] = "fire";
      } else if (current[itemId] === "fire") {
        current[itemId] = "hold";
      } else {
        delete current[itemId];
      }
      return current;
    });
  };

  const filteredItems = orderItems.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "pending" && item.status === "pending") return true;
    if (activeCategory === "preparing" && item.status === "preparing")
      return true;
    if (activeCategory === "ready" && item.status === "ready") return true;
    return false;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Kitchen Display</h3>
        <p className="text-sm text-muted-foreground">
          Manage order preparation status
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start px-4 pt-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {item.quantity}× {item.name}
                        {item.variant && (
                          <span className="text-sm ml-1">({item.variant})</span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {tableName} • Order #12345
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${
                        item.status === "preparing"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "ready"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status
                        ? item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)
                        : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  {item.modifiers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.modifiers.map((mod, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
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
                      className={`text-xs mt-1 cursor-pointer ${fireHoldItems[item.id] === "fire" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                      onClick={() => toggleFireHold(item.id)}
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
                    {!fireHoldItems[item.id] && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFireHold(item.id)}
                      >
                        Set Priority
                      </Button>
                    )}
                    {item.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          onUpdateOrderItem(item.id, { status: "preparing" })
                        }
                      >
                        Start Preparing
                      </Button>
                    )}
                    {item.status === "preparing" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          onUpdateOrderItem(item.id, { status: "ready" })
                        }
                      >
                        Mark Ready
                      </Button>
                    )}
                    {item.status === "ready" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          onUpdateOrderItem(item.id, {
                            status: "delivered",
                            servedBy: server,
                          })
                        }
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              No active orders to prepare
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default KitchenDisplay;
