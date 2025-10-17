import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserType } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  Shield,
  Edit,
  Save,
  Camera,
  Upload,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserType>>(user || {});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const supportedLanguages = [
    'English', 'Portuguese', 'Spanish', 'French', 'German', 'Italian', 
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Dutch',
    'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Polish', 'Turkish'
  ];

  const commonTimezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
    'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
    'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
    'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00',
    'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
  ];

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'name': {
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 40) return 'Name cannot exceed 40 characters';
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Name must contain only letters and spaces';
        
        // Additional validation for UI consistency
        const words = value.trim().split(' ').filter(word => word.length > 0);
        if (words.length > 4) return 'Name cannot have more than 4 words';
        if (words.some(word => word.length > 15)) return 'Individual words cannot exceed 15 characters';
        if (words.some(word => word.length < 2)) return 'Each name part must be at least 2 characters';
        
        // Check for excessive spaces
        if (/\s{2,}/.test(value)) return 'No multiple consecutive spaces allowed';
        if (value.startsWith(' ') || value.endsWith(' ')) return 'Name cannot start or end with spaces';
        
        break;
      }
      
      case 'email': {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        break;
      }
      
      case 'dateOfBirth': {
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const maxAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
          const minAge = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
          
          if (birthDate > today) return 'Birth date cannot be in the future';
          if (birthDate < maxAge) return 'Invalid birth date';
          if (birthDate > minAge) return 'Minimum age is 13 years';
        }
        break;
      }
      
      case 'phone':
      case 'emergencyPhone': {
        if (value && !/^\+?[\d\s\-()]+$/.test(value)) {
          return 'Invalid phone number format';
        }
        if (value && (value.length < 10 || value.length > 20)) {
          return 'Phone number must be between 10 and 20 characters';
        }
        break;
      }
      
      case 'preferredLanguage': {
        if (value && !supportedLanguages.includes(value)) {
          return 'Language not supported';
        }
        break;
      }
      
      case 'emergencyContact': {
        if (value && value.length > 100) return 'Emergency contact name too long';
        break;
      }
      
      default:
        return null;
    }
    return null;
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, string> = {};
    
    Object.entries(editData).forEach(([field, value]) => {
      if (typeof value === 'string') {
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (user) {
      setEditData(user);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!validateAllFields()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving.',
        variant: 'destructive',
      });
      return;
    }

    updateUser(editData);
    setIsEditing(false);
    setValidationErrors({});
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
    
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
        variant: 'destructive',
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);

    const imageUrl = URL.createObjectURL(file);
    
    setTimeout(() => {
      const newEditData = { ...editData, avatar: imageUrl };
      setEditData(newEditData);
      updateUser({ avatar: imageUrl });
      
      setIsUploadingImage(false);
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been updated successfully.',
      });
    }, 1500);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const removeProfilePicture = () => {
    const newEditData = { ...editData, avatar: undefined };
    setEditData(newEditData);
    updateUser({ avatar: undefined });
    toast({
      title: 'Profile Picture Removed',
      description: 'Your profile picture has been removed.',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-500';
      case 'counselor':
        return 'bg-green-500';
      case 'admin':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return '??';
    
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '??';
    
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    
    const firstInitial = words[0][0].toUpperCase();
    const lastInitial = words[words.length - 1][0].toUpperCase();
    
    return firstInitial + lastInitial;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={editData.avatar || user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    disabled={isUploadingImage}
                    title="Change profile picture"
                  >
                    {isUploadingImage ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={triggerFileInput} disabled={isUploadingImage}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload new photo
                  </DropdownMenuItem>
                  {(editData.avatar || user.avatar) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={removeProfilePicture} disabled={isUploadingImage}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove photo
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-xl text-center px-2">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center space-x-2">
              <Badge className={`${getRoleColor(user.role)} text-white`}>
                {user.role === 'student' && <GraduationCap className="h-3 w-3 mr-1" />}
                {user.role === 'counselor' && <Award className="h-3 w-3 mr-1" />}
                {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.joinDate && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            )}
            {user.timezone && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.timezone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </div>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="role-specific">
                  {user.role === 'student'
                    ? 'Academic'
                    : user.role === 'counselor'
                      ? 'Professional'
                      : 'Admin'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={isEditing ? editData.name || '' : user.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      disabled={!isEditing}
                      maxLength={40}
                      className={validationErrors.name ? 'border-red-500' : ''}
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-500">{validationErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type='email'
                      value={isEditing ? editData.email || '' : user.email || ''}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={validationErrors.email ? 'border-red-500' : ''}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={isEditing ? editData.dateOfBirth || '' : user.dateOfBirth || ''}
                      onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      max={new Date().toISOString().split('T')[0]}
                      className={validationErrors.dateOfBirth ? 'border-red-500' : ''}
                    />
                    {validationErrors.dateOfBirth && (
                      <p className="text-sm text-red-500">{validationErrors.dateOfBirth}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    {isEditing ? (
                      <Select
                        value={editData.preferredLanguage || ''}
                        onValueChange={(value) => handleFieldChange('preferredLanguage', value)}
                      >
                        <SelectTrigger className={validationErrors.preferredLanguage ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="preferredLanguage"
                        value={user.preferredLanguage || ''}
                        disabled
                      />
                    )}
                    {validationErrors.preferredLanguage && (
                      <p className="text-sm text-red-500">{validationErrors.preferredLanguage}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={isEditing ? editData.phone || '' : user.phone || ''}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      disabled={!isEditing}
                      maxLength={20}
                      className={validationErrors.phone ? 'border-red-500' : ''}
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-500">{validationErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    {isEditing ? (
                      <Select
                        value={editData.timezone || ''}
                        onValueChange={(value) => handleFieldChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonTimezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="timezone"
                        value={user.timezone || ''}
                        disabled
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={
                        isEditing ? editData.emergencyContact || '' : user.emergencyContact || ''
                      }
                      onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                      disabled={!isEditing}
                      maxLength={100}
                      className={validationErrors.emergencyContact ? 'border-red-500' : ''}
                    />
                    {validationErrors.emergencyContact && (
                      <p className="text-sm text-red-500">{validationErrors.emergencyContact}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={isEditing ? editData.emergencyPhone || '' : user.emergencyPhone || ''}
                      onChange={(e) => handleFieldChange('emergencyPhone', e.target.value)}
                      disabled={!isEditing}
                      maxLength={20}
                      className={validationErrors.emergencyPhone ? 'border-red-500' : ''}
                    />
                    {validationErrors.emergencyPhone && (
                      <p className="text-sm text-red-500">{validationErrors.emergencyPhone}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="role-specific" className="space-y-4 mt-6">
                {user.role === 'student' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={isEditing ? editData.university || '' : user.university || ''}
                        onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                        disabled={!isEditing}
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        value={isEditing ? editData.major || '' : user.major || ''}
                        onChange={(e) => setEditData({ ...editData, major: e.target.value })}
                        disabled={!isEditing}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year</Label>
                      <Input
                        id="year"
                        value={isEditing ? editData.year || '' : user.year || ''}
                        onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                        disabled={!isEditing}
                        maxLength={20}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={isEditing ? editData.studentId || '' : user.studentId || ''}
                        onChange={(e) => setEditData({ ...editData, studentId: e.target.value })}
                        disabled={!isEditing}
                        maxLength={20}
                      />
                    </div>
                  </div>
                )}

                {user.role === 'counselor' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license">License</Label>
                        <Input
                          id="license"
                          value={isEditing ? editData.license || '' : user.license || ''}
                          onChange={(e) => setEditData({ ...editData, license: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          value={isEditing ? editData.experience || '' : user.experience || ''}
                          onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Specializations</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.specialization?.map((spec, index) => (
                          <Badge key={index} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {user.role === 'admin' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={isEditing ? editData.department || '' : user.department || ''}
                        onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions?.map((permission, index) => (
                          <Badge key={index} variant="outline">
                            {permission.replace('_', ' ').toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
