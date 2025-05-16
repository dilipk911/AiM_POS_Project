import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, UserPlus, Search } from "lucide-react";

type UserRole = "admin" | "manager" | "waiter" | "kitchen" | "cashier";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  lastLogin?: Date;
}

interface UserManagementProps {
  users?: User[];
  onCreateUser?: (user: Omit<User, "id" | "lastLogin">) => void;
  onUpdateUser?: (id: string, updates: Partial<User>) => void;
  onDeleteUser?: (id: string) => void;
}

const UserManagement = ({
  users: initialUsers = [],
  onCreateUser = () => {},
  onUpdateUser = () => {},
  onDeleteUser = () => {},
}: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>(
    initialUsers.length > 0
      ? initialUsers
      : [
          {
            id: "1",
            name: "John Smith",
            email: "john@restaurant.com",
            role: "manager",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
            active: true,
            lastLogin: new Date(),
          },
          {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah@restaurant.com",
            role: "waiter",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
            active: true,
            lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          {
            id: "3",
            name: "Michael Brown",
            email: "michael@restaurant.com",
            role: "kitchen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
            active: true,
            lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: "4",
            name: "Emily Davis",
            email: "emily@restaurant.com",
            role: "cashier",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
            active: false,
            lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            id: "5",
            name: "David Wilson",
            email: "david@restaurant.com",
            role: "admin",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
            active: true,
            lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000),
          },
        ],
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "waiter" as UserRole,
    active: true,
  });

  const handleCreateUser = () => {
    const user = {
      ...newUser,
      id: Math.random().toString(36).substring(2, 9),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name.toLowerCase().replace(/\s/g, "")}`,
    };

    setUsers([...users, user]);
    onCreateUser(newUser);
    setIsCreateDialogOpen(false);

    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "waiter",
      active: true,
    });
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? selectedUser : user,
    );

    setUsers(updatedUsers);
    onUpdateUser(selectedUser.id, selectedUser);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    onDeleteUser(id);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-purple-100 text-purple-800";
      case "waiter":
        return "bg-blue-100 text-blue-800";
      case "kitchen":
        return "bg-yellow-100 text-yellow-800";
      case "cashier":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xs text-muted-foreground">
                  {user.lastLogin && (
                    <div>Last login: {user.lastLogin.toLocaleDateString()}</div>
                  )}
                  <div className="mt-1">
                    Status:{" "}
                    <span
                      className={
                        user.active ? "text-green-600" : "text-red-600"
                      }
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full flex items-center justify-center h-40 text-gray-500">
              No users found matching your search
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with role-based permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
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
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value as UserRole })
                }
                className="col-span-3 p-2 border rounded"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="waiter">Waiter</option>
                <option value="kitchen">Kitchen Staff</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={newUser.active}
                  onChange={(e) =>
                    setNewUser({ ...newUser, active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="status" className="text-sm font-normal">
                  Active
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={!newUser.name || !newUser.email}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedUser && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <select
                  id="edit-role"
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="col-span-3 p-2 border rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="waiter">Waiter</option>
                  <option value="kitchen">Kitchen Staff</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-status"
                    checked={selectedUser.active}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        active: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="edit-status" className="text-sm font-normal">
                    Active
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUser}
                disabled={!selectedUser.name || !selectedUser.email}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default UserManagement;
