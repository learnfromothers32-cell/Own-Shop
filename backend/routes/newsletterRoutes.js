import express from "express";
import { body, validationResult } from "express-validator";
import { sendEmail, emailTemplates } from "../utils/emailService.js";

const newsletterRouter = express.Router();

// In-memory store
const subscribers = new Set();

// Test endpoint to check email configuration
newsletterRouter.get("/test-email", async (req, res) => {
  try {
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || "test@example.com",
      subject: "Test Email from Newsletter System",
      html: "<h1>Test</h1><p>If you receive this, email is working!</p>",
    });
    
    res.json({ 
      success: result.success, 
      message: result.success ? "✅ Email sent successfully!" : "❌ Email failed",
      details: result 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

newsletterRouter.post(
  "/subscribe",
  body("email").isEmail().normalizeEmail(),
  async (req, res) => {
    try {
      console.log("📨 Subscription request received:", req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      const { email } = req.body;

      // Check if already subscribed
      if (subscribers.has(email)) {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed!",
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

      console.log("📧 Email result:", emailResult);

      if (!emailResult.success) {
        console.error("❌ Email sending failed:", emailResult.error);
        return res.status(500).json({
          success: false,
          message: "Failed to send welcome email. Please try again.",
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
      console.error("🔥 Subscription error:", error);
      res.status(500).json({
        success: false,
        message: "Subscription failed. Please try again.",
      });
    }
  }
);

newsletterRouter.get("/stats", (req, res) => {
  res.json({
    success: true,
    count: subscribers.size,
  });
});

export default newsletterRouter;