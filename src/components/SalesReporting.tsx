import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";
import {
  CalendarIcon,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react";

interface SalesData {
  date: Date;
  totalSales: number;
  itemsSold: number;
  averageOrderValue: number;
  topSellingItems: Array<{ name: string; quantity: number; revenue: number }>;
  salesByCategory: Array<{ category: string; sales: number }>;
  salesByHour: Array<{ hour: number; sales: number }>;
  paymentMethods: Array<{ method: string; count: number; total: number }>;
}

interface SalesReportingProps {
  salesData?: SalesData[];
}

const SalesReporting = ({ salesData = [] }: SalesReportingProps) => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({ from: subDays(new Date(), 7), to: new Date() });
  const [activeTab, setActiveTab] = useState("overview");

  // Mock sales data if none provided
  const mockSalesData: SalesData[] = [
    {
      date: new Date(),
      totalSales: 2345.67,
      itemsSold: 178,
      averageOrderValue: 32.45,
      topSellingItems: [
        { name: "Grilled Salmon", quantity: 24, revenue: 455.76 },
        { name: "Caesar Salad", quantity: 18, revenue: 161.82 },
        { name: "Margherita Pizza", quantity: 15, revenue: 224.85 },
      ],
      salesByCategory: [
        { category: "Main Courses", sales: 1245.67 },
        { category: "Appetizers", sales: 567.89 },
        { category: "Desserts", sales: 234.56 },
        { category: "Drinks", sales: 345.67 },
      ],
      salesByHour: [
        { hour: 11, sales: 145.67 },
        { hour: 12, sales: 345.67 },
        { hour: 13, sales: 456.78 },
        { hour: 14, sales: 234.56 },
        { hour: 17, sales: 345.67 },
        { hour: 18, sales: 567.89 },
        { hour: 19, sales: 678.9 },
        { hour: 20, sales: 456.78 },
        { hour: 21, sales: 234.56 },
      ],
      paymentMethods: [
        { method: "Credit Card", count: 45, total: 1567.89 },
        { method: "Cash", count: 23, total: 678.9 },
        { method: "Mobile Payment", count: 12, total: 456.78 },
      ],
    },
    {
      date: subDays(new Date(), 1),
      totalSales: 2145.32,
      itemsSold: 165,
      averageOrderValue: 30.21,
      topSellingItems: [
        { name: "Margherita Pizza", quantity: 22, revenue: 329.78 },
        { name: "Grilled Salmon", quantity: 18, revenue: 341.82 },
        { name: "Chocolate Cake", quantity: 15, revenue: 104.85 },
      ],
      salesByCategory: [
        { category: "Main Courses", sales: 1145.67 },
        { category: "Appetizers", sales: 467.89 },
        { category: "Desserts", sales: 334.56 },
        { category: "Drinks", sales: 245.67 },
      ],
      salesByHour: [
        { hour: 11, sales: 125.67 },
        { hour: 12, sales: 325.67 },
        { hour: 13, sales: 426.78 },
        { hour: 14, sales: 214.56 },
        { hour: 17, sales: 325.67 },
        { hour: 18, sales: 527.89 },
        { hour: 19, sales: 628.9 },
        { hour: 20, sales: 426.78 },
        { hour: 21, sales: 214.56 },
      ],
      paymentMethods: [
        { method: "Credit Card", count: 42, total: 1467.89 },
        { method: "Cash", count: 20, total: 578.9 },
        { method: "Mobile Payment", count: 10, total: 356.78 },
      ],
    },
  ];

  const data = salesData.length > 0 ? salesData : mockSalesData;

  // Filter data based on selected date range
  const filteredData = data.filter((item) =>
    isWithinInterval(item.date, {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to),
    }),
  );

  // Calculate summary metrics
  const totalSales = filteredData.reduce(
    (sum, item) => sum + item.totalSales,
    0,
  );
  const totalItemsSold = filteredData.reduce(
    (sum, item) => sum + item.itemsSold,
    0,
  );
  const averageOrderValue =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.averageOrderValue, 0) /
        filteredData.length
      : 0;

  // Aggregate top selling items across the date range
  const topSellingItemsMap = new Map<
    string,
    { quantity: number; revenue: number }
  >();

  filteredData.forEach((day) => {
    day.topSellingItems.forEach((item) => {
      const existing = topSellingItemsMap.get(item.name) || {
        quantity: 0,
        revenue: 0,
      };
      topSellingItemsMap.set(item.name, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.revenue,
      });
    });
  });

  const topSellingItems = Array.from(topSellingItemsMap.entries())
    .map(([name, data]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Aggregate sales by category
  const salesByCategoryMap = new Map<string, number>();

  filteredData.forEach((day) => {
    day.salesByCategory.forEach((category) => {
      const existing = salesByCategoryMap.get(category.category) || 0;
      salesByCategoryMap.set(category.category, existing + category.sales);
    });
  });

  const salesByCategory = Array.from(salesByCategoryMap.entries())
    .map(([category, sales]) => ({ category, sales }))
    .sort((a, b) => b.sales - a.sales);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales Reports</h3>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange as any}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b px-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="overview" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalSales.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For {filteredData.length} days
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Items Sold
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItemsSold}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all categories
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${averageOrderValue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per transaction
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Top Selling Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSellingItems.map((item, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {item.name}
                            </span>
                            <span className="text-sm font-medium">
                              ${item.revenue.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{
                                width: `${(item.revenue / topSellingItems[0].revenue) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.quantity} units sold
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChart className="mr-2 h-5 w-5" />
                    Sales by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesByCategory.map((category, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {category.category}
                            </span>
                            <span className="text-sm font-medium">
                              ${category.sales.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{
                                width: `${(category.sales / salesByCategory[0].sales) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {((category.sales / totalSales) * 100).toFixed(1)}%
                            of total
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Item
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          Quantity
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          Revenue
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          Avg Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellingItems.map((item, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4 align-middle">{item.name}</td>
                          <td className="p-4 align-middle text-right">
                            {item.quantity}
                          </td>
                          <td className="p-4 align-middle text-right">
                            ${item.revenue.toFixed(2)}
                          </td>
                          <td className="p-4 align-middle text-right">
                            ${(item.revenue / item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Category
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          Sales
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesByCategory.map((category, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4 align-middle">
                            {category.category}
                          </td>
                          <td className="p-4 align-middle text-right">
                            ${category.sales.toFixed(2)}
                          </td>
                          <td className="p-4 align-middle text-right">
                            {((category.sales / totalSales) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hourly" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Hourly Sales Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between">
                  {filteredData[0]?.salesByHour.map((hour) => (
                    <div key={hour.hour} className="flex flex-col items-center">
                      <div
                        className="bg-primary rounded-t w-12"
                        style={{
                          height: `${(hour.sales / Math.max(...filteredData[0].salesByHour.map((h) => h.sales))) * 250}px`,
                        }}
                      ></div>
                      <div className="text-xs mt-2">{hour.hour}:00</div>
                      <div className="text-xs font-medium">
                        ${hour.sales.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Method
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          Transactions
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          Total
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium">
                          Average
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData[0]?.paymentMethods.map((method, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4 align-middle">{method.method}</td>
                          <td className="p-4 align-middle text-right">
                            {method.count}
                          </td>
                          <td className="p-4 align-middle text-right">
                            ${method.total.toFixed(2)}
                          </td>
                          <td className="p-4 align-middle text-right">
                            ${(method.total / method.count).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SalesReporting;
