import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  BellIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

export default function SettingsPage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [settings, setSettings] = useState({
    notifications: {
      passwordBreaches: true,
      loginAttempts: true,
      passwordExpiry: true,
      updates: false,
    },
    sync: {
      enabled: true,
      frequency: 'realtime',
      lastSync: new Date().toISOString(),
    },
    appearance: {
      theme: 'system',
      language: 'en',
    },
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleNotificationToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting],
      },
    }));
    // TODO: Sync with backend
  };

  const handleSyncSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      sync: {
        ...prev.sync,
        [setting]: value,
      },
    }));
    // TODO: Sync with backend
  };

  const handleAppearanceChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [setting]: value,
      },
    }));
    // TODO: Sync with backend
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // TODO: Implement password change logic
    setIsChangingPassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <UserCircleIcon className="h-8 w-8 text-primary-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Profile</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="mt-1 input bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <input
                type="text"
                value="Premium"
                readOnly
                className="mt-1 input bg-gray-50"
              />
            </div>
          </div>

          <button
            onClick={() => setIsChangingPassword(true)}
            className="mt-4 btn btn-secondary"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <BellIcon className="h-8 w-8 text-primary-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  className={`
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                    transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                    ${enabled ? 'bg-primary-600' : 'bg-gray-200'}
                  `}
                >
                  <span className="sr-only">Toggle {key}</span>
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                      transition ease-in-out duration-200
                      ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sync Settings */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <CloudArrowUpIcon className="h-8 w-8 text-primary-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Sync Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Enable Sync</label>
                <p className="text-sm text-gray-500">Keep your passwords in sync across devices</p>
              </div>
              <button
                onClick={() => handleSyncSettingChange('enabled', !settings.sync.enabled)}
                className={`
                  relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                  transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  ${settings.sync.enabled ? 'bg-primary-600' : 'bg-gray-200'}
                `}
              >
                <span className="sr-only">Enable sync</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                    transition ease-in-out duration-200
                    ${settings.sync.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sync Frequency</label>
              <select
                value={settings.sync.frequency}
                onChange={(e) => handleSyncSettingChange('frequency', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Last synced: {new Date(settings.sync.lastSync).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center mb-4">
              <LockClosedIcon className="h-6 w-6 text-primary-600" />
              <h2 className="ml-2 text-xl font-bold">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  className="mt-1 input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  className="mt-1 input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="mt-1 input"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Change Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
