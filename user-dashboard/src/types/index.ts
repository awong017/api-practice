export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface NewUser {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof User;
  direction: SortDirection;
}

export interface AppState {
  users: User[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortConfig: SortConfig | null;
}

export interface AppContextType extends AppState {
  addUser: (user: NewUser) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}