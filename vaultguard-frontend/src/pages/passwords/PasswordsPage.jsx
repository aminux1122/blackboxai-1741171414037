import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ClipboardIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';
import { EncryptionService } from '../../utils/encryption';

export default function PasswordsPage() {
  const [passwords, setPasswords] = useState([
    // Demo data - in production, these would be encrypted and stored securely
    { id: 1, title: 'Gmail', username: 'user@gmail.com', password: 'encrypted_password', url: 'https://gmail.com' },
    { id: 2, title: 'GitHub', username: 'developer', password: 'encrypted_password', url: 'https://github.com' },
  ]);
  const [showPassword, setShowPassword] = useState({});
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [newPasswordOptions, setNewPasswordOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const handleCopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: Show success toast
    } catch (err) {
      // TODO: Show error toast
    }
  };

  const handleGeneratePassword = () => {
    return EncryptionService.generatePassword(
      newPasswordOptions.length,
      newPasswordOptions
    );
  };

  const handleDeletePassword = (id) => {
    setPasswords(passwords.filter(p => p.id !== id));
    // TODO: Sync with backend
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Password Vault</h1>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsGeneratingPassword(true)}
        >
          <PlusIcon className="h-5 w-5" />
          Add Password
        </button>
      </div>

      {/* Password List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {passwords.map((entry) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{entry.username}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center">
                    <input
                      type={showPassword[entry.id] ? 'text' : 'password'}
                      value={entry.password}
                      readOnly
                      className="pr-10 input"
                    />
                    <button
                      onClick={() => setShowPassword(prev => ({ ...prev, [entry.id]: !prev[entry.id] }))}
                      className="absolute right-10 p-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword[entry.id] ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyToClipboard(entry.password)}
                      className="absolute right-2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      <ClipboardIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeletePassword(entry.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Password Generator Modal */}
      {isGeneratingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Generate Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password Length: {newPasswordOptions.length}
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={newPasswordOptions.length}
                  onChange={(e) => setNewPasswordOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                {Object.entries(newPasswordOptions)
                  .filter(([key]) => key !== 'length')
                  .map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNewPasswordOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{key}</span>
                    </label>
                  ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsGeneratingPassword(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePassword}
                  className="btn btn-primary"
                >
                  Generate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
