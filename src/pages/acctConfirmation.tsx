import { useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RecipientDetails() {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('ODUTUGA GBEKE');
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  const banks = [
    'Access Bank',
    'GTBank',
    'First Bank',
    'Zenith Bank',
    'UBA',
    'Stanbic IBTC',
    'Fidelity Bank',
    'Union Bank',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      <div className="w-full min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6 md:p-8 py-8 sm:py-6">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl">
            {/* Header */}
            <div className="flex items-center mb-6 sm:mb-8 md:mb-12">
              <Link href="/" className="mr-3 sm:mr-4 md:mr-6 p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700" />
              </Link>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-teal-900">
                Recipient details
              </h1>
            </div>

            {/* Bank Dropdown */}
            <div className="mb-5 sm:mb-6 md:mb-8">
              <label className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 block">
                Bank
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowBankDropdown(!showBankDropdown)}
                  className="w-full border-2 border-gray-200 rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between hover:border-gray-300 transition-colors bg-white"
                >
                  <span className={`text-sm sm:text-base md:text-lg ${selectedBank ? 'text-teal-900' : 'text-gray-400'}`}>
                    {selectedBank || 'Select an option'}
                  </span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 transition-transform flex-shrink-0 ${showBankDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Bank Options Dropdown */}
                {showBankDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 max-h-48 sm:max-h-64 overflow-y-auto">
                    {banks.map((bank) => (
                      <button
                        key={bank}
                        onClick={() => {
                          setSelectedBank(bank);
                          setShowBankDropdown(false);
                        }}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-gray-50 transition-colors text-teal-900 text-sm sm:text-base md:text-lg"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Account Number Input */}
            <div className="mb-5 sm:mb-6 md:mb-8">
              <label className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 block">
                Account number
              </label>
              <input
                type="text"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg text-gray-700 placeholder-gray-400 outline-none focus:border-teal-600 transition-colors"
              />
            </div>

            {/* Account Name Display */}
            <div className="mb-6 sm:mb-8 md:mb-12">
              <label className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 block">
                Account name
              </label>
              <div className="bg-gray-100 rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                <span className="text-sm sm:text-base md:text-lg text-teal-900 font-medium">
                  {accountName}
                </span>
              </div>
            </div>

            {/* Next Button */}
            <button className="w-full bg-teal-800 hover:bg-teal-900 text-white text-base sm:text-lg md:text-xl font-semibold py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl md:rounded-[2rem] transition-colors shadow-lg">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showBankDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowBankDropdown(false)}
        />
      )}
    </div>
  );
}