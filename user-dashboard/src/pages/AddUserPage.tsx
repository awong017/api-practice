import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Lazy load the AddUserForm component for code splitting
const AddUserForm = React.lazy(() => import('../components/AddUserForm'));

export function AddUserPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new user profile with the form below
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <AddUserForm />
      </Suspense>
    </div>
  );
}