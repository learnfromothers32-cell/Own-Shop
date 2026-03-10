import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("✅ Email service ready to send messages");
  }
});

// Email templates
export const emailTemplates = {
  // Welcome email for newsletter subscribers
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

  // Contact form auto-reply
  contactAutoReply: (name, message) => ({
    subject: "We received your message!",
    html: `
            <div style="background: #0f0f0f; padding: 40px; font-family: Arial, sans-serif;">
                <h1 style="color: white;">Hi ${name}! 👋</h1>
                <p style="color: #9ca3af; line-height: 1.6;">Thanks for reaching out to us! We've received your message and will get back to you within 24 hours.</p>
                <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="color: white; margin: 0;"><strong>Your message:</strong></p>
                    <p style="color: #9ca3af;">"${message}"</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">In the meantime, check out our latest collection!</p>
            </div>
        `,
  }),

  // Order confirmation
  orderConfirmation: (orderDetails, total) => ({
    subject: `✅ Order Confirmation #${orderDetails.orderId}`,
    html: `
            <div style="background: #0f0f0f; padding: 40px; font-family: Arial, sans-serif;">
                <h1 style="color: white;">Thank You for Your Order! 🎉</h1>
                <p style="color: #9ca3af;">Order #${orderDetails.orderId}</p>
                
                <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: white;">Order Summary</h3>
                    ${
                      orderDetails.items
                        ?.map(
                          (item) => `
                        <div style="display: flex; justify-content: space-between; color: #9ca3af; padding: 10px 0; border-bottom: 1px solid #333;">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${item.price * item.quantity}</span>
                        </div>
                    `,
                        )
                        .join("") || ""
                    }
                    <div style="display: flex; justify-content: space-between; color: white; font-weight: bold; padding-top: 10px;">
                        <span>Total</span>
                        <span>$${total}</span>
                    </div>
                </div>
                
                <p style="color: #6b7280;">We'll notify you when your order ships!</p>
            </div>
        `,
  }),

  // Admin notification for new contact
  adminContactNotification: (name, email, message) => ({
    subject: `📬 New Contact Message from ${name}`,
    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${name}</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${email}</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${message}</td></tr>
                </table>
            </div>
        `,
  }),
};

// Main email sending function
export const sendEmail = async ({
  to,
  subject,
  html,
  from = process.env.FROM_EMAIL,
}) => {
  try {
    const mailOptions = {
      from: `"YourBrand" <${from}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, error: error.message };
  }
};
