import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';

// Type definitions
type TabType = 'crypto-to-cash' | 'cash-to-crypto' | 'crypto-to-fiat';

interface Currency {
  code: string;
  icon: string;
  bgColor: string;
}

interface PayFromOption {
  name: string;
  icon: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface FormValues {
  payAmount: string;
  receiveAmount: string;
  payCurrency: string;
  receiveCurrency: string;
  payFrom: string;
  payTo: string;
}

export default function CryptoWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('crypto-to-cash');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState<boolean>(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [showPayFromDropdown, setShowPayFromDropdown] = useState<boolean>(false);
  const [currencySearch, setCurrencySearch] = useState<string>('');
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState<string>('/celo.png');
  const [selectedCurrencyBg, setSelectedCurrencyBg] = useState<string>('bg-yellow-400');
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'NGN',
    name: 'Nigeria',
    flag: '🇳🇬'
  });

  const currencies: Currency[] = [
    { code: 'USDT - CELO', icon: '/celo.png', bgColor: 'bg-yellow-400' },
    { code: 'USDT - TON', icon: '/ton.png', bgColor: 'bg-blue-500' },
    { code: 'USDT - BNB', icon: '/bnb.png', bgColor: 'bg-yellow-500' },
  ];

  const countries: Country[] = [
    { code: 'NGN', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'USD', name: 'United States', flag: '🇺🇸' },
    { code: 'GBP', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'EUR', name: 'European Union', flag: '🇪🇺' },
  ];

  const payFromOptions: PayFromOption[] = [
    { name: 'Metamask', icon: '/metamask.png' },
    { name: 'Rainbow', icon: '/rainbow.png' },
    { name: 'WalletConnect', icon: '/walletconnect.png' },
    { name: 'Other Crypto Wallets (Binance, Coinbase, Bybit etc)', icon: '/otherwallet.png' },
  ];

  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Initialize selected currency
  useEffect(() => {
    const defaultCurrency = currencies[0];
    setSelectedCurrencyIcon(defaultCurrency.icon);
    setSelectedCurrencyBg(defaultCurrency.bgColor);
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    payAmount: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('Pay amount is required')
      .max(1000000, 'Amount is too large'),
    receiveAmount: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('Receive amount is required'),
    payCurrency: Yup.string().required('Pay currency is required'),
    receiveCurrency: Yup.string().required('Receive currency is required'),
    payFrom: Yup.string().required('Please select where to pay from'),
    payTo: Yup.string().required('Please select where to pay to'),
  });

  // Formik hook with navigation
  const formik = useFormik<FormValues>({
    initialValues: {
      payAmount: '1.00',
      receiveAmount: '1.00',
      payCurrency: 'USDT',
      receiveCurrency: 'NGN',
      payFrom: '',
      payTo: '',
    },
    validationSchema,
    onSubmit: async (values: FormValues, { setSubmitting }) => {
      try {
        console.log('Form submitted:', values);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        router.push('acctConfirmation');
        
      } catch (error) {
        console.error('Submission failed:', error);
        
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Helper functions
  const handlePayAmountChange = (value: string): void => {
    formik.setFieldValue('payAmount', value);
  };

  const handleReceiveAmountChange = (value: string): void => {
    formik.setFieldValue('receiveAmount', value);
  };

  const handleCurrencySearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCurrencySearch(e.target.value);
  };

  const handleCountrySearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCountrySearch(e.target.value);
  };

  const handleTabClick = (tab: TabType): void => {
    setActiveTab(tab);
  };

  const handleCurrencySelect = (currencyCode: string, icon: string, bgColor: string): void => {
    formik.setFieldValue('payCurrency', currencyCode.split(' - ')[0]);
    setSelectedCurrencyIcon(icon);
    setSelectedCurrencyBg(bgColor);
    setShowCurrencyDropdown(false);
    setCurrencySearch('');
  };

  const handleCountrySelect = (country: Country): void => {
    setSelectedCountry(country);
    formik.setFieldValue('receiveCurrency', country.code);
    setShowCountryDropdown(false);
    setCountrySearch('');
  };

  const handlePayFromSelect = (optionName: string): void => {
    formik.setFieldValue('payFrom', optionName);
    setShowPayFromDropdown(false);
  };

  const handlePayToSelect = (): void => {
    formik.setFieldValue('payTo', 'Bank Transfer');
  };

  const handleOutsideClick = (): void => {
    setShowCurrencyDropdown(false);
    setShowCountryDropdown(false);
    setShowPayFromDropdown(false);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full flex items-start justify-center p-3 sm:p-4 md:p-6 lg:p-8 py-6 sm:py-8 md:py-10">
        <div className="w-full max-w-2xl">
          <form onSubmit={formik.handleSubmit}>
            {/* Main Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-3 sm:p-4 md:p-6 lg:p-10 shadow-xl sm:shadow-2xl">
              {/* Tabs - Improved responsiveness */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-5 sm:mb-6 md:mb-8 lg:mb-10">
                <button
                  type="button"
                  onClick={() => handleTabClick('crypto-to-cash')}
                  className={`px-3 sm:px-4 md:px-6 lg:px-7 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all flex-1 sm:flex-none ${
                    activeTab === 'crypto-to-cash'
                      ? 'bg-[#013941] text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Crypto to cash
                </button>
                <button
                  type="button"
                  onClick={() => handleTabClick('cash-to-crypto')}
                  className={`px-4 sm:px-5 md:px-7 py-2.5 sm:py-3 rounded-full text-sm md:text-base font-medium transition-all flex-1 sm:flex-none ${
                    activeTab === 'cash-to-crypto'
                      ? 'bg-[#013941] text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Cash to crypto
                </button>
                <button
                  type="button"
                  onClick={() => handleTabClick('crypto-to-fiat')}
                  className={`px-4 sm:px-5 md:px-7 py-2.5 sm:py-3 rounded-full text-sm md:text-base font-medium transition-all flex-1 sm:flex-none ${
                    activeTab === 'crypto-to-fiat'
                      ? 'bg-[#013941] text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Crypto to fiat loan
                </button>
              </div>

              {/* You Pay Section */}
              <div className="border border-gray-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-7 mb-3 sm:mb-4 md:mb-5 lg:mb-6 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
                  <label className="text-gray-400 text-xs sm:text-sm md:text-base">
                    You pay
                  </label>
                  {formik.touched.payAmount && formik.errors.payAmount && (
                    <span className="text-red-500 text-xs sm:text-sm text-right">
                      {formik.errors.payAmount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  <input
                    type="text"
                    name="payAmount"
                    value={formik.values.payAmount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handlePayAmountChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light outline-none w-full sm:flex-1 min-w-0 px-0 bg-transparent"
                    placeholder="1.00"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-gray-200 rounded-full px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 hover:bg-gray-50 transition-colors flex-shrink-0 w-full sm:w-auto"
                  >
                    <div className={`${selectedCurrencyBg} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center`}>
                      <Image 
                        src={selectedCurrencyIcon} 
                        alt="Currency icon" 
                        width={20}
                        height={20}
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                      />
                    </div>
                    <span className="font-medium text-xs sm:text-sm md:text-base">{formik.values.payCurrency}</span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                  </button>
                </div>

                {/* Currency Dropdown */}
                {showCurrencyDropdown && (
                  <div className="absolute left-0 right-0 sm:right-auto sm:left-auto sm:absolute sm:right-5 top-full sm:top-24 md:top-28 mt-2 sm:mt-0 bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-gray-100 p-3 sm:p-4 w-full sm:w-72 md:w-80 z-50 max-h-64 sm:max-h-72 overflow-y-auto">
                    <div className="relative mb-3 sticky top-0 bg-white pt-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search currency"
                        value={currencySearch}
                        onChange={handleCurrencySearchChange}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-600 placeholder-gray-400 outline-none focus:bg-gray-100 transition-colors text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-1">
                      {filteredCurrencies.map((currency: Currency) => (
                        <button
                          type="button"
                          key={currency.code}
                          onClick={() => handleCurrencySelect(currency.code, currency.icon, currency.bgColor)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors"
                        >
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 ${currency.bgColor} rounded-full flex items-center justify-center`}>
                            <Image 
                              src={currency.icon} 
                              alt={currency.code} 
                              width={20}
                              height={20}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                          </div>
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            {currency.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* You Receive Section */}
              <div className="border border-gray-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-7 mb-5 sm:mb-6 md:mb-8 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <label className="text-gray-400 text-sm sm:text-base">
                    You receive
                  </label>
                  {formik.touched.receiveAmount && formik.errors.receiveAmount && (
                    <span className="text-red-500 text-xs sm:text-sm text-right">
                      {formik.errors.receiveAmount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <input
                    type="text"
                    name="receiveAmount"
                    value={formik.values.receiveAmount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleReceiveAmountChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light outline-none w-full sm:flex-1 min-w-0 px-0 bg-transparent"
                    placeholder="1.00"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 hover:bg-gray-50 transition-colors flex-shrink-0 w-full sm:w-auto"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                      {selectedCountry.flag}
                    </div>
                    <span className="font-medium text-sm sm:text-base">{selectedCountry.code}</span>
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </button>
                </div>

                {/* Country Dropdown */}
                {showCountryDropdown && (
                  <div className="absolute left-0 right-0 sm:right-auto sm:left-auto sm:absolute sm:right-5 top-full sm:top-24 md:top-28 mt-2 sm:mt-0 bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-gray-100 p-3 sm:p-4 w-full sm:w-72 md:w-80 z-50 max-h-64 sm:max-h-72 overflow-y-auto">
                    <div className="relative mb-3 sticky top-0 bg-white pt-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search country"
                        value={countrySearch}
                        onChange={handleCountrySearchChange}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-600 placeholder-gray-400 outline-none focus:bg-gray-100 transition-colors text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-1">
                      {filteredCountries.map((country: Country) => (
                        <button
                          type="button"
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-2xl">
                            {country.flag}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-gray-700 text-sm sm:text-base">
                              {country.code}
                            </span>
                            <span className="text-xs text-gray-500">{country.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pay From Dropdown */}
              <div className="mb-4 sm:mb-5 md:mb-6 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <label className="text-gray-700 text-sm sm:text-base font-medium">
                    Pay from
                  </label>
                  {formik.touched.payFrom && formik.errors.payFrom && (
                    <span className="text-red-500 text-xs sm:text-sm text-right">
                      {formik.errors.payFrom}
                    </span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPayFromDropdown(!showPayFromDropdown)}
                  className="w-full border border-gray-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className={`text-sm sm:text-base ${formik.values.payFrom ? 'text-gray-700' : 'text-gray-400'} truncate`}>
                    {formik.values.payFrom || 'Select an option'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>

                {/* Pay From Options Dropdown */}
                {showPayFromDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-gray-100 p-2 z-50 max-h-64 sm:max-h-72 overflow-y-auto">
                    {payFromOptions.map((option: PayFromOption) => (
                      <button
                        type="button"
                        key={option.name}
                        onClick={() => handlePayFromSelect(option.name)}
                        className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors text-left"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                          <Image 
                            src={option.icon} 
                            alt={option.name} 
                            width={28}
                            height={28}
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          />
                        </div>
                        <span className="font-medium text-gray-700 text-sm sm:text-base truncate">
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pay To Dropdown */}
              <div className="mb-6 sm:mb-7 md:mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <label className="text-gray-700 text-sm sm:text-base font-medium">
                    Pay to
                  </label>
                  {formik.touched.payTo && formik.errors.payTo && (
                    <span className="text-red-500 text-xs sm:text-sm text-right">
                      {formik.errors.payTo}
                    </span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={handlePayToSelect}
                  className="w-full border border-gray-200 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className={`text-sm sm:text-base ${formik.values.payTo ? 'text-gray-700' : 'text-gray-400'} truncate`}>
                    {formik.values.payTo || 'Select an option'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              </div>

              {/* Convert Button */}
              <button 
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className={`w-full ${
                  formik.isSubmitting || !formik.isValid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#013941] hover:bg-[#012f34]'
                } text-white text-base sm:text-lg font-medium py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl md:rounded-3xl transition-colors shadow-lg`}
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg 
                      className="animate-spin h-5 w-5 mr-3 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Convert now'
                )}
              </button>

              {/* Validation Summary */}
              {!formik.isValid && formik.submitCount > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium text-center">
                    Please fix all errors before submitting the form.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showCurrencyDropdown || showCountryDropdown || showPayFromDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleOutsideClick}
        />
      )}
    </div>
  );
}