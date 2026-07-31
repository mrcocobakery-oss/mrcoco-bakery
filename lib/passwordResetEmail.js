// Add password reset email function to emailService.js

export async function sendPasswordResetEmail(user, resetUrl) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Mr. COCO Bakery" <${EMAIL_CONFIG.auth.user}>`,
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
