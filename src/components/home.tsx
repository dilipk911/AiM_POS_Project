import { memo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Home = memo(function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Neri Sushi</h1>
          <span className="text-sm text-muted-foreground">11:16:08</span>
        </div>
        <Button variant="ghost">EXIT</Button>
      </nav>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-card p-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
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
            {[
              { name: "Food Stay", color: "bg-pink-500" },
              { name: "Drinks Stay", color: "bg-pink-400" },
              { name: "Sets Stay", color: "bg-pink-300" },
              { name: "Mains Stay", color: "bg-pink-600" },
              { name: "Nigiri Stay", color: "bg-pink-700" },
              { name: "Specials Stay", color: "bg-pink-800" },
              { name: "Gunkan Stay", color: "bg-green-500" },
              { name: "Food Away", color: "bg-green-400" },
              { name: "Drinks Away", color: "bg-green-600" },
              { name: "Specials Away", color: "bg-green-700" },
              { name: "SPECIAL LUNCH SET STAY", color: "bg-purple-500" },
              { name: "DINNER SET STAY", color: "bg-purple-600" },
              { name: "COLA", color: "bg-purple-700" },
              { name: "COLA LIGHT", color: "bg-purple-800" },
              { name: "FANTA ORANGE", color: "bg-purple-900" },
              { name: "FANTA CASSIS", color: "bg-blue-500" },
              { name: "ICE TEA PEACH", color: "bg-blue-600" },
              { name: "SPRITE", color: "bg-blue-700" },
              { name: "TONIC", color: "bg-blue-800" },
              { name: "FRISTI", color: "bg-blue-900" },
            ].map((item, index) => (
              <Card
                key={index}
                className={`${item.color} flex h-24 cursor-pointer items-center justify-center p-2 text-center text-sm font-medium text-white transition-colors hover:opacity-90`}
              >
                {item.name}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Home;