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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Reservation {
  id: string;
  name: string;
  date: Date;
  time: string;
  partySize: number;
  tableId: number;
  phone: string;
  email?: string;
  notes?: string;
  status: "confirmed" | "seated" | "completed" | "cancelled" | "no-show";
}

interface ReservationManagerProps {
  onAssignTable?: (reservationId: string, tableId: number) => void;
  onUpdateReservation?: (
    reservationId: string,
    updates: Partial<Reservation>,
  ) => void;
  onCreateReservation?: (reservation: Omit<Reservation, "id">) => void;
}

const ReservationManager = ({
  onAssignTable = () => {},
  onUpdateReservation = () => {},
  onCreateReservation = () => {},
}: ReservationManagerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  // Form state for new reservation
  const [newReservation, setNewReservation] = useState({
    name: "",
    date: new Date(),
    time: "18:00",
    partySize: 2,
    phone: "",
    email: "",
    notes: "",
    tableId: 0,
    status: "confirmed" as const,
  });

  // Mock reservations data
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      name: "John Smith",
      date: new Date(),
      time: "18:30",
      partySize: 4,
      tableId: 5,
      phone: "555-123-4567",
      email: "john@example.com",
      notes: "Anniversary dinner",
      status: "confirmed",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      date: new Date(),
      time: "19:00",
      partySize: 2,
      tableId: 3,
      phone: "555-987-6543",
      status: "seated",
    },
    {
      id: "3",
      name: "Michael Brown",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "20:00",
      partySize: 6,
      tableId: 10,
      phone: "555-456-7890",
      email: "michael@example.com",
      notes: "Birthday celebration",
      status: "confirmed",
    },
  ]);

  const handleCreateReservation = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const reservation = {
      ...newReservation,
      id: newId,
    };

    setReservations([...reservations, reservation]);
    onCreateReservation(newReservation);
    setIsCreateDialogOpen(false);

    // Reset form
    setNewReservation({
      name: "",
      date: new Date(),
      time: "18:00",
      partySize: 2,
      phone: "",
      email: "",
      notes: "",
      tableId: 0,
      status: "confirmed" as const,
    });
  };

  const handleUpdateStatus = (id: string, status: Reservation["status"]) => {
    const updatedReservations = reservations.map((res) =>
      res.id === id ? { ...res, status } : res,
    );
    setReservations(updatedReservations);
    onUpdateReservation(id, { status });

    if (selectedReservation?.id === id) {
      setSelectedReservation({ ...selectedReservation, status });
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const resDate = new Date(res.date);
    return (
      resDate.getDate() === selectedDate.getDate() &&
      resDate.getMonth() === selectedDate.getMonth() &&
      resDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "seated":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reservation Manager</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          New Reservation
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <Card
                key={reservation.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedReservation(reservation);
                  setIsViewDialogOpen(true);
                }}
              >
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {reservation.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{reservation.time}</span>
                          <span>•</span>
                          <Users className="h-3 w-3" />
                          <span>{reservation.partySize}</span>
                          {reservation.tableId > 0 && (
                            <>
                              <span>•</span>
                              <span>Table {reservation.tableId}</span>
                            </>
                          )}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="text-xs text-muted-foreground">
                    <div>{reservation.phone}</div>
                    {reservation.email && <div>{reservation.email}</div>}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              No reservations for this date
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create Reservation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Reservation</DialogTitle>
            <DialogDescription>
              Enter the details for the new reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newReservation.name}
                onChange={(e) =>
                  setNewReservation({ ...newReservation, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newReservation.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newReservation.date}
                      onSelect={(date) =>
                        date && setNewReservation({ ...newReservation, date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newReservation.time}
                onChange={(e) =>
                  setNewReservation({ ...newReservation, time: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="partySize" className="text-right">
                Party Size
              </Label>
              <Input
                id="partySize"
                type="number"
                min="1"
                value={newReservation.partySize}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    partySize: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newReservation.phone}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    phone: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newReservation.email}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    email: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={newReservation.notes}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    notes: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateReservation}>
              Create Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Reservation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {selectedReservation && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reservation Details</DialogTitle>
              <DialogDescription>
                View and manage reservation information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {selectedReservation.name}
                </h3>
                <Badge className={getStatusColor(selectedReservation.status)}>
                  {selectedReservation.status.charAt(0).toUpperCase() +
                    selectedReservation.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Date:</div>
                <div>{format(new Date(selectedReservation.date), "PPP")}</div>

                <div className="text-muted-foreground">Time:</div>
                <div>{selectedReservation.time}</div>

                <div className="text-muted-foreground">Party Size:</div>
                <div>{selectedReservation.partySize} people</div>

                <div className="text-muted-foreground">Table:</div>
                <div>
                  {selectedReservation.tableId > 0
                    ? `Table ${selectedReservation.tableId}`
                    : "Not assigned"}
                </div>

                <div className="text-muted-foreground">Phone:</div>
                <div>{selectedReservation.phone}</div>

                {selectedReservation.email && (
                  <>
                    <div className="text-muted-foreground">Email:</div>
                    <div>{selectedReservation.email}</div>
                  </>
                )}

                {selectedReservation.notes && (
                  <>
                    <div className="text-muted-foreground">Notes:</div>
                    <div>{selectedReservation.notes}</div>
                  </>
                )}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={
                      selectedReservation.status === "confirmed"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleUpdateStatus(selectedReservation.id, "confirmed")
                    }
                  >
                    Confirmed
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      selectedReservation.status === "seated"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleUpdateStatus(selectedReservation.id, "seated")
                    }
                  >
                    Seated
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      selectedReservation.status === "completed"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleUpdateStatus(selectedReservation.id, "completed")
                    }
                  >
                    Completed
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      selectedReservation.status === "cancelled"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleUpdateStatus(selectedReservation.id, "cancelled")
                    }
                  >
                    Cancelled
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      selectedReservation.status === "no-show"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleUpdateStatus(selectedReservation.id, "no-show")
                    }
                  >
                    No-Show
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // In a real app, this would open a table assignment dialog
                  setIsViewDialogOpen(false);
                }}
              >
                Assign Table
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ReservationManager;
