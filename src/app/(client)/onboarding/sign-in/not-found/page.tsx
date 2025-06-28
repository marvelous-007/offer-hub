"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RoleSelector from '@/components/auth/RoleSelector';
import NotFoundBanner from '@/components/auth/NotFoundBanner';
import SignInForm from '@/components/auth/SignInForm';

const SignInNotFoundPage: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-2 text-xl font-bold text-gray-900">OfferHub</h1>
          </div>
          <button 
            onClick={() => router.push('/onboarding/sign-up')}
            disabled={isLoading}
            className="bg-[#002333] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign up
          </button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">

        <NotFoundBanner 
          email={rejectedEmail}
          variant="info"
          className="mb-6"
        />
        
        <RoleSelector 
          email={rejectedEmail}
          onRoleSelect={handleRoleSelect}
          className="mb-6"
        />
        
        <SignInForm 
          email={email}
          onEmailChange={handleEmailChange}
          onSignIn={handleSignIn}
          showSocialAuth={true}
          showEmailAuth={true}
          showPasswordField={false}
          disabled={isLoading}
          className="mb-8"
        />

        <div className="text-center">
          <p className="text-gray-600 text-sm mb-4">
            New to OfferHub? Create an account.
          </p>
          <button 
            onClick={handleCreateAccount}
            disabled={isLoading}
            className="w-full bg-[#149A9B] text-white py-3 px-4 rounded-full font-medium hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Make sure you're using the correct email address or try signing in with a social account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInNotFoundPage;