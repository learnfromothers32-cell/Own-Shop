import express from "express";
import { body, validationResult } from "express-validator";
import { sendEmail, emailTemplates } from "../utils/emailService.js";

const newsletterRouter = express.Router();

// In-memory store (replace with MongoDB model later)
const subscribers = new Set();

// Subscribe to newsletter
newsletterRouter.post(
  "/subscribe",
  body("email").isEmail().normalizeEmail(),
  async (req, res) => {
    try {
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

      // Send welcome email
      const template = emailTemplates.welcome(email);
      const emailResult = await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to send welcome email. Please try again.",
        });
      }

      // Store subscriber
      subscribers.add(email);

      // Optional: Save to database
      // await NewsletterSubscriber.create({ email });

      res.status(200).json({
        success: true,
        message: "🎉 Success! Check your inbox for your 20% off code!",
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({
        success: false,
        message: "Subscription failed. Please try again.",
      });
    }
  },
);

// Get subscriber count (optional)
newsletterRouter.get("/stats", (req, res) => {
  res.json({
    success: true,
    count: subscribers.size,
  });
});

export default newsletterRouter;
