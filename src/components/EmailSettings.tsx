import React, { useState } from 'react';
import { Mail, Settings, Eye, EyeOff, User, MessageSquare } from 'lucide-react';

interface EmailSettingsProps {
  onSettingsChange: (settings: EmailSettings) => void;
}

export interface EmailSettings {
  senderEmail: string;
  senderPassword: string;
  senderName: string;
  subject: string;
  message: string;
}

export const EmailSettings: React.FC<EmailSettingsProps> = ({ onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState<EmailSettings>({
    senderEmail: '',
    senderPassword: '',
    senderName: 'Certificate Generator',
    subject: 'Your Certificate is Ready! 🎉',
    message: 'Dear {name},\n\nCongratulations! 🎊 We are pleased to present you with your certificate.\n\nPlease find your certificate attached to this email.\n\nBest regards,\n{senderName}'
  });

  const handleChange = (field: keyof EmailSettings, value: string) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors rounded-xl"
      >
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Email Configuration
          </h3>
        </div>
        <Settings className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📧 Simple Email Setup</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Enter your Gmail credentials to send certificates directly to participants. 
              We'll handle the rest automatically!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Your Gmail Address</span>
              </label>
              <input
                type="email"
                value={settings.senderEmail}
                onChange={(e) => handleChange('senderEmail', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                placeholder="your-email@gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gmail App Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.senderPassword}
                  onChange={(e) => handleChange('senderPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                  placeholder="Your app password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name (Sender Name)
            </label>
            <input
              type="text"
              value={settings.senderName}
              onChange={(e) => handleChange('senderName', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              placeholder="Certificate Generator"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={settings.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              placeholder="Your Certificate is Ready! 🎉"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>Email Message</span>
            </label>
            <textarea
              value={settings.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              placeholder="Dear {name}, Congratulations! Please find your certificate attached."
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>• Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{name}'}</code> to insert the participant's name</p>
              <p>• Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{senderName}'}</code> to insert your name</p>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">🔐 Gmail Setup Instructions:</h4>
            <ol className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-decimal list-inside">
              <li>Enable 2-Factor Authentication on your Gmail account</li>
              <li>Go to Google Account Settings → Security → App Passwords</li>
              <li>Generate a new App Password for "Mail"</li>
              <li>Use that 16-character password above (not your regular Gmail password)</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};