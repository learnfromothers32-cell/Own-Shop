import axios from 'axios';

// Brevo API configuration (more reliable on hosting platforms)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('📧 Attempting to send email via Brevo API:', { to, subject });
    
    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY is not set in environment variables');
      return { 
        success: false, 
        error: 'Brevo API key is missing' 
      };
    }

    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: 'Your Store',
          email: process.env.FROM_EMAIL || 'learnfromothers32@gmail.com'
        },
        to: [{ 
          email: to,
          name: to.split('@')[0] // Simple name from email
        }],
        subject: subject,
        htmlContent: html,
        tags: ['newsletter'] // Optional: for tracking in Brevo
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    console.log('✅ Email sent successfully via Brevo API:', response.data.messageId);
    return { 
      success: true, 
      messageId: response.data.messageId 
    };
  } catch (error) {
    console.error('❌ Brevo API error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // More detailed error message
    let errorMessage = 'Failed to send email';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Connection timeout';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details: error.response?.data || error.message
    };
  }
};

// Test function to verify Brevo API connection
export const testBrevoConnection = async () => {
  try {
    if (!BREVO_API_KEY) {
      return { success: false, error: 'BREVO_API_KEY not set' };
    }
    
    // Simple API call to get account info (just to test connection)
    const response = await axios.get('https://api.brevo.com/v3/account', {
      headers: {
        'api-key': BREVO_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    return { 
      success: true, 
      message: 'Brevo API connected successfully',
      account: response.data
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            background: linear-gradient(135deg, #8b5cf6, #6366f1); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            border-radius: 12px 12px 0 0; 
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content { 
            background: #f9fafb; 
            padding: 40px 30px; 
            border-radius: 0 0 12px 12px; 
          }
          .code { 
            background: #e0e7ff; 
            color: #4f46e5; 
            padding: 20px; 
            font-size: 32px; 
            font-weight: bold; 
            text-align: center; 
            border-radius: 12px; 
            margin: 30px 0; 
            letter-spacing: 4px; 
            border: 2px dashed #4f46e5;
          }
          .feature-list {
            list-style: none;
            padding: 0;
            margin: 30px 0;
          }
          .feature-list li {
            margin: 15px 0;
            padding-left: 30px;
            position: relative;
          }
          .feature-list li:before {
            content: "✨";
            position: absolute;
            left: 0;
            color: #8b5cf6;
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280; 
            font-size: 12px; 
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
            text-decoration: none;
            border-radius: 9999px;
            font-weight: 600;
            margin: 20px 0;
          }
          @media only screen and (max-width: 480px) {
            .container { padding: 10px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .code { font-size: 24px; padding: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Store! 🎉</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; margin-bottom: 25px;">Hi there,</p>
            
            <p style="font-size: 16px;">Thanks for subscribing to our newsletter! We're excited to have you as part of our community.</p>
            
            <div style="text-align: center;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Your exclusive discount code:</p>
              <div class="code">WELCOME20</div>
              <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">Valid for 30 days on your first order</p>
            </div>
            
            <p style="font-size: 16px; font-weight: 600; margin-top: 30px;">As a subscriber, you'll get:</p>
            
            <ul class="feature-list">
              <li>✨ Early access to new drops</li>
              <li>🔥 Members-only deals</li>
              <li>🎁 Exclusive offers</li>
              <li>📦 Free shipping updates</li>
            </ul>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="#" class="button">Shop Now</a>
            </div>
            
            <p style="font-size: 16px;">Happy shopping!</p>
            <p style="font-size: 16px; font-weight: 600;">The Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Your Store. All rights reserved.</p>
            <p style="margin-top: 15px;">
              <small>
                You're receiving this because you subscribed to our newsletter.<br>
                <a href="#" style="color: #6366f1; text-decoration: underline;">Unsubscribe</a> • 
                <a href="#" style="color: #6366f1; text-decoration: underline;">Privacy Policy</a>
              </small>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  adminContactNotification: (name, email, message) => ({
    subject: `📧 New Contact Form Message from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .field { margin: 20px 0; }
          .label { font-weight: bold; color: #4b5563; }
          .value { margin-top: 5px; padding: 10px; background: #f3f4f6; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📬 New Contact Form Submission</h2>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${message}</div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  contactAutoReply: (name, message) => ({
    subject: '🙏 Thank You for Contacting Us',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .message-box { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${name},</h2>
          <p>Thank you for reaching out to us! We've received your message and will get back to you within 24 hours.</p>
          
          <p><strong>Your message:</strong></p>
          <div class="message-box">
            "${message}"
          </div>
          
          <p>In the meantime, feel free to browse our store!</p>
          <p>Best regards,<br>The Team</p>
        </div>
      </body>
      </html>
    `,
  }),
};