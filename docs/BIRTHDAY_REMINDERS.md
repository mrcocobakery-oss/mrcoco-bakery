# Automated Birthday Reminder System

## Overview
This system automatically tracks customer birthdays and enables automated WhatsApp reminders.

## Features
1. **Multiple Birthdays per Customer**: Store birthdays for family members/friends
2. **Daily Automated Check**: Script runs daily to find today's birthdays
3. **WhatsApp Integration**: Generates personalized WhatsApp messages
4. **Admin Management**: Full CRUD operations for customer data

## Setup Instructions

### 1. Manual Birthday Reminders (Current Implementation)
The system generates WhatsApp links that open in browser tabs:

```bash
# The bulk WhatsApp feature in admin panel will:
# - Generate personalized messages for each customer
# - Open WhatsApp web links in new tabs
# - Admin can send messages manually
```

### 2. Automated Daily Reminders (Production Setup)

#### Option A: Using Cron Job (Server-based)
```bash
# Make script executable
chmod +x /app/scripts/birthday-reminders.js

# Add to crontab (runs daily at 9 AM)
crontab -e

# Add this line:
0 9 * * * /usr/bin/node /app/scripts/birthday-reminders.js >> /var/log/birthday-reminders.log 2>&1
```

#### Option B: Using WhatsApp Business API
For fully automated messaging, integrate with WhatsApp Business API:

**Recommended Services:**
- Twilio WhatsApp Business API
- MessageBird
- Meta WhatsApp Business Platform

**Integration Steps:**
1. Sign up for WhatsApp Business API account
2. Get API credentials
3. Add to `.env`:
```env
WHATSAPP_API_KEY=your_api_key
WHATSAPP_API_URL=https://api.provider.com/messages
WHATSAPP_BUSINESS_NUMBER=your_business_number
```

4. Update `/app/scripts/birthday-reminders.js` with API integration:
```javascript
async function sendWhatsAppMessage(phone, message) {
  const response = await fetch(process.env.WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: `91${phone}`,
      body: message
    })
  })
  return response.json()
}
```

#### Option C: Using Cloud Functions (Serverless)
Deploy the birthday reminder as a serverless function:

**Vercel Cron Jobs:**
1. Create `/app/app/api/cron/birthday-reminders/route.js`
2. Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/birthday-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

## Customer Data Structure

```javascript
{
  name: "Raj Kumar",
  email: "raj@example.com",
  phone: "9876543210",
  address: "123, Street Name, City",
  birthdays: [
    { name: "Self", date: "1990-05-15" },
    { name: "Wife", date: "1992-08-20" },
    { name: "Son", date: "2015-12-10" }
  ],
  walletBalance: 500,
  loyaltyPoints: 150,
  status: "active"
}
```

## Usage

### Adding Customers via Admin Panel
1. Go to Admin → Customers
2. Click "Add Customer"
3. Fill in customer details
4. Add multiple birthdays with person names
5. Click "Add Customer"

### Sending Bulk WhatsApp Messages
1. Go to Admin → Customers
2. Click "Bulk WhatsApp"
3. Type your message
4. Click "Open WhatsApp Links"
5. Browser will open tabs for each customer
6. Send messages individually

### Birthday Reminders
The system automatically:
1. Checks database daily for matching birthdays (MM-DD)
2. Finds all customers with birthdays today
3. Generates personalized WhatsApp messages
4. Sends reminders (manual or automated based on setup)

## API Endpoints

- `GET /api/admin/customers` - Fetch all customers
- `POST /api/admin/customers` - Add new customer
- `PUT /api/admin/customers` - Update customer
- `GET /api/admin/customers/birthdays` - Get today's birthdays
- `POST /api/admin/whatsapp/bulk` - Generate bulk WhatsApp links

## Birthday Message Template

```
🎉 *Happy Birthday {Name}!* 🎂

Dear {CustomerName},

Wishing {BirthdayPerson} a very Happy Birthday! 🎊

Make this special day even sweeter with Mr. COCO Bakery's delicious cakes! 🍰

🎁 *Special Birthday Offer:*
- 15% OFF on all cake orders today
- Free personalized message card
- Same-day delivery available

Order now: https://your-website.com/products?category=cakes

Celebrate with sweetness! ❤️

- Mr. COCO Bakery Team
```

## Testing

### Test Today's Birthdays
```bash
# Run the script manually
node /app/scripts/birthday-reminders.js
```

### Test Customer Addition
```bash
curl -X POST http://localhost:3000/api/admin/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Customer",
    "phone": "9876543210",
    "birthdays": [
      {"name": "Self", "date": "2025-02-01"}
    ]
  }'
```

## Maintenance

### Check Birthday Log
```bash
tail -f /var/log/birthday-reminders.log
```

### Verify Cron Job
```bash
crontab -l
```

## Future Enhancements
1. SMS integration as backup
2. Email birthday wishes
3. Automatic discount code generation
4. Birthday analytics dashboard
5. Reminder 3 days before birthday
6. Anniversary tracking
