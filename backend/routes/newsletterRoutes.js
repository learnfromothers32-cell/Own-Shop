import express from "express";
import { body, validationResult } from "express-validator";
import { sendEmail, emailTemplates, testBrevoConnection } from "../utils/emailService.js";

const newsletterRouter = express.Router();

// In-memory store
const subscribers = new Set();

// Test endpoint to check email configuration
newsletterRouter.get("/test-email", async (req, res) => {
  try {
    console.log("🧪 Testing email configuration...");
    
    // First test Brevo connection
    const connectionTest = await testBrevoConnection();
    
    if (!connectionTest.success) {
      return res.status(500).json({
        success: false,
        message: "Brevo connection failed",
        error: connectionTest.error,
        suggestion: "Check your BREVO_API_KEY in Render environment variables"
      });
    }

    // Try sending a test email
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.FROM_EMAIL || "test@example.com",
      subject: "🔧 Test Email from Newsletter System",
      html: `
        <h1>Test Email</h1>
        <p>If you receive this, your email system is working perfectly!</p>
        <p>Time: ${new Date().toISOString()}</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
      `,
    });
    
    res.json({ 
      success: result.success, 
      message: result.success ? "✅ Email sent successfully! Check your inbox." : "❌ Email failed to send",
      connectionTest,
      emailResult: result,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasBrevoKey: process.env.BREVO_API_KEY ? "✅ Present" : "❌ Missing",
        hasFromEmail: process.env.FROM_EMAIL ? "✅ Present" : "❌ Missing",
        hasAdminEmail: process.env.ADMIN_EMAIL ? "✅ Present" : "❌ Missing"
      }
    });
  } catch (error) {
    console.error("🔥 Test endpoint error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Debug endpoint to check environment
newsletterRouter.get("/debug", (req, res) => {
  res.json({
    success: true,
    message: "Newsletter route is working",
    environment: process.env.NODE_ENV,
    envVars: {
      brevoApiKey: process.env.BREVO_API_KEY ? "✅ Set (hidden)" : "❌ Missing",
      fromEmail: process.env.FROM_EMAIL ? "✅ Set" : "❌ Missing",
      adminEmail: process.env.ADMIN_EMAIL ? "✅ Set" : "❌ Missing",
      smtpHost: process.env.SMTP_HOST ? "⚠️ Still present (not used)" : "✅ Not needed",
    },
    subscribers: subscribers.size,
    timestamp: new Date().toISOString()
  });
});

// Ping endpoint for quick health check
newsletterRouter.get("/ping", (req, res) => {
  res.json({ 
    success: true, 
    message: "pong", 
    time: Date.now(),
    environment: process.env.NODE_ENV 
  });
});

newsletterRouter.post(
  "/subscribe",
  [
    body("email").isEmail().normalizeEmail(),
    body("email").notEmpty().withMessage("Email is required")
  ],
  async (req, res) => {
    try {
      console.log("📨 Subscription request received:", { 
        body: req.body,
        timestamp: new Date().toISOString()
      });
      
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation failed:", errors.array());
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
          errors: errors.array()
        });
      }

      const { email } = req.body;
      console.log("✅ Valid email received:", email);

      // Check if already subscribed
      if (subscribers.has(email)) {
        console.log("⚠️ Email already subscribed:", email);
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed!",
        });
      }

      // Verify Brevo API key is present
      if (!process.env.BREVO_API_KEY) {
        console.error("❌ BREVO_API_KEY is missing in environment");
        return res.status(500).json({
          success: false,
          message: "Email service configuration error. Please try again later.",
        });
      }

      console.log("📧 Attempting to send welcome email to:", email);
      
      // Send welcome email
      const template = emailTemplates.welcome(email);
      const emailResult = await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
      });

      console.log("📧 Email result:", JSON.stringify(emailResult, null, 2));

      if (!emailResult.success) {
        console.error("❌ Email sending failed:", emailResult.error);
        
        // Check for specific Brevo API errors
        if (emailResult.error?.includes('unauthorized') || emailResult.error?.includes('Key not found')) {
          return res.status(500).json({
            success: false,
            message: "Email service authentication failed. Please contact support.",
            error: "Invalid Brevo API key"
          });
        }
        
        return res.status(500).json({
          success: false,
          message: "Failed to send welcome email. Please try again.",
          error: emailResult.error
        });
      }

      // Store subscriber
      subscribers.add(email);
      console.log("✅ Subscriber added. Total subscribers:", subscribers.size);

      res.status(200).json({
        success: true,
        message: "🎉 Success! Check your inbox for your 20% off code!",
      });

    } catch (error) {
      console.error("🔥 Subscription error:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      res.status(500).json({
        success: false,
        message: "Subscription failed. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

newsletterRouter.get("/stats", (req, res) => {
  res.json({
    success: true,
    count: subscribers.size,
    subscribers: Array.from(subscribers) // Only for debugging, remove in production
  });
});

export default newsletterRouter;