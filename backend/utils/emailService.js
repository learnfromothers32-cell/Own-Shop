import nodemailer from "nodemailer";

// Check if email credentials exist
if (
  !process.env.SMTP_HOST ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASS
) {
  console.warn("⚠️ Email credentials not found in .env file");
}

// Create transporter with comprehensive timeout and retry options
const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === "465", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Critical timeout settings [citation:5][citation:10]
      connectionTimeout: 30000,
      greetingTimeout: 30000, 
      socketTimeout: 60000, 
      
      tls: {
        rejectUnauthorized: false, 
        ciphers: "SSLv3",
      },
      // Enable debugging to see detailed logs
      debug: true,
      logger: true,
    });

    return transporter;
  } catch (error) {
    console.error("Failed to create email transporter:", error);
    return null;
  }
};

const transporter = createTransporter();

// Verify connection on startup with retry logic
export const verifyEmailConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!transporter) {
        throw new Error("Transporter not initialized");
      }

      await transporter.verify();
      console.log("✅ Email service ready to send messages");
      return true;
    } catch (error) {
      console.log(
        `⚠️ Connection attempt ${i + 1}/${retries} failed:`,
        error.message,
      );

      if (i === retries - 1) {
        console.error("❌ Email service failed after", retries, "attempts");
        return false;
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * Math.pow(2, i)),
      );
    }
  }
  return false;
};

// Email templates
export const emailTemplates = {
  welcome: (email) => ({
    subject: "🎉 Welcome! Here's Your 20% Off",
    html: `
            <div style="background: #0f0f0f; padding: 40px; font-family: Arial, sans-serif;">
                <h1 style="color: white; text-align: center;">Welcome to the Family! 🎉</h1>
                <div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0;">
                    <h2 style="color: white; margin: 0;">Your 20% Off Code:</h2>
                    <h1 style="color: white; font-size: 48px; letter-spacing: 4px; margin: 10px 0;">WELCOME20</h1>
                </div>
                <p style="color: #9ca3af; text-align: center;">Use this code on your first order!</p>
            </div>
        `,
  }),

  adminContactNotification: (name, email, message) => ({
    subject: `📬 New Contact Message from ${name}`,
    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f0f0f;">
                <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
        `,
  }),

  contactAutoReply: (name, message) => ({
    subject: "We received your message!",
    html: `
            <div style="background: #0f0f0f; padding: 20px;">
                <h1 style="color: white;">Hi ${name}! 👋</h1>
                <p style="color: #9ca3af;">Thanks for contacting us! We'll reply within 24 hours.</p>
            </div>
        `,
  }),
};

// Main email sending function with timeout handling
export const sendEmail = async ({
  to,
  subject,
  html,
  from = process.env.FROM_EMAIL,
}) => {
  try {
    // Check if transporter exists
    if (!transporter) {
      throw new Error("Email transporter not initialized");
    }

    // Check required fields
    if (!to || !subject || !html) {
      throw new Error("Missing required email fields");
    }

    const mailOptions = {
      from: from
        ? `"YourBrand" <${from}>`
        : '"YourBrand" <noreply@yourbrand.com>',
      to,
      subject,
      html,
    };

    console.log(`📧 Attempting to send email to: ${to}`);

    // Use Promise.race to implement our own timeout as fallback
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Send operation timed out")), 45000),
    );

    const info = await Promise.race([sendPromise, timeoutPromise]);

    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return {
      success: false,
      error: error.message,
      details: error,
    };
  }
};


verifyEmailConnection();
