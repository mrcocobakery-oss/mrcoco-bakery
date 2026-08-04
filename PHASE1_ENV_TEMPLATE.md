# Phase 1 Implementation - Environment Variables

## Copy these to your .env file and fill in the actual values

# ===== GOOGLE OAUTH =====
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
# For production, add: https://www.mrcocobakery.in/api/auth/google/callback

# ===== EMAIL VERIFICATION =====
# Generate a secure random string (32+ characters)
# Command: openssl rand -base64 32
EMAIL_VERIFICATION_SECRET=your-email-verification-secret-change-this-to-random-string

# ===== TWILIO WHATSAPP =====
# Get from: https://console.twilio.com/
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
# ^ This is the Twilio Sandbox number - will be provided when you join sandbox

TWILIO_STATUS_CALLBACK_URL=https://www.mrcocobakery.in/api/webhooks/twilio/status
# ^ Change this to your actual domain

# For Production Templates (after approval):
# TWILIO_MESSAGING_SERVICE_SID=your-messaging-service-sid
# TWILIO_TEMPLATE_ORDER_CONFIRMED=HXxxxxx
# TWILIO_TEMPLATE_PAYMENT_CONFIRMED=HXxxxxx
# TWILIO_TEMPLATE_ORDER_STATUS=HXxxxxx
# TWILIO_TEMPLATE_ORDER_CANCELLED=HXxxxxx

# ===== EXISTING VARIABLES (Keep these) =====
MONGO_URL=mongodb+srv://mrcocobakery_db_user:Tf5HPl4ywORpOYBL@mrcocobakery.uoccuto.mongodb.net/mrcoco_bakery?retryWrites=true&w=majority
DB_NAME=mrcoco_bakery
NEXT_PUBLIC_BASE_URL=https://www.mrcocobakery.in
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ueofrveh
NEXT_PUBLIC_CLOUDINARY_API_KEY=234196141291697
CLOUDINARY_API_SECRET=F017vXpQY22MPvEcR1E5g6wW5nk
