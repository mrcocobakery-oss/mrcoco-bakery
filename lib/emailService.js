import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
}

// Business email for notifications
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || process.env.SMTP_USER

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter(EMAIL_CONFIG)
}

// Send contact form notification to business
export async function sendContactNotification(inquiry) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Mr. COCO Bakery" <${EMAIL_CONFIG.auth.user}>`,
      to: BUSINESS_EMAIL,
      subject: `New Contact Inquiry: ${inquiry.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #be185d; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            .badge { display: inline-block; padding: 4px 12px; background: #10b981; color: white; border-radius: 12px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🍰 New Contact Inquiry</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">You have received a new contact form submission</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">📋 Inquiry ID:</div>
                <div class="value">${inquiry._id}</div>
              </div>
              
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${inquiry.name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📞 Phone:</div>
                <div class="value"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📝 Subject:</div>
                <div class="value"><strong>${inquiry.subject}</strong></div>
              </div>
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value" style="white-space: pre-wrap;">${inquiry.message}</div>
              </div>
              
              <div class="field">
                <div class="label">⏰ Received:</div>
                <div class="value">${new Date(inquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
              </div>
              
              <div class="field">
                <div class="label">Status:</div>
                <div class="value"><span class="badge">${inquiry.status.toUpperCase()}</span></div>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from your Mr. COCO Bakery website contact form.</p>
              <p>Please respond to the customer as soon as possible.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Contact notification email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending contact notification email:', error)
    // Don't throw error - we don't want email failure to break form submission
    return { success: false, error: error.message }
  }
}

// Send auto-reply to customer
export async function sendCustomerAutoReply(inquiry) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Mr. COCO Bakery" <${EMAIL_CONFIG.auth.user}>`,
      to: inquiry.email,
      subject: 'Thank you for contacting Mr. COCO Bakery',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #ec4899; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .contact-info { background: #fce7f3; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🍰 Mr. COCO Bakery</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for reaching out!</p>
            </div>
            <div class="content">
              <p>Dear <strong>${inquiry.name}</strong>,</p>
              
              <p>Thank you for contacting Mr. COCO Bakery! We have received your inquiry regarding:</p>
              <p style="background: #f9fafb; padding: 15px; border-left: 4px solid #ec4899; margin: 20px 0;">
                <strong>${inquiry.subject}</strong>
              </p>
              
              <p>Our team will review your message and get back to you as soon as possible, typically within 24 hours.</p>
              
              <div class="contact-info">
                <h3 style="margin-top: 0; color: #be185d;">Need Immediate Assistance?</h3>
                <p style="margin: 5px 0;">📞 <strong>Call us:</strong> +91 8447655399, +91 8979751914</p>
                <p style="margin: 5px 0;">📧 <strong>Email:</strong> mrcocobakery@gmail.com</p>
                <p style="margin: 5px 0;">💬 <strong>WhatsApp:</strong> +91 8447655399</p>
              </div>
              
              <p style="text-align: center;">
                <a href="https://wa.me/918447655399" class="button">Chat on WhatsApp</a>
              </p>
              
              <p><strong>Our Locations:</strong></p>
              <p style="margin: 5px 0;">🏭 <strong>Factory Outlet:</strong> Teenpani, Haldwani</p>
              <p style="margin: 5px 0;">🏪 <strong>Bakery & Restaurant:</strong> Rampur Road, Haldwani</p>
            </div>
            <div class="footer">
              <p style="margin: 0; color: #6b7280;">Keep It Simple, Keep It Tasty</p>
              <p style="margin: 5px 0; color: #9ca3af; font-size: 12px;">This is an automated confirmation email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Auto-reply email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending auto-reply email:', error)
    return { success: false, error: error.message }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(user, resetUrl) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `\"Mr. COCO Bakery\" <${EMAIL_CONFIG.auth.user}>`,
      to: user.email,
      subject: 'Reset Your Password - Mr. COCO Bakery',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; padding: 14px 30px; background: #ec4899; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${user.name || user.email}</strong>,</p>
              
              <p>We received a request to reset your password for your Mr. COCO Bakery account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <p style="margin: 0; color: #991b1b;"><strong>⚠️ Important:</strong></p>
                <ul style="margin: 10px 0 0 0; color: #991b1b;">
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password will remain unchanged</li>
                </ul>
              </div>
              
              <p>Need help? Contact us:</p>
              <p style="margin: 5px 0;">📞 <strong>Phone:</strong> +91 8447655399</p>
              <p style="margin: 5px 0;">📧 <strong>Email:</strong> mrcocobakery@gmail.com</p>
            </div>
            <div class="footer">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                This is an automated email from Mr. COCO Bakery.<br>
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error: error.message }
  }
}
