
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState, LoginData, SignupData, User } from '@/types/auth';
import { toast } from '@/components/ui/sonner';
import {
  AUTH_TOKEN_KEY,
  CURRENT_USER_KEY,
  USERS_KEY,
} from '@/lib/authStorage';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local user database (using localStorage)
interface StoredUser extends User {
  password: string; // hashed in production
}

function getStoredUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(password: string): string {
  // Simple hash for demo purposes - NOT production-grade
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

function generateToken(): string {
  return 'token_' + Math.random().toString(36).substr(2, 20) + '_' + Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultAuthState);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({ ...defaultAuthState, isLoading: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setState({ 
          ...defaultAuthState, 
          isLoading: false, 
          error: 'Authentication check failed' 
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      const users = getStoredUsers();
      const user = users.find(u => u.email === data.email);

      if (!user || user.password !== hashPassword(data.password)) {
        throw new Error('Invalid email or password');
      }

      const token = generateToken();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      }));

      setState({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState({ 
        ...state, 
        isLoading: false, 
        error: message,
      });
      toast.error(message);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      const users = getStoredUsers();
      const existingUser = users.find(u => u.email === data.email);

      if (existingUser) {
        throw new Error('Email already registered');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const newUser: StoredUser = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.name || data.email.split('@')[0],
        password: hashPassword(data.password),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveUsers(users);

      setState({
        ...state,
        isLoading: false,
        error: null,
      });

      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      setState({ 
        ...state, 
        isLoading: false, 
        error: message,
      });
      toast.error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    setState({ ...defaultAuthState, isLoading: false });
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
