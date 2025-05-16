import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
  image?: string;
  popular?: boolean;
  specialOffer?: { type: string; value: number; description?: string };
  isCombo?: boolean;
  variants?: Array<{ id: string; name: string; price: number }>;
  modifiers?: Array<{
    id: string;
    name: string;
    required: boolean;
    multiSelect: boolean;
    options: Array<{ id: string; name: string; price: number }>;
  }>;
  comboItems?: Array<{
    categoryName: string;
    selectCount: number;
    items: string[];
  }>;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  allergens?: string[];
  preparationTime?: number;
}

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (
    item: MenuItem,
    quantity: number,
    notes: string,
    modifiers?: string[],
    selectedVariant?: string | null,
  ) => void;
}

// This is a mock array for the comboItems functionality
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
    name: "French Fries",
    price: 4.99,
    description: "Crispy golden fries seasoned with sea salt",
    category: "sides",
    available: true,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
  },
  {
    id: "4",
    name: "Iced Tea",
    price: 2.99,
    description: "Refreshing house-brewed iced tea with lemon",
    category: "drinks",
    available: true,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
  },
];

const MenuItemModal = ({
  item,
  isOpen,
  onClose,
  onAddToOrder,
}: MenuItemModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    item.variants ? item.variants[0].id : null,
  );
  const [selectedModifiers, setSelectedModifiers] = useState<
    Record<string, string[]>
  >({});
  const [comboSelections, setComboSelections] = useState<
    Record<string, string[]>
  >({});

  // Initialize modifiers with default selections
  React.useEffect(() => {
    if (item.modifiers) {
      const initialModifiers: Record<string, string[]> = {};
      item.modifiers.forEach((modifier) => {
        if (modifier.required) {
          initialModifiers[modifier.id] = [modifier.options[0].id];
        } else {
          initialModifiers[modifier.id] = [];
        }
      });
      setSelectedModifiers(initialModifiers);
    }

    // Initialize combo selections
    if (item.isCombo && item.comboItems) {
      const initialComboSelections: Record<string, string[]> = {};
      item.comboItems.forEach((comboCategory, index) => {
        initialComboSelections[index.toString()] =
          comboCategory.items.length > 0 ? [comboCategory.items[0]] : [];
      });
      setComboSelections(initialComboSelections);
    }
  }, [item]);

  const handleModifierChange = (
    modifierId: string,
    optionId: string,
    multiSelect: boolean = false,
  ) => {
    setSelectedModifiers((prev) => {
      const current = { ...prev };
      if (multiSelect) {
        // Toggle selection for multi-select modifiers
        if (current[modifierId].includes(optionId)) {
          current[modifierId] = current[modifierId].filter(
            (id) => id !== optionId,
          );
        } else {
          current[modifierId] = [...current[modifierId], optionId];
        }
      } else {
        // Replace selection for single-select modifiers
        current[modifierId] = [optionId];
      }
      return current;
    });
  };

  const handleComboItemChange = (categoryIndex: string, itemId: string) => {
    setComboSelections((prev) => {
      const current = { ...prev };
      const category = item.comboItems?.[parseInt(categoryIndex)];

      if (!category) return current;

      if (category.selectCount === 1) {
        // Single selection
        current[categoryIndex] = [itemId];
      } else {
        // Multiple selections up to selectCount
        if (current[categoryIndex].includes(itemId)) {
          current[categoryIndex] = current[categoryIndex].filter(
            (id) => id !== itemId,
          );
        } else if (current[categoryIndex].length < category.selectCount) {
          current[categoryIndex] = [...current[categoryIndex], itemId];
        }
      }
      return current;
    });
  };

  const calculatePrice = () => {
    let basePrice = item.price;

    // Apply variant price if selected
    if (selectedVariant && item.variants) {
      const variant = item.variants.find((v) => v.id === selectedVariant);
      if (variant) {
        basePrice = variant.price;
      }
    }

    // Add modifier prices
    let modifierTotal = 0;
    if (item.modifiers) {
      item.modifiers.forEach((modifier) => {
        const selectedOptions = selectedModifiers[modifier.id] || [];
        selectedOptions.forEach((optionId) => {
          const option = modifier.options.find((opt) => opt.id === optionId);
          if (option) {
            modifierTotal += option.price;
          }
        });
      });
    }

    // Apply special offers
    let finalPrice = basePrice + modifierTotal;
    if (item.specialOffer && item.specialOffer.type === "discount") {
      finalPrice = finalPrice * (1 - item.specialOffer.value / 100);
    }

    return finalPrice * quantity;
  };

  const getSelectedModifierNames = () => {
    const modifierNames: string[] = [];

    if (item.modifiers) {
      item.modifiers.forEach((modifier) => {
        const selectedOptions = selectedModifiers[modifier.id] || [];
        selectedOptions.forEach((optionId) => {
          const option = modifier.options.find((opt) => opt.id === optionId);
          if (option && option.price > 0) {
            modifierNames.push(`${option.name} (+$${option.price.toFixed(2)})`);
          } else if (option) {
            modifierNames.push(option.name);
          }
        });
      });
    }

    return modifierNames;
  };

  const handleAddToOrder = () => {
    const selectedModifierNames = getSelectedModifierNames();
    onAddToOrder(item, quantity, notes, selectedModifierNames, selectedVariant);
    onClose();
  };

  // Find related items for upselling
  const getRelatedItems = () => {
    // In a real app, this would use AI or purchase history to suggest related items
    if (item.category === "main") return ["sides", "drinks"];
    if (item.category === "appetizers") return ["main"];
    return [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          {item.specialOffer && (
            <div className="mt-1">
              <Badge className="bg-red-100 text-red-800">
                {item.specialOffer.description}
              </Badge>
            </div>
          )}
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

          {/* Nutritional Info */}
          {item.nutritionalInfo && (
            <div className="text-xs text-gray-500 flex flex-wrap gap-2">
              {item.nutritionalInfo.calories && (
                <span>Calories: {item.nutritionalInfo.calories}</span>
              )}
              {item.nutritionalInfo.protein && (
                <span>Protein: {item.nutritionalInfo.protein}g</span>
              )}
              {item.nutritionalInfo.carbs && (
                <span>Carbs: {item.nutritionalInfo.carbs}g</span>
              )}
              {item.nutritionalInfo.fat && (
                <span>Fat: {item.nutritionalInfo.fat}g</span>
              )}
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Allergens: </span>
              {item.allergens.join(", ")}
            </div>
          )}

          {/* Preparation Time */}
          {item.preparationTime && (
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Prep time: {item.preparationTime} mins</span>
            </div>
          )}

          {/* Variants Selection */}
          {item.variants && item.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Size/Variant:</label>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    type="button"
                    variant={
                      selectedVariant === variant.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedVariant(variant.id)}
                  >
                    {variant.name} - ${variant.price.toFixed(2)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Modifiers */}
          {item.modifiers && item.modifiers.length > 0 && (
            <div className="space-y-4">
              {item.modifiers.map((modifier) => (
                <div key={modifier.id} className="space-y-2">
                  <label className="text-sm font-medium">
                    {modifier.name}
                    {modifier.required ? " *" : ""}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {modifier.options.map((option) => (
                      <Button
                        key={option.id}
                        type="button"
                        variant={
                          selectedModifiers[modifier.id]?.includes(option.id)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleModifierChange(
                            modifier.id,
                            option.id,
                            modifier.multiSelect,
                          )
                        }
                      >
                        {option.name}
                        {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Combo Items */}
          {item.isCombo && item.comboItems && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Combo Selections</h3>
              {item.comboItems.map((category, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">
                    {category.categoryName} (Select {category.selectCount})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((itemId) => {
                      const menuItem = menuItems.find((mi) => mi.id === itemId);
                      return menuItem ? (
                        <Button
                          key={itemId}
                          type="button"
                          variant={
                            comboSelections[index.toString()]?.includes(itemId)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleComboItemChange(index.toString(), itemId)
                          }
                        >
                          {menuItem.name}
                        </Button>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

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

          {/* AI-Driven Upselling */}
          {getRelatedItems().length > 0 && (
            <div className="border-t pt-4 mt-2">
              <h3 className="text-sm font-medium mb-2">Recommended Add-ons:</h3>
              <div className="flex flex-wrap gap-2">
                {getRelatedItems().map((category, i) => {
                  const relatedItem = menuItems.find(
                    (mi) => mi.category === category,
                  );
                  return relatedItem ? (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        onClose();
                        // In a real app, this would open the related item
                      }}
                    >
                      <span>Add {relatedItem.name}</span>
                      <span className="text-xs">
                        ${relatedItem.price.toFixed(2)}
                      </span>
                    </Button>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <Button type="button" className="w-full" onClick={handleAddToOrder}>
            Add to Order - ${calculatePrice().toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
