const nodemailer = require('nodemailer');

/**
 * Email Service using Nodemailer
 * 
 * Configure your SMTP settings in .env file:
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASS=your-app-password
 * FROM_EMAIL=your-email@gmail.com
 * FROM_NAME=Your App Name
 */
class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  /**
   * Create nodemailer transporter with SMTP configuration
   */
  createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send email
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} text - Plain text content
   * @param {string} html - HTML content (optional)
   */
  async sendEmail(to, subject, text, html = null) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        text,
        ...(html && { html })
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send a test email to verify configuration
   * @param {string} testEmail - Email address to send test email to
   */
  async sendTestEmail(testEmail = process.env.FROM_EMAIL) {
    const subject = 'Test Email - Email Service Working!';
    const text = `
Hello!

This is a test email to verify that your email service is working correctly.

If you received this email, your email configuration is set up properly.

Best regards,
Your App
    `;
    
    const html = `
<html>
<body>
  <h2>✅ Email Service Test</h2>
  <p>Hello!</p>
  <p>This is a test email to verify that your email service is working correctly.</p>
  <p><strong>If you received this email, your email configuration is set up properly.</strong></p>
  <br>
  <p>Best regards,<br>Your App</p>
</body>
</html>
    `;

    return this.sendEmail(testEmail, subject, text, html);
  }

  /**
   * Verify email configuration
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

module.exports = EmailService;
