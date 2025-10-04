import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Activity,
  Filter,
  Download,
  MoreVertical,
  Ban,
  CheckCircle,
  AlertTriangle,
  Eye,
  Key,
  Upload,
  FileX,
  RefreshCw,
  UserPlus,
  MessageSquare,
  Heart,
  TrendingUp,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'counselor' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  lastLoginIP?: string;
  sessionsCount: number;
  department?: string;
  specialties?: string[];
  phoneNumber?: string;
  profilePicture?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'crisis';
  moodScore?: number;
  totalChatMessages?: number;
  averageSessionRating?: number;
  isOnline: boolean;
  createdBy?: string;
  notes?: string;
  permissions?: string[];
}

interface NewUserForm {
  name: string;
  email: string;
  role: 'student' | 'counselor' | 'admin';
  department?: string;
  specialties: string[];
  phoneNumber?: string;
  permissions: string[];
  notes?: string;
}

interface BulkAction {
  type: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'export' | 'sendMessage';
  userIds: string[];
}

// Generate more comprehensive mock data
const generateMockUsers = (): User[] => {
  const names = [
    'Sarah Johnson',
    'Dr. Michael Chen',
    'Emily Rodriguez',
    'Admin Wilson',
    'Dr. Lisa Park',
    'Alex Thompson',
    'Dr. Jennifer Martinez',
    'Ryan Davis',
    'Maria Garcia',
    'Dr. David Kim',
    'Jessica Brown',
    'Dr. Robert Taylor',
    'Kevin Wilson',
    'Dr. Amanda White',
    'Nicole Miller',
    'Dr. James Anderson',
    'Ashley Martinez',
    'Dr. Sarah Lee',
    'Christopher Moore',
    'Dr. Laura Adams',
  ];

  const departments = [
    'Computer Science',
    'Psychology',
    'Medicine',
    'Engineering',
    'Business',
    'Arts',
    'Biology',
    'Chemistry',
  ];
  const specialties = [
    'Anxiety',
    'Depression',
    'Academic Stress',
    'PTSD',
    'Crisis Intervention',
    'Relationship Issues',
    'Addiction',
    'Eating Disorders',
  ];
  const roles: ('student' | 'counselor' | 'admin')[] = ['student', 'counselor', 'admin'];
  const statuses: ('active' | 'inactive' | 'suspended' | 'pending')[] = [
    'active',
    'inactive',
    'suspended',
    'pending',
  ];
  const riskLevels: ('low' | 'medium' | 'high' | 'crisis')[] = ['low', 'medium', 'high', 'crisis'];

  return names.map((name, index) => {
    const role = index < 12 ? 'student' : index < 18 ? 'counselor' : 'admin';
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: (index + 1).toString(),
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.').replace('dr.', '')}@${role === 'student' ? 'university.edu' : role === 'counselor' ? 'counseling.edu' : 'mindbuddy.com'}`,
      role,
      status,
      joinDate: new Date(
        2023 + Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      )
        .toISOString()
        .split('T')[0],
      lastActive: `${Math.floor(Math.random() * 168)} hours ago`,
      lastLoginIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      sessionsCount: Math.floor(Math.random() * 150),
      department:
        role === 'student'
          ? departments[Math.floor(Math.random() * departments.length)]
          : undefined,
      specialties:
        role === 'counselor'
          ? [
              specialties[Math.floor(Math.random() * specialties.length)],
              specialties[Math.floor(Math.random() * specialties.length)],
            ]
          : undefined,
      phoneNumber: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      riskLevel:
        role === 'student' ? riskLevels[Math.floor(Math.random() * riskLevels.length)] : undefined,
      moodScore: role === 'student' ? Math.floor(Math.random() * 10) + 1 : undefined,
      totalChatMessages: Math.floor(Math.random() * 500),
      averageSessionRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      isOnline: Math.random() > 0.7,
      createdBy: role !== 'admin' ? 'system' : undefined,
      notes: Math.random() > 0.8 ? 'Special attention required' : undefined,
      permissions:
        role === 'admin'
          ? ['user_management', 'system_settings', 'crisis_intervention']
          : role === 'counselor'
            ? ['view_students', 'manage_sessions', 'crisis_intervention']
            : ['view_resources', 'book_sessions'],
    };
  });
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(generateMockUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [isUserDetailDialogOpen, setIsUserDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkActionType, setBulkActionType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form states
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: '',
    email: '',
    role: 'student',
    department: '',
    specialties: [],
    phoneNumber: '',
    permissions: [],
    notes: '',
  });

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isOnline: Math.random() > 0.8 ? !user.isOnline : user.isOnline,
          lastActive:
            Math.random() > 0.9 ? `${Math.floor(Math.random() * 60)} minutes ago` : user.lastActive,
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter;
      return matchesSearch && matchesRole && matchesStatus && matchesRisk;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        case 'lastActive':
          aValue = a.lastActive;
          bValue = b.lastActive;
          break;
        case 'sessionsCount':
          aValue = a.sessionsCount;
          bValue = b.sessionsCount;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  // User statistics
  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    students: users.filter((u) => u.role === 'student').length,
    counselors: users.filter((u) => u.role === 'counselor').length,
    admins: users.filter((u) => u.role === 'admin').length,
    online: users.filter((u) => u.isOnline).length,
    highRisk: users.filter((u) => u.riskLevel === 'high' || u.riskLevel === 'crisis').length,
    newThisMonth: users.filter((u) => {
      const joinDate = new Date(u.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length,
  };

  // CRUD Operations
  const handleCreateUser = () => {
    if (!newUserForm.name || !newUserForm.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Never',
      sessionsCount: 0,
      department: newUserForm.department || undefined,
      specialties: newUserForm.specialties.length > 0 ? newUserForm.specialties : undefined,
      phoneNumber: newUserForm.phoneNumber || undefined,
      isOnline: false,
      createdBy: 'Admin',
      notes: newUserForm.notes || undefined,
      permissions: newUserForm.permissions,
      totalChatMessages: 0,
      averageSessionRating: 0,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsCreateDialogOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'student',
      department: '',
      specialties: [],
      phoneNumber: '',
      permissions: [],
      notes: '',
    });

    toast({
      title: 'Success',
      description: `User ${newUser.name} has been created successfully.`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === selectedUser.id ? { ...selectedUser } : user))
    );

    setIsEditDialogOpen(false);
    setSelectedUser(null);

    toast({
      title: 'Success',
      description: 'User has been updated successfully.',
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

    toast({
      title: 'Success',
      description: 'User has been deleted successfully.',
    });
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );

    toast({
      title: 'Success',
      description: `User status has been changed to ${newStatus}.`,
    });
  };

  // Bulk Actions
  const handleBulkAction = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select users to perform bulk action.',
        variant: 'destructive',
      });
      return;
    }

    switch (bulkActionType) {
      case 'activate':
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            selectedUsers.includes(user.id) ? { ...user, status: 'active' as const } : user
          )
        );
        toast({
          title: 'Success',
          description: `${selectedUsers.length} users have been activated.`,
        });
        break;
      case 'deactivate':
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            selectedUsers.includes(user.id) ? { ...user, status: 'inactive' as const } : user
          )
        );
        toast({
          title: 'Success',
          description: `${selectedUsers.length} users have been deactivated.`,
        });
        break;
      case 'suspend':
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            selectedUsers.includes(user.id) ? { ...user, status: 'suspended' as const } : user
          )
        );
        toast({
          title: 'Success',
          description: `${selectedUsers.length} users have been suspended.`,
        });
        break;
      case 'delete':
        setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.id)));
        toast({
          title: 'Success',
          description: `${selectedUsers.length} users have been deleted.`,
        });
        break;
      case 'export':
        handleExportUsers(selectedUsers);
        break;
    }

    setSelectedUsers([]);
    setIsBulkActionDialogOpen(false);
    setBulkActionType('');
  };

  // Export functionality
  const handleExportUsers = (userIds?: string[]) => {
    const usersToExport = userIds
      ? users.filter((user) => userIds.includes(user.id))
      : filteredAndSortedUsers;

    const csvContent = [
      [
        'Name',
        'Email',
        'Role',
        'Status',
        'Join Date',
        'Last Active',
        'Sessions Count',
        'Department',
        'Risk Level',
        'Online Status',
      ].join(','),
      ...usersToExport.map((user) =>
        [
          user.name,
          user.email,
          user.role,
          user.status,
          user.joinDate,
          user.lastActive,
          user.sessionsCount.toString(),
          user.department || '',
          user.riskLevel || '',
          user.isOnline ? 'Online' : 'Offline',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Users exported successfully.',
    });
  };

  // Select all functionality
  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
  };

  // Helper functions for styling
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/20 text-primary border-primary/20';
      case 'counselor':
        return 'bg-secondary/20 text-secondary border-secondary/20';
      case 'student':
        return 'bg-accent/20 text-accent border-accent/20';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-600 border-green-500/20';
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/20';
      case 'suspended':
        return 'bg-red-500/20 text-red-600 border-red-500/20';
      case 'pending':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/20';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/20';
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'crisis':
        return 'bg-red-600/20 text-red-700 border-red-600/20';
      case 'high':
        return 'bg-red-500/20 text-red-600 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/20 text-green-600 border-green-500/20';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-xl text-muted-foreground/80">
              Comprehensive user administration and monitoring dashboard
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => handleExportUsers()}
              className="group hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Export All
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setUsers(generateMockUsers());
                toast({
                  title: 'Data Refreshed',
                  description: 'User data has been refreshed with latest information.',
                });
              }}
              className="group hover:bg-secondary/10"
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 group">
                  <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Create New User
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Add a new user to the platform with appropriate role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-name" className="text-sm font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="create-name"
                        placeholder="Enter full name"
                        value={newUserForm.name}
                        onChange={(e) =>
                          setNewUserForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="bg-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-email" className="text-sm font-semibold">
                        Email *
                      </Label>
                      <Input
                        id="create-email"
                        type="email"
                        placeholder="Enter email address"
                        value={newUserForm.email}
                        onChange={(e) =>
                          setNewUserForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="bg-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-role" className="text-sm font-semibold">
                        Role *
                      </Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(value) =>
                          setNewUserForm((prev) => ({
                            ...prev,
                            role: value as 'student' | 'counselor' | 'admin',
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="counselor">Counselor</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-phone" className="text-sm font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="create-phone"
                        placeholder="+1 (555) 123-4567"
                        value={newUserForm.phoneNumber}
                        onChange={(e) =>
                          setNewUserForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                        }
                        className="bg-white/50"
                      />
                    </div>
                    {newUserForm.role === 'student' && (
                      <div className="space-y-2">
                        <Label htmlFor="create-department" className="text-sm font-semibold">
                          Department
                        </Label>
                        <Input
                          id="create-department"
                          placeholder="e.g., Computer Science"
                          value={newUserForm.department}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({ ...prev, department: e.target.value }))
                          }
                          className="bg-white/50"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="create-notes" className="text-sm font-semibold">
                        Notes
                      </Label>
                      <Textarea
                        id="create-notes"
                        placeholder="Additional notes or comments..."
                        value={newUserForm.notes}
                        onChange={(e) =>
                          setNewUserForm((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        className="bg-white/50 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    Create User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Total
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.total}</CardTitle>
              <CardDescription className="text-sm">All Users</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <UserCheck className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                <Badge className="bg-green-500/20 text-green-600">Active</Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.active}</CardTitle>
              <CardDescription className="text-sm">Active Users</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <Badge className="bg-blue-500/20 text-blue-600">Online</Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.online}</CardTitle>
              <CardDescription className="text-sm">Online Now</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                  Students
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.students}</CardTitle>
              <CardDescription className="text-sm">Student Accounts</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Shield className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                <Badge className="bg-accent/20 text-accent">Counselors</Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.counselors}</CardTitle>
              <CardDescription className="text-sm">Licensed Counselors</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Shield className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <Badge className="bg-primary/20 text-primary">Admins</Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.admins}</CardTitle>
              <CardDescription className="text-sm">System Admins</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <AlertTriangle className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform" />
                <Badge className="bg-red-500/20 text-red-600">High Risk</Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.highRisk}</CardTitle>
              <CardDescription className="text-sm">Require Attention</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <Badge className="bg-purple-500/20 text-purple-600">New</Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{userStats.newThisMonth}</CardTitle>
              <CardDescription className="text-sm">This Month</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Advanced Filters and Search */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl font-bold">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Advanced Filters & Search
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Filter and search users with advanced criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="search" className="text-sm font-semibold">
                  Search Users
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-filter" className="text-sm font-semibold">
                  Role
                </Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="counselor">Counselors</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status-filter" className="text-sm font-semibold">
                  Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk-filter" className="text-sm font-semibold">
                  Risk Level
                </Label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="crisis">Crisis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort-by" className="text-sm font-semibold">
                  Sort by:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="joinDate">Join Date</SelectItem>
                    <SelectItem value="lastActive">Last Active</SelectItem>
                    <SelectItem value="sessionsCount">Sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="hover:bg-primary/10"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-xl border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-primary/20 text-primary font-semibold">
                    {selectedUsers.length} users selected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                    className="hover:bg-red-500/10"
                  >
                    <FileX className="h-4 w-4 mr-2" />
                    Clear Selection
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setBulkActionType('activate');
                      setIsBulkActionDialogOpen(true);
                    }}
                    className="hover:bg-green-500/10"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setBulkActionType('suspend');
                      setIsBulkActionDialogOpen(true);
                    }}
                    className="hover:bg-yellow-500/10"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setBulkActionType('export');
                      handleBulkAction();
                    }}
                    className="hover:bg-blue-500/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-red-500/10 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedUsers.length} selected users?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setBulkActionType('delete');
                            handleBulkAction();
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Users
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table/Cards */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-secondary bg-clip-text text-transparent">
                  Users ({filteredAndSortedUsers.length})
                </span>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedUsers.length)} of{' '}
                  {filteredAndSortedUsers.length}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-semibold px-3 py-1 rounded bg-primary/20 text-primary">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={
                      selectedUsers.length === currentUsers.length && currentUsers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label className="text-sm font-semibold">Select All</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {currentUsers.map((user) => (
                <div
                  key={user.id}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    selectedUsers.includes(user.id)
                      ? 'bg-primary/10 border-primary/30 shadow-md'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers((prev) => [...prev, user.id]);
                          } else {
                            setSelectedUsers((prev) => prev.filter((id) => id !== user.id));
                          }
                        }}
                        className="mt-2"
                      />
                      <div className="relative">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${
                            user.role === 'admin'
                              ? 'from-primary to-primary/70'
                              : user.role === 'counselor'
                                ? 'from-secondary to-secondary/70'
                                : 'from-accent to-accent/70'
                          } shadow-lg`}
                        >
                          {user.role === 'admin' ? (
                            <Shield className="h-8 w-8 text-white" />
                          ) : user.role === 'counselor' ? (
                            <Heart className="h-8 w-8 text-white" />
                          ) : (
                            <Users className="h-8 w-8 text-white" />
                          )}
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-bold">{user.name}</h3>
                              <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                              <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                              {user.riskLevel && user.role === 'student' && (
                                <Badge className={getRiskColor(user.riskLevel)}>
                                  {user.riskLevel} risk
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </span>
                              <span className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {user.joinDate}</span>
                              </span>
                              <span className="flex items-center space-x-2">
                                <Activity className="h-4 w-4" />
                                <span>Last seen {user.lastActive}</span>
                              </span>
                              {user.phoneNumber && (
                                <span className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{user.phoneNumber}</span>
                                </span>
                              )}
                              {user.department && (
                                <span className="flex items-center space-x-2">
                                  <Shield className="h-4 w-4" />
                                  <span>{user.department}</span>
                                </span>
                              )}
                              {user.totalChatMessages !== undefined && (
                                <span className="flex items-center space-x-2">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{user.totalChatMessages} messages</span>
                                </span>
                              )}
                            </div>

                            {user.specialties && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {user.specialties.map((specialty, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-white/20"
                                  >
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {user.notes && (
                              <p className="text-sm text-muted-foreground bg-white/10 p-2 rounded border-l-4 border-yellow-500">
                                <strong>Note:</strong> {user.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end space-y-3">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {user.sessionsCount}
                              </p>
                              <p className="text-sm text-muted-foreground">sessions</p>
                              {user.averageSessionRating && (
                                <p className="text-sm text-muted-foreground">
                                  ⭐ {user.averageSessionRating}/5.0
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsUserDetailDialogOpen(true);
                                }}
                                className="hover:bg-blue-500/10"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditDialogOpen(true);
                                }}
                                className="hover:bg-green-500/10"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-red-500/10 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {user.name}? This action
                                      cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Status Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      {user.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="h-8 w-8 p-0 hover:bg-green-500/20 text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="h-8 w-8 p-0 hover:bg-yellow-500/20 text-yellow-600"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Detail Dialog */}
        {selectedUser && (
          <Dialog open={isUserDetailDialogOpen} onOpenChange={setIsUserDetailDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  User Details - {selectedUser.name}
                </DialogTitle>
                <DialogDescription>Comprehensive user information and statistics</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Basic Information
                      </Label>
                      <div className="mt-2 space-y-2 p-4 bg-white/10 rounded-lg">
                        <p>
                          <strong>Name:</strong> {selectedUser.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedUser.email}
                        </p>
                        <p>
                          <strong>Role:</strong> {selectedUser.role}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedUser.status}
                        </p>
                        {selectedUser.phoneNumber && (
                          <p>
                            <strong>Phone:</strong> {selectedUser.phoneNumber}
                          </p>
                        )}
                        {selectedUser.department && (
                          <p>
                            <strong>Department:</strong> {selectedUser.department}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">
                        Activity Information
                      </Label>
                      <div className="mt-2 space-y-2 p-4 bg-white/10 rounded-lg">
                        <p>
                          <strong>Join Date:</strong> {selectedUser.joinDate}
                        </p>
                        <p>
                          <strong>Last Active:</strong> {selectedUser.lastActive}
                        </p>
                        <p>
                          <strong>Sessions:</strong> {selectedUser.sessionsCount}
                        </p>
                        <p>
                          <strong>Online Status:</strong>{' '}
                          {selectedUser.isOnline ? '🟢 Online' : '🔴 Offline'}
                        </p>
                        {selectedUser.totalChatMessages && (
                          <p>
                            <strong>Chat Messages:</strong> {selectedUser.totalChatMessages}
                          </p>
                        )}
                        {selectedUser.averageSessionRating && (
                          <p>
                            <strong>Avg Rating:</strong> ⭐ {selectedUser.averageSessionRating}/5.0
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedUser.role === 'student' && selectedUser.riskLevel && (
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">
                          Mental Health Status
                        </Label>
                        <div className="mt-2 space-y-2 p-4 bg-white/10 rounded-lg">
                          <p>
                            <strong>Risk Level:</strong>
                            <Badge className={getRiskColor(selectedUser.riskLevel)}>
                              {selectedUser.riskLevel}
                            </Badge>
                          </p>
                          {selectedUser.moodScore && (
                            <p>
                              <strong>Mood Score:</strong> {selectedUser.moodScore}/10
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedUser.specialties && (
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">
                          Specialties
                        </Label>
                        <div className="mt-2 p-4 bg-white/10 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="bg-white/20">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedUser.notes && (
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Notes</Label>
                        <div className="mt-2 p-4 bg-white/10 rounded-lg">
                          <p className="text-sm">{selectedUser.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit User Dialog */}
        {selectedUser && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Edit User - {selectedUser.name}
                </DialogTitle>
                <DialogDescription>Update user information and settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser((prev) => (prev ? { ...prev, name: e.target.value } : null))
                    }
                    className="bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-semibold">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
                    }
                    className="bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-sm font-semibold">
                    Status
                  </Label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value) =>
                      setSelectedUser((prev) =>
                        prev ? { ...prev, status: value as User['status'] } : null
                      )
                    }
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedUser.phoneNumber !== undefined && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone" className="text-sm font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="edit-phone"
                      value={selectedUser.phoneNumber || ''}
                      onChange={(e) =>
                        setSelectedUser((prev) =>
                          prev ? { ...prev, phoneNumber: e.target.value } : null
                        )
                      }
                      className="bg-white/50"
                    />
                  </div>
                )}
                {selectedUser.notes !== undefined && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes" className="text-sm font-semibold">
                      Notes
                    </Label>
                    <Textarea
                      id="edit-notes"
                      value={selectedUser.notes || ''}
                      onChange={(e) =>
                        setSelectedUser((prev) =>
                          prev ? { ...prev, notes: e.target.value } : null
                        )
                      }
                      className="bg-white/50 resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleEditUser}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  Update User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Bulk Action Confirmation Dialog */}
        <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Bulk Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to {bulkActionType} {selectedUsers.length} selected users?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkAction}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;
