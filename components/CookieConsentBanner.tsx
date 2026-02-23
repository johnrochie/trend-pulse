'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always enabled, cannot be disabled
    performance: false,
    functional: false,
    advertising: false,
  });

  // Check if user has already made a choice
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = {
      essential: true,
      performance: true,
      functional: true,
      advertising: true,
    };
    setCookiePreferences(preferences);
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setIsVisible(false);
    
    // In a real implementation, you would initialize cookies based on preferences
    console.log('Cookies accepted:', preferences);
  };

  const handleAcceptNecessary = () => {
    const preferences = {
      essential: true,
      performance: false,
      functional: false,
      advertising: false,
    };
    setCookiePreferences(preferences);
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setIsVisible(false);
    
    // In a real implementation, you would only set essential cookies
    console.log('Only necessary cookies accepted:', preferences);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setIsVisible(false);
    setIsSettingsOpen(false);
    
    // In a real implementation, you would set cookies based on preferences
    console.log('Custom cookie preferences saved:', cookiePreferences);
  };

  const toggleCookieType = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <Cookie className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    We Use Cookies
                  </h3>
                  <p className="text-sm text-gray-400">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    By clicking "Accept All", you consent to our use of cookies. 
                    <Link href="/cookies" className="text-blue-400 hover:text-blue-300 ml-1">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Necessary Only
              </button>
              
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Customize
              </button>
              
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white md:relative md:top-0 md:right-0"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-bold text-white">
                    Cookie Preferences
                  </h2>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="font-semibold text-white">Essential Cookies</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-400">Always Active</span>
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Necessary for the website to function. Cannot be disabled.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h3 className="font-semibold text-white">Performance Cookies</h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>
                    <button
                      onClick={() => toggleCookieType('performance')}
                      className={`w-12 h-6 rounded-full transition-colors ${cookiePreferences.performance ? 'bg-blue-600' : 'bg-gray-700'}`}
                      aria-label={cookiePreferences.performance ? 'Disable performance cookies' : 'Enable performance cookies'}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${cookiePreferences.performance ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <h3 className="font-semibold text-white">Functional Cookies</h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Enable enhanced functionality and personalization.
                      </p>
                    </div>
                    <button
                      onClick={() => toggleCookieType('functional')}
                      className={`w-12 h-6 rounded-full transition-colors ${cookiePreferences.functional ? 'bg-purple-600' : 'bg-gray-700'}`}
                      aria-label={cookiePreferences.functional ? 'Disable functional cookies' : 'Enable functional cookies'}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${cookiePreferences.functional ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <h3 className="font-semibold text-white">Advertising Cookies</h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Used to deliver relevant advertisements and measure ad performance.
                      </p>
                    </div>
                    <button
                      onClick={() => toggleCookieType('advertising')}
                      className={`w-12 h-6 rounded-full transition-colors ${cookiePreferences.advertising ? 'bg-yellow-600' : 'bg-gray-700'}`}
                      aria-label={cookiePreferences.advertising ? 'Disable advertising cookies' : 'Enable advertising cookies'}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${cookiePreferences.advertising ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-1">Your Privacy Matters</h4>
                      <p className="text-sm text-blue-400/80">
                        You can change your preferences at any time by clicking "Cookie Settings" in our footer. 
                        For more information, please read our <Link href="/cookies" className="text-blue-300 hover:text-blue-200 underline">Cookie Policy</Link>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={handleAcceptNecessary}
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Accept Necessary Only
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}