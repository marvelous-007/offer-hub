import React from 'react';

interface WalletOption {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const WalletConnectPage: React.FC = () => {
  const walletOptions: WalletOption[] = [
    {
      name: 'Freighter',
      icon: '🚀',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200 hover:border-orange-300'
    },
    {
      name: 'Albedo',
      icon: '⭐',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200 hover:border-blue-300'
    },
    {
      name: 'xBull',
      icon: '🐂',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200 hover:border-red-300'
    },
    {
      name: 'Rabet',
      icon: '🐰',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200 hover:border-purple-300'
    },
    {
      name: 'Lobstr Vault',
      icon: '🦞',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200 hover:border-teal-300'
    }
  ];

  const handleWalletConnect = (walletName: string) => {
    console.log(`Connecting to ${walletName}...`);
    // Aquí implementarías la lógica de conexión específica para cada wallet
  };

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

        {/* Wallet Options */}
        <div className="space-y-3">
          {walletOptions.map((wallet, index) => (
            <button
              key={index}
              onClick={() => handleWalletConnect(wallet.name)}
              className={`
                w-full px-4 py-4 sm:py-5 
                bg-white border-2 rounded-full 
                ${wallet.borderColor}
                transition-all duration-200 ease-in-out
                hover:shadow-md hover:scale-[1.02]
                active:scale-[0.98]
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
                  group-hover:scale-110 transition-transform duration-200
                `}>
                  {wallet.icon}
                </div>
                
                {/* Wallet Name */}
                <span className={`
                  flex-1 text-left font-semibold text-base sm:text-lg
                  ${wallet.color}
                  group-hover:text-opacity-80 transition-colors duration-200
                `}>
                  {wallet.name}
                </span>
                
                {/* Arrow */}
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
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