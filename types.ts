
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  created_at: string;
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
}
