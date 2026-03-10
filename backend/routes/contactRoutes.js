import express from "express";
import { body, validationResult } from "express-validator";
import { sendEmail, emailTemplates } from "../utils/emailService.js";

const contactRouter = express.Router();

contactRouter.post(
  "/send",
  [
    body("name").notEmpty().trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("message").notEmpty().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Please fill all fields correctly",
        });
      }

      const { name, email, message } = req.body;

      // Send notification to admin
      const adminTemplate = emailTemplates.adminContactNotification(
        name,
        email,
        message,
      );
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      });

      // Send auto-reply to customer
      const replyTemplate = emailTemplates.contactAutoReply(name, message);
      await sendEmail({
        to: email,
        subject: replyTemplate.subject,
        html: replyTemplate.html,
      });

      res.status(200).json({
        success: true,
        message: "Message sent successfully! We'll reply within 24 hours.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again.",
      });
    }
  },
);

export default contactRouter;
