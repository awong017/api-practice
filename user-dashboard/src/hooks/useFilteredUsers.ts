import { useMemo } from 'react';
import { User, SortConfig } from '../types';

export function useFilteredUsers(
  users: User[],
  searchQuery: string,
  sortConfig: SortConfig | null
) {
  return useMemo(() => {
    let filteredUsers = [...users];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig) {
      filteredUsers.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredUsers;
  }, [users, searchQuery, sortConfig]);
}

// Helper function to get nested object values
function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((o, k) => (o || {})[k], obj) || '';
}