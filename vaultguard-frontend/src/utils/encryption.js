import CryptoJS from 'crypto-js';

export class EncryptionService {
  constructor(masterKey) {
    // Use PBKDF2 to derive a key from the master password
    this.key = CryptoJS.PBKDF2(masterKey, 'vaultguard-salt', {
      keySize: 256 / 32,
      iterations: 10000
    }).toString();
  }

  // Encrypt data using AES-256
  encrypt(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.key);
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt data using AES-256
  decrypt(encryptedData) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key);
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Generate a secure random password
  static generatePassword(length = 16, options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  }) {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let chars = '';
    let password = '';

    // Add character sets based on options
    Object.keys(options).forEach(option => {
      if (options[option]) {
        chars += charset[option];
      }
    });

    // Ensure at least one character from each selected set
    Object.keys(options).forEach(option => {
      if (options[option]) {
        password += charset[option].charAt(Math.floor(Math.random() * charset[option].length));
      }
    });

    // Fill the rest of the password
    while (password.length < length) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Check password strength
  static checkPasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      noRepeating: !/(.)\1{2,}/.test(password),
    };

    // Calculate score based on checks
    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    return {
      score,
      strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
      checks
    };
  }
}
