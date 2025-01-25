import React from 'react';
import InputField from '@/components/Form/InputField';
import Button from '@/components/Form/Button';

export default function PasswordChangeForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">New password</h1>
        <p className="text-gray-600 text-center mb-8">Please, change the password</p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              New password
            </label>
            <InputField type="password" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Repeat password
            </label>
            <InputField type="password" />
          </div>

          <div className="flex justify-center">
            <Button />
          </div>
        </form>
      </div>
    </div>
  );
};
