import nodemailer from 'nodemailer';

// Create transporter with Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Only for development
  },
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('📧 Attempting to send email:', { to, subject });
    
    const mailOptions = {
      from: `"Your Store" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: error 
    };
  }
};

export const emailTemplates = {
  welcome: (email) => ({
    subject: '🎉 Welcome! Here\'s Your 20% Off Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .code { background: #e0e7ff; color: #4f46e5; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 2px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Store! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>Thanks for subscribing to our newsletter! We're excited to have you on board.</p>
            <p>Here's your exclusive 20% off code for your first order:</p>
            <div class="code">WELCOME20</div>
            <p>This code is valid for 30 days and can be applied at checkout.</p>
            <p>Stay tuned for:</p>
            <ul>
              <li>✨ Early access to new drops</li>
              <li>🔥 Members-only deals</li>
              <li>🎁 Exclusive offers</li>
            </ul>
            <p>Happy shopping!</p>
          </div>
          <div class="footer">
            <p>© 2024 Your Store. All rights reserved.</p>
            <p>If you didn't subscribe to our newsletter, you can ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  adminContactNotification: (name, email, message) => ({
    subject: `📧 New Contact Form Message from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  }),

  contactAutoReply: (name, message) => ({
    subject: '🙏 Thank You for Contacting Us',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to us. We have received your message:</p>
      <p><em>"${message}"</em></p>
      <p>We'll get back to you within 24 hours.</p>
      <p>Best regards,<br>The Team</p>
    `,
  }),
};