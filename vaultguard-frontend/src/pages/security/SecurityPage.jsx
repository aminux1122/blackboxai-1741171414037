import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  KeyIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import { EncryptionService } from '../../utils/encryption';

export default function SecurityPage() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    autoLockTimeout: 5, // minutes
    requireMasterPassword: true,
    notifyUnauthorizedAccess: true,
  });

  const [passwordAudit, setPasswordAudit] = useState({
    weak: 2,
    reused: 1,
    old: 3,
    compromised: 0,
  });

  const handleToggleSetting = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    // TODO: Sync with backend
  };

  const handleTimeoutChange = (minutes) => {
    setSecuritySettings(prev => ({
      ...prev,
      autoLockTimeout: minutes
    }));
    // TODO: Sync with backend
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Security Settings</h1>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(passwordAudit).map(([type, count]) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              {count > 0 ? (
                <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
              ) : (
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
              )}
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {type} Passwords
                </h3>
                <p className="text-3xl font-bold text-gray-700">{count}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <QrCodeIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleToggleSetting('twoFactorEnabled')}
                className={`
                  relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                  transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  ${securitySettings.twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-200'}
                `}
              >
                <span className="sr-only">Enable 2FA</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                    transition ease-in-out duration-200
                    ${securitySettings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Lock Settings */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <KeyIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Auto-Lock Settings
              </h3>
              <p className="text-sm text-gray-500">
                Configure when your vault should automatically lock
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-lock after inactivity (minutes)
              </label>
              <select
                value={securitySettings.autoLockTimeout}
                onChange={(e) => handleTimeoutChange(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Require master password on browser restart
                </label>
                <p className="text-sm text-gray-500">
                  Always require master password when reopening the browser
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting('requireMasterPassword')}
                className={`
                  relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                  transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  ${securitySettings.requireMasterPassword ? 'bg-primary-600' : 'bg-gray-200'}
                `}
              >
                <span className="sr-only">Require master password</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                    transition ease-in-out duration-200
                    ${securitySettings.requireMasterPassword ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notify on unauthorized access attempts
                </label>
                <p className="text-sm text-gray-500">
                  Receive notifications when someone tries to access your account
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting('notifyUnauthorizedAccess')}
                className={`
                  relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                  transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  ${securitySettings.notifyUnauthorizedAccess ? 'bg-primary-600' : 'bg-gray-200'}
                `}
              >
                <span className="sr-only">Enable notifications</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                    transition ease-in-out duration-200
                    ${securitySettings.notifyUnauthorizedAccess ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
