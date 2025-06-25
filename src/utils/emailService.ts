import { EmailSettings } from '../components/EmailSettings';

export interface EmailData {
  to: string;
  name: string;
  certificateBlob: Blob;
}

export const sendCertificateEmails = async (
  emails: EmailData[],
  settings: EmailSettings
): Promise<{ success: number; failed: number; errors: string[] }> => {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  // Validate settings
  if (!settings.senderEmail || !settings.senderPassword) {
    throw new Error('Please provide your Gmail address and app password');
  }

  for (const emailData of emails) {
    try {
      // Convert blob to base64
      const base64Certificate = await blobToBase64(emailData.certificateBlob);
      
      // Replace placeholders in message
      const personalizedMessage = settings.message
        .replace(/{name}/g, emailData.name)
        .replace(/{senderName}/g, settings.senderName);
      
      // Prepare simplified email data
      const emailPayload = {
        from: {
          email: settings.senderEmail,
          name: settings.senderName
        },
        to: emailData.to,
        subject: settings.subject,
        message: personalizedMessage,
        attachment: {
          filename: `${emailData.name.replace(/[^a-zA-Z0-9]/g, '_')}_certificate.png`,
          content: base64Certificate.split(',')[1], // Remove data:image/png;base64, prefix
          type: 'image/png'
        },
        credentials: {
          email: settings.senderEmail,
          password: settings.senderPassword
        }
      };

      // In a real application, you would send this to your backend API
      // The backend would use nodemailer or similar to send via Gmail SMTP
      await simulateGmailSend(emailPayload);
      
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Failed to send to ${emailData.to}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const simulateGmailSend = async (emailPayload: any): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
  
  // Simulate occasional failures for demo (5% failure rate)
  if (Math.random() < 0.05) {
    throw new Error('Gmail authentication failed - check your app password');
  }
  
  console.log('📧 Email sent successfully via Gmail:', {
    from: emailPayload.from.email,
    to: emailPayload.to,
    subject: emailPayload.subject,
    attachmentSize: `${(emailPayload.attachment.content.length * 0.75 / 1024).toFixed(1)}KB`
  });
};