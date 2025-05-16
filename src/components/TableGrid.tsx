import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Table {
  id: number;
  number: number;
  status: "available" | "occupied" | "ordering" | "served" | "paying";
  occupiedSince?: Date;
  seats: number;
}

interface TableGridProps {
  tables?: Table[];
  onTableSelect?: (tableId: number) => void;
}

const TableGrid = ({
  tables = [
    { id: 1, number: 1, status: "available", seats: 2 },
    {
      id: 2,
      number: 2,
      status: "occupied",
      occupiedSince: new Date(Date.now() - 30 * 60000),
      seats: 4,
    },
    {
      id: 3,
      number: 3,
      status: "ordering",
      occupiedSince: new Date(Date.now() - 15 * 60000),
      seats: 2,
    },
    {
      id: 4,
      number: 4,
      status: "served",
      occupiedSince: new Date(Date.now() - 45 * 60000),
      seats: 6,
    },
    {
      id: 5,
      number: 5,
      status: "paying",
      occupiedSince: new Date(Date.now() - 60 * 60000),
      seats: 4,
    },
    { id: 6, number: 6, status: "available", seats: 2 },
    { id: 7, number: 7, status: "available", seats: 4 },
    {
      id: 8,
      number: 8,
      status: "occupied",
      occupiedSince: new Date(Date.now() - 20 * 60000),
      seats: 2,
    },
    {
      id: 9,
      number: 9,
      status: "served",
      occupiedSince: new Date(Date.now() - 35 * 60000),
      seats: 4,
    },
    { id: 10, number: 10, status: "available", seats: 6 },
    {
      id: 11,
      number: 11,
      status: "ordering",
      occupiedSince: new Date(Date.now() - 10 * 60000),
      seats: 2,
    },
    { id: 12, number: 12, status: "available", seats: 4 },
  ],
  onTableSelect = () => {},
}: TableGridProps) => {
  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "ordering":
        return "bg-yellow-100 text-yellow-800";
      case "served":
        return "bg-purple-100 text-purple-800";
      case "paying":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeSinceOccupied = (date?: Date) => {
    if (!date) return "";

    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Table Layout
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${table.status === "available" ? "border-green-300" : "border-gray-200"}`}
            onClick={() => onTableSelect(table.id)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Table {table.number}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {table.seats} seats
                  </p>
                </div>
                <Badge className={getStatusColor(table.status)}>
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </Badge>
              </div>

              {table.status !== "available" &&
                table.status !== "cleaning" &&
                table.status !== "reserved" &&
                table.occupiedSince && (
                  <div className="flex items-center mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {getTimeSinceOccupied(table.occupiedSince)}
                  </div>
                )}

              {table.server &&
                table.status !== "available" &&
                table.status !== "cleaning" &&
                table.status !== "reserved" && (
                  <div className="mt-2 text-xs sm:text-sm text-gray-500">
                    Server: {table.server}
                  </div>
                )}

              {table.status === "reserved" && table.reservation && (
                <div className="mt-2 text-xs sm:text-sm text-gray-500">
                  <div>Reservation: {table.reservation.name}</div>
                  <div>
                    Time:{" "}
                    {table.reservation.time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>Party: {table.reservation.partySize}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TableGrid;
