import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
  image?: string;
  popular?: boolean;
  specialOffer?: { type: string; value: number };
  isCombo?: boolean;
}

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (item: MenuItem, quantity: number, notes: string) => void;
}

const MenuItemModal = ({
  item,
  isOpen,
  onClose,
  onAddToOrder,
}: MenuItemModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const handleAddToOrder = () => {
    onAddToOrder(item, quantity, notes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {item.image && (
            <div className="w-full h-48 overflow-hidden rounded-md">
              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
                }
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="font-medium">${item.price.toFixed(2)}</p>

          <div className="flex items-center gap-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity:
            </label>
            <div className="flex items-center border rounded-md">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2"
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="px-2"
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Special Instructions:
            </label>
            <Input
              id="notes"
              placeholder="E.g., No onions, extra sauce"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="button" className="w-full" onClick={handleAddToOrder}>
            Add to Order - ${(item.price * quantity).toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface MenuSectionProps {
  onAddItemToOrder?: (item: MenuItem, quantity: number, notes: string) => void;
}

const MenuSection = ({ onAddItemToOrder = () => {} }: MenuSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Mock menu categories and items
  const categories = [
    { id: "all", name: "All" },
    { id: "appetizers", name: "Appetizers" },
    { id: "main", name: "Main Courses" },
    { id: "sides", name: "Sides" },
    { id: "desserts", name: "Desserts" },
    { id: "drinks", name: "Drinks" },
  ];

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Caesar Salad",
      price: 8.99,
      description:
        "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese",
      category: "appetizers",
      available: true,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      popular: true,
    },
    {
      id: "2",
      name: "Grilled Salmon",
      price: 18.99,
      description:
        "Atlantic salmon fillet grilled to perfection, served with seasonal vegetables",
      category: "main",
      available: true,
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
      specialOffer: { type: "discount", value: 10 },
    },
    {
      id: "3",
      name: "Chocolate Cake",
      price: 6.99,
      description:
        "Rich chocolate cake with a molten center, served with vanilla ice cream",
      category: "desserts",
      available: true,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      isCombo: true,
    },
    {
      id: "4",
      name: "French Fries",
      price: 4.99,
      description: "Crispy golden fries seasoned with sea salt",
      category: "sides",
      available: true,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
    },
    {
      id: "5",
      name: "Iced Tea",
      price: 2.99,
      description: "Refreshing house-brewed iced tea with lemon",
      category: "drinks",
      available: true,
      image:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    },
    {
      id: "6",
      name: "Margherita Pizza",
      price: 14.99,
      description:
        "Classic pizza with tomato sauce, mozzarella, and fresh basil",
      category: "main",
      available: true,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleAddToOrder = (
    item: MenuItem,
    quantity: number,
    notes: string,
  ) => {
    onAddItemToOrder(item, quantity, notes);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full overflow-x-auto flex justify-start">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${!item.available ? "opacity-60" : ""}`}
              onClick={() => item.available && handleItemClick(item)}
            >
              <CardContent className="p-0">
                <div className="flex h-24">
                  <div className="w-24 h-full overflow-hidden">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <span className="text-sm font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      {!item.available && (
                        <Badge variant="outline" className="text-xs">
                          Unavailable
                        </Badge>
                      )}
                      {item.popular && (
                        <Badge className="bg-amber-100 text-amber-800 text-xs">
                          Popular
                        </Badge>
                      )}
                      {item.specialOffer && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          {item.specialOffer.type === "discount"
                            ? `${item.specialOffer.value}% Off`
                            : item.specialOffer.type === "bogo"
                              ? "BOGO"
                              : "Bundle"}
                        </Badge>
                      )}
                      {item.isCombo && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          Combo
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-40 text-gray-500">
            No menu items found
          </div>
        )}
      </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToOrder={handleAddToOrder}
        />
      )}
    </div>
  );
};

export default MenuSection;
