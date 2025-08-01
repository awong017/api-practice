import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, NewUser, AppState, AppContextType, SortConfig } from '../types';
import { UserService } from '../services/userService';

// Initial state
const initialState: AppState = {
  users: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortConfig: null,
};

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SORT_CONFIG'; payload: SortConfig | null };

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false, error: null };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT_CONFIG':
      return { ...state, sortConfig: action.payload };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const users = await UserService.fetchUsers();
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
      }
    };

    loadUsers();
  }, []);

  // Context value
  const contextValue: AppContextType = {
    ...state,
    addUser: (newUser: NewUser) => {
      // Generate a new ID (in a real app, this would be handled by the backend)
      const user: User = {
        ...newUser,
        id: Math.max(...state.users.map(u => u.id), 0) + 1,
        address: {
          ...newUser.address,
          geo: { lat: '0', lng: '0' }
        }
      };
      dispatch({ type: 'ADD_USER', payload: user });
    },
    setSearchQuery: (query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    },
    setSortConfig: (config: SortConfig | null) => {
      dispatch({ type: 'SET_SORT_CONFIG', payload: config });
    },
    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}