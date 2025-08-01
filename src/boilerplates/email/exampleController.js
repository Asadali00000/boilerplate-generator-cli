const EmailService = require('./email');

/**
 * Example Email Controller
 * 
 * This controller demonstrates how to use the EmailService
 * in your Express.js routes.
 * 
 * Usage in your routes file:
 * const { sendTestEmail, sendWelcomeEmail } = require('./email/exampleController');
 * 
 * app.get('/test-email', sendTestEmail);
 * app.post('/send-welcome', sendWelcomeEmail);
 */

/**
 * Send a test email to verify email service is working
 * GET /test-email?email=recipient@example.com
 */
const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const testEmail = email || process.env.FROM_EMAIL;
    
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address in query parameter or set FROM_EMAIL in .env'
      });
    }

    const emailService = new EmailService();
    
    // Verify email service configuration first
    const isConnected = await emailService.verifyConnection();
    if (!isConnected) {
      return res.status(500).json({
        success: false,
        error: 'Email service configuration error. Please check your .env settings.'
      });
    }

    const result = await emailService.sendTestEmail(testEmail);
    
    res.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Send a welcome email to a new user
 * POST /send-welcome
 * Body: { email: "user@example.com", name: "User Name" }
 */
const sendWelcomeEmail = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    const emailService = new EmailService();
    
    const subject = 'Welcome to Our App!';
    const text = `
Hello ${name || 'there'}!

Welcome to our application! We're excited to have you on board.

If you have any questions, feel free to reach out to our support team.

Best regards,
The Team
    `;
    
    const html = `
<html>
<body>
  <h2>🎉 Welcome to Our App!</h2>
  <p>Hello ${name || 'there'}!</p>
  <p>Welcome to our application! We're excited to have you on board.</p>
  <p>If you have any questions, feel free to reach out to our support team.</p>
  <br>
  <p>Best regards,<br><strong>The Team</strong></p>
</body>
</html>
    `;

    const result = await emailService.sendEmail(email, subject, text, html);
    
    res.json({
      success: true,
      message: `Welcome email sent successfully to ${email}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Send a custom email
 * POST /send-email
 * Body: { 
 *   to: "recipient@example.com", 
 *   subject: "Email Subject", 
 *   text: "Plain text content",
 *   html: "<h1>HTML content</h1>" (optional)
 * }
 */
const sendCustomEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, text'
      });
    }

    const emailService = new EmailService();
    const result = await emailService.sendEmail(to, subject, text, html);
    
    res.json({
      success: true,
      message: `Email sent successfully to ${to}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Custom email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  sendTestEmail,
  sendWelcomeEmail,
  sendCustomEmail
};
