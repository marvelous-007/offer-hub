"use client";

import React from 'react';
import { useWallet } from './useWallet.hook';
import { 
  FREIGHTER_ID, 
  LOBSTR_ID,
  ALBEDO_ID,
  XBULL_ID,
  RABET_ID 
} from '@creit.tech/stellar-wallets-kit';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  available: boolean;
}

const WalletConnectPage: React.FC = () => {
  const { connectWallet, isConnecting, error, isConnected, walletAddress } = useWallet();

  const walletOptions: WalletOption[] = [
    {
      id: FREIGHTER_ID,
      name: 'Freighter',
      icon: '🚀',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200 hover:border-orange-300',
      available: true
    },
    {
      id: ALBEDO_ID,
      name: 'Albedo',
      icon: '⭐',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200 hover:border-blue-300',
      available: true
    },
    {
      id: XBULL_ID,
      name: 'xBull',
      icon: '🐂',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200 hover:border-red-300',
      available: true
    },
    {
      id: RABET_ID,
      name: 'Rabet',
      icon: '🐰',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200 hover:border-purple-300',
      available: true
    },
    {
      id: LOBSTR_ID,
      name: 'Lobstr Vault',
      icon: '🦞',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200 hover:border-teal-300',
      available: true
    }
  ];

  const handleWalletConnect = async (walletId: string) => {
    const result = await connectWallet(walletId);
    
    if (result.success) {
      console.log(`Successfully connected to wallet: ${result.address}`);
      // Aquí puedes redirigir o mostrar mensaje de éxito
    } else {
      console.error(`Failed to connect: ${result.error}`);
    }
  };

  // Si ya está conectado, mostrar estado conectado
  if (isConnected && walletAddress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connected!</h2>
            <p className="text-gray-600 mb-4">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-[#15949C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#15949C]/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Connect wallet
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Connect wallet to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3">
          {walletOptions.map((wallet, index) => (
            <button
              key={index}
              onClick={() => handleWalletConnect(wallet.id)}
              disabled={isConnecting || !wallet.available}
              className={`
                w-full px-4 py-4 sm:py-5 
                bg-white border-2 rounded-full 
                ${wallet.borderColor}
                ${isConnecting || !wallet.available 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'transition-all duration-200 ease-in-out hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                group
              `}
            >
              <div className="flex items-center justify-center space-x-4">
                {/* Icon */}
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 
                  ${wallet.bgColor} 
                  rounded-xl flex items-center justify-center
                  text-lg sm:text-xl
                  ${!isConnecting && wallet.available ? 'group-hover:scale-110 transition-transform duration-200' : ''}
                `}>
                  {isConnecting ? (
                    <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                  ) : (
                    wallet.icon
                  )}
                </div>
                
                {/* Wallet Name */}
                <span className={`
                  flex-1 text-left font-semibold text-base sm:text-lg
                  ${wallet.color}
                  ${!isConnecting && wallet.available ? 'group-hover:text-opacity-80 transition-colors duration-200' : ''}
                `}>
                  {wallet.name}
                  {!wallet.available && (
                    <span className="text-gray-400 text-sm block">Not available</span>
                  )}
                </span>
                
                {/* Arrow */}
                <div className={`
                  text-gray-400 
                  ${!isConnecting && wallet.available ? 'group-hover:text-gray-600 transition-colors duration-200' : ''}
                `}>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isConnecting && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Connecting to wallet...</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            By connecting your wallet, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectPage;