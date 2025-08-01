import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the UserService to avoid API calls in tests
jest.mock('./services/userService', () => ({
  UserService: {
    fetchUsers: jest.fn().mockResolvedValue([]),
  },
}));

describe('App Component', () => {
  test('renders navigation and main content', () => {
    render(<App />);
    
    // Check if navigation elements are present
    expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User List')).toBeInTheDocument();
    expect(screen.getByText('Add User')).toBeInTheDocument();
    
    // Check if main content area is present
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(<App />);
    
    expect(screen.getByText('Built with React, TypeScript, and Tailwind CSS')).toBeInTheDocument();
  });

  test('has proper accessibility structure', () => {
    render(<App />);
    
    // Check for proper ARIA roles
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for navigation landmark
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });
});
