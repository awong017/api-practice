import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import { AppProvider } from '../context/AppContext';

// Mock the UserService
jest.mock('../services/userService', () => ({
  UserService: {
    fetchUsers: jest.fn().mockResolvedValue([]),
  },
}));

const SearchBarWithProvider = () => (
  <AppProvider>
    <SearchBar />
  </AppProvider>
);

describe('SearchBar Component', () => {
  test('renders search input with proper accessibility attributes', () => {
    render(<SearchBarWithProvider />);
    
    const searchInput = screen.getByLabelText('Search users by name, username, or email');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search users by name, username, or email...');
    expect(searchInput).toHaveAttribute('aria-describedby', 'search-description');
  });

  test('renders search description', () => {
    render(<SearchBarWithProvider />);
    
    expect(screen.getByText('Search by name, username, or email address')).toBeInTheDocument();
  });

  test('updates input value when user types', async () => {
    render(<SearchBarWithProvider />);
    
    const searchInput = screen.getByLabelText('Search users by name, username, or email');
    
    await act(async () => {
      await userEvent.type(searchInput, 'John');
    });
    
    expect(searchInput).toHaveValue('John');
  });

  test('shows clear button when input has value', async () => {
    render(<SearchBarWithProvider />);
    
    const searchInput = screen.getByLabelText('Search users by name, username, or email');
    
    // Initially, clear button should not be visible
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    
    // Type something
    await act(async () => {
      await userEvent.type(searchInput, 'John');
    });
    
    // Clear button should now be visible
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  test('clears input when clear button is clicked', async () => {
    render(<SearchBarWithProvider />);
    
    const searchInput = screen.getByLabelText('Search users by name, username, or email');
    
    // Type something
    await act(async () => {
      await userEvent.type(searchInput, 'John');
    });
    expect(searchInput).toHaveValue('John');
    
    // Click clear button
    const clearButton = screen.getByLabelText('Clear search');
    await act(async () => {
      await userEvent.click(clearButton);
    });
    
    expect(searchInput).toHaveValue('');
  });

  test('debounces search query updates', async () => {
    jest.useFakeTimers();
    
    render(<SearchBarWithProvider />);
    
    const searchInput = screen.getByLabelText('Search users by name, username, or email');
    
    // Type quickly
    await act(async () => {
      await userEvent.type(searchInput, 'John');
    });
    
    // Advance timers by less than debounce delay
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Type more
    await act(async () => {
      await userEvent.type(searchInput, ' Doe');
    });
    
    // Advance timers by debounce delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(searchInput).toHaveValue('John Doe');
    
    jest.useRealTimers();
  });
});