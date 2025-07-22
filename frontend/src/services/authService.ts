const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterOwnerRequest {
  full_name: string;
  email: string;
  password: string;
  organization: {
    name: string;
    organization_type: string;
    description?: string;
    contact_email?: string;
    phone?: string;
    website?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface RegisterAttendeeRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  date_of_birth?: string;
  city?: string;
  country?: string;
  interests?: string;
}

export interface RegisterAdminRequest {
  full_name: string;
  email: string;
  password: string;
  invite_token: string;
}

export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    organization?: {
      id: string;
      name: string;
      slug: string;
    };
    is_active: boolean;
  };
  token: string;
  refresh_token?: string;
}

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const response_json = response.json()

      return response_json['data'];
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async registerOwner(data: RegisterOwnerRequest): Promise<{ message: string; email: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/owner/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      console.error('Owner registration error:', error);
      throw error;
    }
  }

  static async registerAttendee(data: RegisterAttendeeRequest): Promise<{ message: string; email: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/attendee/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      console.error('Attendee registration error:', error);
      throw error;
    }
  }

  static async registerAdmin(data: RegisterAdminRequest): Promise<{ message: string; email: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/admin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      console.error('Admin registration error:', error);
      throw error;
    }
  }

  static async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }

      return response.json();
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  static async resendVerificationCode(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend verification code');
      }

      return response.json();
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  static async confirmResetPassword(data: ConfirmResetPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset confirmation failed');
      }

      return response.json();
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  static async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, try to refresh
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const refreshResponse = await this.refreshToken(refreshToken);
              localStorage.setItem('token', refreshResponse.token);
              
              // Retry the original request
              const retryResponse = await fetch(`${API_BASE_URL}/auth/me/`, {
                headers: {
                  'Authorization': `Bearer ${refreshResponse.token}`,
                },
              });
              
              if (retryResponse.ok) {
                return retryResponse.json();
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
          
          // Clear invalid tokens
          this.logout();
          return null;
        }
        throw new Error('Failed to get current user');
      }

      return response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  static getStoredUser(): AuthResponse['user'] | null {
    if (typeof window === 'undefined') return null;
    
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  }
}
