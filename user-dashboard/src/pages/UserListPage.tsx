import React, { Suspense } from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Lazy load the UserTable component for code splitting
const UserTable = React.lazy(() => import('../components/UserTable'));

export function UserListPage() {
  const { loading, error } = useApp();

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view user information
          </p>
        </div>
      </div>

      <SearchBar />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          <UserTable />
        </Suspense>
      )}
    </div>
  );
}