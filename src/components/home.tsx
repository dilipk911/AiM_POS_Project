import { memo, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { usePOSStore } from "../lib/store";

const Home = memo(function Home() {
  const { timeState, products, updateTime } = usePOSStore();

  useEffect(() => {
    const timer = setInterval(() => {
      updateTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, [updateTime]);

  const handleProductClick = (productId: string) => {
    // Handle product selection
    console.log(`Selected product: ${productId}`);
  };

  const handleTableSelect = (tableNumber: number) => {
    // Handle table selection
    console.log(`Selected table: ${tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Neri Sushi</h1>
          <span className="text-sm text-muted-foreground">{timeState.currentTime}</span>
        </div>
        <Button variant="ghost">EXIT</Button>
      </nav>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-card p-4">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleTableSelect(1)}
            >
              <span className="mr-2">🏠</span>
              TABLES
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">🛒</span>
              PRODUCTS
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">📄</span>
              BILLS
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">📊</span>
              REPORTS
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">⏰</span>
              HOURS
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">⚙️</span>
              SETTINGS
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              Menu
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              Menu Display
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              Mobile Menu
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Button variant="outline">+ HOME</Button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-6 gap-2">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`${product.color} flex h-24 cursor-pointer items-center justify-center p-2 text-center text-sm font-medium text-white transition-colors hover:opacity-90`}
                onClick={() => handleProductClick(product.id)}
              >
                {product.name}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Home;