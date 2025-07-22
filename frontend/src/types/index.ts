export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
}

// Team and Organization Types
export interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: {
    name: string;
    label: string;
  };
  organization: string;
  is_active: boolean;
  date_joined: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organization_type: 'company' | 'university' | 'non_profit' | 'government' | 'other';
  logo?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  created_by: string;
  created_at: string;
  users: TeamMember[];
}

export interface OrganizationInvitation {
  id: string;
  email: string;
  role: string;
  token: string;
  is_expired: boolean;
  created_at: string;
  expired_at: string;
  invited_by: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface InvitationData {
  email: string;
  role: string;
  message?: string;
}

export const ROLES = {
  ORG_OWNER: 'org_owner',
  ORG_ADMIN: 'org_admin',
  MEMBER: 'member'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
