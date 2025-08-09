"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RoleSelector from '@/components/auth/RoleSelector';
import SignInForm from '@/components/auth/SignInForm';

// Component that uses useSearchParams - needs to be wrapped in Suspense
const SignInNotFoundContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rejectedEmail = searchParams.get('email') || 'AdebayoDoe@yahoo.com';
  const [email, setEmail] = useState(rejectedEmail);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: 'freelancer' | 'client') => {
    setIsLoading(true);
    router.push(`/onboarding/sign-up?role=${role}&email=${encodeURIComponent(email)}`);
  };

  const handleSignIn = (method: 'apple' | 'google' | 'email', data?: { email: string; password?: string }) => {
    setIsLoading(true);

    switch (method) {
      case 'apple':
        console.log('Signing in with Apple');
        break;
      case 'google':
        console.log('Signing in with Google');
        break;
      case 'email':
        if (data?.email) {
          console.log('Attempting sign in with email:', data.email);
        }
        break;
    }

    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handleCreateAccount = () => {
    setIsLoading(true);
    router.push(`/onboarding/sign-up?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className='bg-[#F1F3F7] rounded-xl p-4 mb-6'>
          <RoleSelector
            email={rejectedEmail}
            onRoleSelect={handleRoleSelect}
            className=""
          />
        </div>

        <SignInForm
          email={email}
          onEmailChange={handleEmailChange}
          onSignIn={handleSignIn}
          showSocialAuth={true}
          showEmailAuth={true}
          showPasswordField={false}
          disabled={isLoading}
          className="mb-20"
        />

        <div className="text-center justify-center flex flex-col items-center">
          <p className="text-[#6D758F] text-[10px] mb-4">
            New to OfferHub? Create an account.
          </p>
          <button
            onClick={handleCreateAccount}
            disabled={isLoading}
            className="w-3/4 bg-[#149A9B] text-white py-2 px-4 rounded-full font-medium hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component that wraps SignInNotFoundContent in Suspense
const SignInNotFoundPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SignInNotFoundContent />
    </Suspense>
  );
};

export default SignInNotFoundPage;