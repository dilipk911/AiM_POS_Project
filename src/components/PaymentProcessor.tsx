import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, DollarSign } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
  notes: string;
}

interface PaymentProcessorProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  onProcessPayment: (paymentDetails: PaymentDetails) => void;
  paymentMethod: "cash" | "card" | "split" | null;
}

interface PaymentDetails {
  method: "cash" | "card" | "split";
  amountTendered?: number;
  changeDue?: number;
  cardDetails?: {
    last4: string;
    cardType: string;
  };
  splitDetails?: {
    cash: number;
    card: number;
  };
  notes: string;
  total: number;
  tip?: number;
}

const PaymentProcessor = ({
  isOpen,
  onClose,
  orderItems,
  onProcessPayment,
  paymentMethod,
}: PaymentProcessorProps) => {
  const [amountTendered, setAmountTendered] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [tip, setTip] = useState<string>("");
  const [splitCash, setSplitCash] = useState<string>("");
  const [splitCard, setSplitCard] = useState<string>("");
  const [cardLast4, setCardLast4] = useState<string>("");
  const [cardType, setCardType] = useState<string>("Visa");

  const calculateSubtotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateTotalWithTip = () => {
    const tipAmount = parseFloat(tip) || 0;
    return calculateTotal() + tipAmount;
  };

  const calculateChangeDue = () => {
    const tendered = parseFloat(amountTendered) || 0;
    return Math.max(0, tendered - calculateTotalWithTip());
  };

  const validatePayment = () => {
    if (paymentMethod === "cash") {
      const tendered = parseFloat(amountTendered) || 0;
      return tendered >= calculateTotalWithTip();
    } else if (paymentMethod === "card") {
      return cardLast4.length === 4;
    } else if (paymentMethod === "split") {
      const cashAmount = parseFloat(splitCash) || 0;
      const cardAmount = parseFloat(splitCard) || 0;
      return cashAmount + cardAmount >= calculateTotalWithTip();
    }
    return false;
  };

  const handleProcessPayment = () => {
    if (!validatePayment()) return;

    const paymentDetails: PaymentDetails = {
      method: paymentMethod as "cash" | "card" | "split",
      notes,
      total: calculateTotalWithTip(),
      tip: parseFloat(tip) || 0,
    };

    if (paymentMethod === "cash") {
      paymentDetails.amountTendered = parseFloat(amountTendered) || 0;
      paymentDetails.changeDue = calculateChangeDue();
    } else if (paymentMethod === "card") {
      paymentDetails.cardDetails = {
        last4: cardLast4,
        cardType,
      };
    } else if (paymentMethod === "split") {
      paymentDetails.splitDetails = {
        cash: parseFloat(splitCash) || 0,
        card: parseFloat(splitCard) || 0,
      };
    }

    onProcessPayment(paymentDetails);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
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
              ) : paymentMethod === "card" ? (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </>
              ) : (
                <span>Split Payment</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-amount">Tip Amount</Label>
            <Input
              id="tip-amount"
              type="number"
              placeholder="0.00"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
            />
          </div>

          {paymentMethod === "cash" && (
            <div className="space-y-2">
              <Label htmlFor="amount-tendered">Amount Tendered</Label>
              <Input
                id="amount-tendered"
                type="number"
                placeholder="0.00"
                value={amountTendered}
                onChange={(e) => setAmountTendered(e.target.value)}
              />
              <div className="flex justify-between text-sm">
                <span>Change Due:</span>
                <span>${calculateChangeDue().toFixed(2)}</span>
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-2">
              <Label htmlFor="card-last4">Last 4 Digits</Label>
              <Input
                id="card-last4"
                maxLength={4}
                placeholder="1234"
                value={cardLast4}
                onChange={(e) =>
                  setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
              <Label htmlFor="card-type">Card Type</Label>
              <select
                id="card-type"
                className="w-full p-2 border rounded"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">American Express</option>
                <option value="Discover">Discover</option>
              </select>
            </div>
          )}

          {paymentMethod === "split" && (
            <div className="space-y-2">
              <Label htmlFor="split-cash">Cash Amount</Label>
              <Input
                id="split-cash"
                type="number"
                placeholder="0.00"
                value={splitCash}
                onChange={(e) => setSplitCash(e.target.value)}
              />
              <Label htmlFor="split-card">Card Amount</Label>
              <Input
                id="split-card"
                type="number"
                placeholder="0.00"
                value={splitCard}
                onChange={(e) => setSplitCard(e.target.value)}
              />
              <div className="flex justify-between text-sm">
                <span>Total Payment:</span>
                <span>
                  $
                  {(
                    (parseFloat(splitCash) || 0) + (parseFloat(splitCard) || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="payment-notes">Notes</Label>
            <Textarea
              id="payment-notes"
              placeholder="Add any payment notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              {parseFloat(tip) > 0 && (
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>${parseFloat(tip).toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotalWithTip().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleProcessPayment}
            className="flex items-center space-x-1"
            disabled={!validatePayment()}
          >
            <Check className="h-4 w-4" />
            <span>Complete Payment</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProcessor;
