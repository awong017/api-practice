import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { NewUser } from '../types';

interface FormErrors {
  [key: string]: string;
}

const AddUserForm: React.FC = () => {
  const { addUser } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<NewUser>({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
    },
    company: {
      name: '',
      catchPhrase: '',
      bs: '',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street is required';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!formData.address.zipcode.trim()) {
      newErrors['address.zipcode'] = 'Zipcode is required';
    }

    if (!formData.company.name.trim()) {
      newErrors['company.name'] = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev as any)[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return prev;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      element?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addUser(formData);
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      website: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
      },
      company: {
        name: '',
        catchPhrase: '',
        bs: '',
      },
    });
    setErrors({});
  };

  if (showSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">User Added Successfully!</h3>
        <p className="mt-1 text-sm text-gray-500">
          Redirecting to user list...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-sm rounded-lg p-6">
      {/* Basic Information */}
      <fieldset>
        <legend className="text-lg font-medium text-gray-900 mb-4">Basic Information</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              className={`mt-1 input ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username *
            </label>
            <input
              type="text"
              id="username"
              className={`mt-1 input ${errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              aria-describedby={errors.username ? 'username-error' : undefined}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p id="username-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              className={`mt-1 input ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              className={`mt-1 input ${errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              className="mt-1 input"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="example.com"
            />
          </div>
        </div>
      </fieldset>

      {/* Address Information */}
      <fieldset>
        <legend className="text-lg font-medium text-gray-900 mb-4">Address</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              Street Address *
            </label>
            <input
              type="text"
              id="address.street"
              className={`mt-1 input ${errors['address.street'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              aria-describedby={errors['address.street'] ? 'address-street-error' : undefined}
              aria-invalid={!!errors['address.street']}
            />
            {errors['address.street'] && (
              <p id="address-street-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors['address.street']}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="address.suite" className="block text-sm font-medium text-gray-700">
              Suite/Apt
            </label>
            <input
              type="text"
              id="address.suite"
              className="mt-1 input"
              value={formData.address.suite}
              onChange={(e) => handleInputChange('address.suite', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              id="address.city"
              className={`mt-1 input ${errors['address.city'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              aria-describedby={errors['address.city'] ? 'address-city-error' : undefined}
              aria-invalid={!!errors['address.city']}
            />
            {errors['address.city'] && (
              <p id="address-city-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors['address.city']}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="address.zipcode" className="block text-sm font-medium text-gray-700">
              ZIP Code *
            </label>
            <input
              type="text"
              id="address.zipcode"
              className={`mt-1 input ${errors['address.zipcode'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.address.zipcode}
              onChange={(e) => handleInputChange('address.zipcode', e.target.value)}
              aria-describedby={errors['address.zipcode'] ? 'address-zipcode-error' : undefined}
              aria-invalid={!!errors['address.zipcode']}
            />
            {errors['address.zipcode'] && (
              <p id="address-zipcode-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors['address.zipcode']}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Company Information */}
      <fieldset>
        <legend className="text-lg font-medium text-gray-900 mb-4">Company</legend>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="company.name" className="block text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <input
              type="text"
              id="company.name"
              className={`mt-1 input ${errors['company.name'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={formData.company.name}
              onChange={(e) => handleInputChange('company.name', e.target.value)}
              aria-describedby={errors['company.name'] ? 'company-name-error' : undefined}
              aria-invalid={!!errors['company.name']}
            />
            {errors['company.name'] && (
              <p id="company-name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors['company.name']}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="company.catchPhrase" className="block text-sm font-medium text-gray-700">
              Catch Phrase
            </label>
            <input
              type="text"
              id="company.catchPhrase"
              className="mt-1 input"
              value={formData.company.catchPhrase}
              onChange={(e) => handleInputChange('company.catchPhrase', e.target.value)}
              placeholder="A memorable slogan"
            />
          </div>

          <div>
            <label htmlFor="company.bs" className="block text-sm font-medium text-gray-700">
              Business Description
            </label>
            <textarea
              id="company.bs"
              rows={3}
              className="mt-1 input"
              value={formData.company.bs}
              onChange={(e) => handleInputChange('company.bs', e.target.value)}
              placeholder="Describe the business..."
            />
          </div>
        </div>
      </fieldset>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding User...
            </>
          ) : (
            'Add User'
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-secondary flex-1 sm:flex-none"
          disabled={isSubmitting}
        >
          Reset Form
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Fields marked with * are required
      </p>
    </form>
  );
};

export default AddUserForm;