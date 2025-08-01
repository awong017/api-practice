import { renderHook } from '@testing-library/react';
import { useFilteredUsers } from './useFilteredUsers';
import { User } from '../types';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '123-456-7890',
    website: 'johndoe.com',
    address: {
      street: '123 Main St',
      suite: 'Apt 1',
      city: 'Anytown',
      zipcode: '12345',
      geo: { lat: '0', lng: '0' }
    },
    company: {
      name: 'Acme Corp',
      catchPhrase: 'Quality first',
      bs: 'Business solutions'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    website: 'janesmith.com',
    address: {
      street: '456 Oak Ave',
      suite: 'Suite 2',
      city: 'Other City',
      zipcode: '67890',
      geo: { lat: '1', lng: '1' }
    },
    company: {
      name: 'Tech Solutions',
      catchPhrase: 'Innovation matters',
      bs: 'Technology consulting'
    }
  },
  {
    id: 3,
    name: 'Bob Johnson',
    username: 'bobjohnson',
    email: 'bob@company.com',
    phone: '555-123-4567',
    website: 'bobjohnson.net',
    address: {
      street: '789 Pine Rd',
      suite: '',
      city: 'Pine Valley',
      zipcode: '11111',
      geo: { lat: '2', lng: '2' }
    },
    company: {
      name: 'Design Studio',
      catchPhrase: 'Creative solutions',
      bs: 'Graphic design'
    }
  }
];

describe('useFilteredUsers Hook', () => {
  test('returns all users when no search query or sort config', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, '', null)
    );

    expect(result.current).toHaveLength(3);
    expect(result.current).toEqual(mockUsers);
  });

  test('filters users by name', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, 'John Doe', null)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('John Doe');
  });

  test('filters users by email', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, 'jane@example', null)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Jane Smith');
  });

  test('filters users by username', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, 'bobjohnson', null)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Bob Johnson');
  });

  test('returns empty array when no matches found', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, 'nonexistent', null)
    );

    expect(result.current).toHaveLength(0);
  });

  test('sorts users by name ascending', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, '', { key: 'name', direction: 'asc' })
    );

    expect(result.current[0].name).toBe('Bob Johnson');
    expect(result.current[1].name).toBe('Jane Smith');
    expect(result.current[2].name).toBe('John Doe');
  });

  test('sorts users by name descending', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, '', { key: 'name', direction: 'desc' })
    );

    expect(result.current[0].name).toBe('John Doe');
    expect(result.current[1].name).toBe('Jane Smith');
    expect(result.current[2].name).toBe('Bob Johnson');
  });

  test('sorts users by email ascending', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, '', { key: 'email', direction: 'asc' })
    );

    expect(result.current[0].email).toBe('bob@company.com');
    expect(result.current[1].email).toBe('jane@example.com');
    expect(result.current[2].email).toBe('john@example.com');
  });

  test('combines search and sort', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, 'example', { key: 'name', direction: 'desc' })
    );

    expect(result.current).toHaveLength(2);
    expect(result.current[0].name).toBe('John Doe');
    expect(result.current[1].name).toBe('Jane Smith');
  });

  test('is case insensitive for search', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, 'JOHN DOE', null)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('John Doe');
  });

  test('trims whitespace from search query', () => {
    const { result } = renderHook(() => 
      useFilteredUsers(mockUsers, '  John Doe  ', null)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('John Doe');
  });
});