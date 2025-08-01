import React, { useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useApp } from '../context/AppContext';
import { useFilteredUsers } from '../hooks/useFilteredUsers';
import { User } from '../types';
import { UserModal } from './UserModal';

const UserTable: React.FC = () => {
  const { users, searchQuery, sortConfig, setSortConfig } = useApp();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredUsers = useFilteredUsers(users, searchQuery, sortConfig);
  
  // Virtual scrolling setup for performance with large lists
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65, // Estimated row height
    overscan: 5,
  });

  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getSortIcon = (columnKey: keyof User) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchQuery ? 'Try adjusting your search criteria.' : 'No users available.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({filteredUsers.length})
          </h3>
        </div>
        
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-3">
            <button
              className="table-header flex items-center justify-between text-left"
              onClick={() => handleSort('name')}
              aria-label="Sort by name"
            >
              <span>Name</span>
              {getSortIcon('name')}
            </button>
            <button
              className="table-header flex items-center justify-between text-left hidden md:block"
              onClick={() => handleSort('email')}
              aria-label="Sort by email"
            >
              <span>Email</span>
              {getSortIcon('email')}
            </button>
            <button
              className="table-header flex items-center justify-between text-left hidden md:block"
              onClick={() => handleSort('phone')}
              aria-label="Sort by phone"
            >
              <span>Phone</span>
              {getSortIcon('phone')}
            </button>
            <div className="table-header hidden md:block">
              Company
            </div>
          </div>
        </div>

        {/* Virtualized Table Body */}
        <div
          ref={parentRef}
          className="h-96 overflow-auto"
          role="grid"
          aria-label="Users table"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const user = filteredUsers[virtualItem.index];
              return (
                <div
                  key={user.id}
                  className="absolute top-0 left-0 w-full border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  onClick={() => handleRowClick(user)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowClick(user);
                    }
                  }}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`View details for ${user.name}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4">
                    <div className="table-cell">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">{user.email}</div>
                    </div>
                    <div className="table-cell hidden md:block">{user.email}</div>
                    <div className="table-cell hidden md:block">{user.phone}</div>
                    <div className="table-cell hidden md:block">{user.company.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default UserTable;