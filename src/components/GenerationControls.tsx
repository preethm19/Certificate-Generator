import React, { useState } from 'react';
import { Download, Mail, Settings, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { EmailSettings } from './EmailSettings';

interface GenerationControlsProps {
  onGenerateAll: () => Promise<void>;
  onSendEmails: (settings: EmailSettings) => Promise<{ success: number; failed: number; errors: string[] }>;
  studentsCount: number;
  canGenerate: boolean;
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  onGenerateAll,
  onSendEmails,
  studentsCount,
  canGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [emailResults, setEmailResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateAll();
      setGenerated(true);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmails = async () => {
    if (!emailSettings) {
      alert('Please configure email settings first');
      return;
    }

    setIsSending(true);
    setEmailResults(null);
    
    try {
      const results = await onSendEmails(emailSettings);
      setEmailResults(results);
    } catch (error) {
      console.error('Email sending failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to send emails');
    } finally {
      setIsSending(false);
    }
  };

  const canSendEmails = generated && emailSettings && emailSettings.smtpUser && emailSettings.smtpPassword;

  return (
    <div className="space-y-6">
      {/* Email Configuration */}
      <EmailSettings onSettingsChange={setEmailSettings} />
      
      {/* Generation Controls */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Generation & Distribution
          </h3>
        </div>

        <div className="space-y-4">
          {/* Status Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Ready to generate <span className="font-semibold">{studentsCount}</span> certificates
            </p>
          </div>

          {/* Generate Certificates */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={`
              w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${canGenerate && !isGenerating
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : generated ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>
              {isGenerating 
                ? 'Generating Certificates...' 
                : generated 
                  ? 'Certificates Generated!'
                  : 'Generate All Certificates'
              }
            </span>
          </button>

          {/* Send Emails */}
          <button
            onClick={handleSendEmails}
            disabled={!canSendEmails || isSending}
            className={`
              w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${canSendEmails && !isSending
                ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSending ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : emailResults ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            <span>
              {isSending 
                ? 'Sending Emails...' 
                : emailResults 
                  ? `Emails Sent! (${emailResults.success} success, ${emailResults.failed} failed)`
                  : 'Send Certificates via Email'
              }
            </span>
          </button>

          {/* Email Results */}
          {emailResults && (
            <div className="space-y-2">
              {emailResults.success > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-sm text-green-800 dark:text-green-200 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Successfully sent {emailResults.success} certificates</span>
                  </p>
                </div>
              )}
              
              {emailResults.failed > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-200 flex items-center space-x-1 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Failed to send {emailResults.failed} certificates</span>
                  </p>
                  {emailResults.errors.length > 0 && (
                    <div className="text-xs text-red-700 dark:text-red-300 space-y-1">
                      {emailResults.errors.slice(0, 3).map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                      {emailResults.errors.length > 3 && (
                        <div>• ... and {emailResults.errors.length - 3} more errors</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Certificates will be generated as ZIP file for download and individual emails will be sent to each student.
          </p>
        </div>
      </div>
    </div>
  );
};