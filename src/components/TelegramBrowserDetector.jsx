import React, { useState, useEffect } from 'react';

const TelegramBrowserDetector = ({ children }) => {
  const [isTelegramBrowser, setIsTelegramBrowser] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect if user is using Telegram's in-app browser
    const detectTelegramBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isTelegram = userAgent.includes('telegram') || 
                        userAgent.includes('tdesktop') ||
                        window.TelegramWebviewProxy !== undefined ||
                        window.Telegram !== undefined;
      
      setIsTelegramBrowser(isTelegram);
      
      // Show instructions if it's Telegram browser and user hasn't dismissed
      if (isTelegram && !localStorage.getItem('telegram-browser-dismissed')) {
        setShowInstructions(true);
      }
    };

    detectTelegramBrowser();
  }, []);

  const handleDismiss = () => {
    setShowInstructions(false);
    localStorage.setItem('telegram-browser-dismissed', 'true');
  };

  const openInExternalBrowser = () => {
    const currentUrl = window.location.href;
    
    // Try different methods to open in external browser
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openLink(currentUrl);
    } else {
      // Fallback: Create a special link that forces external browser
      const link = document.createElement('a');
      link.href = currentUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isTelegramBrowser && showInstructions) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Better Gaming Experience
            </h3>
            <p className="text-gray-600 mb-4">
              For the best gaming experience, please open this link in your default browser instead of Telegram's built-in browser.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={openInExternalBrowser}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Open in External Browser
            </button>
            
            <div className="text-sm text-gray-500">
              <p className="mb-2">Or manually:</p>
              <div className="bg-gray-100 rounded-lg p-3 text-left">
                <p className="font-medium mb-1">📱 On Mobile:</p>
                <p className="text-xs mb-2">Tap the "⋯" menu → "Open in Browser"</p>
                <p className="font-medium mb-1">💻 On Desktop:</p>
                <p className="text-xs">Click "Open in external browser" button</p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default TelegramBrowserDetector;
