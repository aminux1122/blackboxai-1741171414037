import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { setCredentials } from '../../features/auth/authSlice';
import { EncryptionService } from '../../utils/encryption';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    masterPassword: '',
    confirmMasterPassword: '',
  });

  const [step, setStep] = useState(1); // 1: Account, 2: Master Password, 3: 2FA Setup
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength when password field changes
    if (name === 'password' || name === 'masterPassword') {
      // Basic password strength check
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isLongEnough = value.length >= 12;

      let score = 0;
      if (hasUpperCase) score++;
      if (hasLowerCase) score++;
      if (hasNumbers) score++;
      if (hasSymbols) score++;
      if (isLongEnough) score++;

      setPasswordStrength({
        score,
        strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
        checks: {
          uppercase: hasUpperCase,
          lowercase: hasLowerCase,
          numbers: hasNumbers,
          symbols: hasSymbols,
          length: isLongEnough
        }
      });
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('All fields are required');
      }
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Please enter a valid email address');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (!passwordStrength || passwordStrength.strength === 'weak') {
        throw new Error('Please choose a stronger password');
      }
      return true;
    }

    if (step === 2) {
      if (!formData.masterPassword || !formData.confirmMasterPassword) {
        throw new Error('Master password is required');
      }
      if (formData.masterPassword !== formData.confirmMasterPassword) {
        throw new Error('Master passwords do not match');
      }
      if (formData.masterPassword === formData.password) {
        throw new Error('Master password must be different from account password');
      }
      if (!passwordStrength || passwordStrength.strength === 'weak') {
        throw new Error('Please choose a stronger master password');
      }
      return true;
    }

    return true;
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (validateStep()) {
        setStep(prev => prev + 1);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful registration
      dispatch(setCredentials({
        user: { email: formData.email, id: 1 },
        token: 'dummy-token'
      }));
      
      navigate('/passwords');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordStrength = () => {
    if (!passwordStrength) return null;

    const colors = {
      weak: 'bg-red-500',
      medium: 'bg-yellow-500',
      strong: 'bg-green-500'
    };

    return (
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors[passwordStrength.strength]}`}
              style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
            />
          </div>
          <span className="text-sm capitalize text-gray-600">
            {passwordStrength.strength}
          </span>
        </div>
        {passwordStrength.strength === 'weak' && (
          <p className="mt-1 text-sm text-red-600">
            Password should include uppercase, lowercase, numbers, and symbols
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <ShieldCheckIcon className="h-16 w-16 text-primary-600" />
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="masterPassword" className="sr-only">Master password</label>
                <input
                  id="masterPassword"
                  name="masterPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Master password"
                  value={formData.masterPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="confirmMasterPassword" className="sr-only">Confirm master password</label>
                <input
                  id="confirmMasterPassword"
                  name="confirmMasterPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm master password"
                  value={formData.confirmMasterPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/VaultGuard:user@example.com?secret=DEMO12345&issuer=VaultGuard"
                alt="2FA QR Code"
                className="mx-auto mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app to enable two-factor authentication
              </p>
            </div>
          )}

          {renderPasswordStrength()}

          <div className="flex flex-col gap-4">
            {step < 3 && (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Continue to {step === 1 ? 'Master Password' : '2FA Setup'}
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating your account...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Back
              </button>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
