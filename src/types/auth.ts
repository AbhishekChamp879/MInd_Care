export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'counselor' | 'admin';
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  preferredLanguage?: string;
  timezone?: string;
  joinDate?: string;
  lastActive?: string;
  // Student-specific
  university?: string;
  major?: string;
  year?: string;
  studentId?: string;
  // Counselor-specific
  license?: string;
  specialization?: string[];
  experience?: string;
  // Admin-specific
  department?: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'student' | 'counselor' | 'admin';
}

// Mock users for demo
export const mockUsers: Record<string, { user: User; password: string }> = {
  'student@mindbuddy.com': {
    password: 'student123',
    user: {
      id: '1',
      name: 'Alex Student',
      email: 'student@mindbuddy.com',
      role: 'student',
      avatar: '/api/placeholder/150/150',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '2002-05-15',
      emergencyContact: 'Maria Student (Mother)',
      emergencyPhone: '+1 (555) 123-4568',
      preferredLanguage: 'English',
      timezone: 'America/New_York',
      joinDate: '2024-01-15',
      lastActive: new Date().toISOString(),
      university: 'State University',
      major: 'Psychology',
      year: 'Junior',
      studentId: 'STU-2024-001',
    },
  },
  'counselor@mindbuddy.com': {
    password: 'counselor123',
    user: {
      id: '2',
      name: 'Dr. Sarah Wilson',
      email: 'counselor@mindbuddy.com',
      role: 'counselor',
      avatar: '/api/placeholder/150/150',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1985-08-22',
      emergencyContact: 'John Wilson (Spouse)',
      emergencyPhone: '+1 (555) 234-5679',
      preferredLanguage: 'English',
      timezone: 'America/New_York',
      joinDate: '2023-06-01',
      lastActive: new Date().toISOString(),
      license: 'Licensed Clinical Social Worker (LCSW)',
      specialization: [
        'Anxiety Disorders',
        'Depression',
        'Student Counseling',
        'Crisis Intervention',
      ],
      experience: '8 years',
    },
  },
  'admin@mindbuddy.com': {
    password: 'admin123',
    user: {
      id: '3',
      name: 'Admin User',
      email: 'admin@mindbuddy.com',
      role: 'admin',
      avatar: '/api/placeholder/150/150',
      phone: '+1 (555) 345-6789',
      dateOfBirth: '1980-12-10',
      emergencyContact: 'Emergency Admin Contact',
      emergencyPhone: '+1 (555) 345-6790',
      preferredLanguage: 'English',
      timezone: 'America/New_York',
      joinDate: '2023-01-01',
      lastActive: new Date().toISOString(),
      department: 'System Administration',
      permissions: ['user_management', 'system_settings', 'analytics_view', 'content_moderation'],
    },
  },
};
