import React from 'react';
import InputField from '@/components/Form/InputField';
import Button from '@/components/Form/Button';
import Image from 'next/image';

export default function PasswordChangeForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <div className="absolute top-0 left-0 h-full w-1/4">
        <Image
          src="/images/left.png"
          alt="left-side"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 mx-auto bg-white">
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
      
      <div className="absolute top-0 right-0 h-full w-1/4">
        <Image
          src="/images/right.png"
          alt="right-side"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
