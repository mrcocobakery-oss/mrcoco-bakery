#!/usr/bin/env node

/**
 * Birthday Reminder Cron Job
 * 
 * This script should be run daily (preferably at 9 AM) to send
 * automated WhatsApp birthday reminders to customers.
 * 
 * Setup Instructions:
 * 1. Install dependencies: npm install node-fetch dotenv
 * 2. Add to crontab: 0 9 * * * /usr/bin/node /app/scripts/birthday-reminders.js
 * 3. Or use a task scheduler service
 */

const fetch = require('node-fetch')
require('dotenv').config({ path: '/app/.env' })

const MONGO_URL = process.env.MONGO_URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function sendBirthdayReminders() {
  console.log('🎂 Birthday Reminder Script Started:', new Date().toISOString())
  
  try {
    // Fetch today's birthdays from API
    const response = await fetch(`${BASE_URL}/api/admin/customers/birthdays`)
    const data = await response.json()
    
    if (!data.success) {
      console.error('❌ Failed to fetch birthdays:', data.error)
      return
    }
    
    console.log(`📋 Found ${data.count} birthdays today`)
    
    if (data.count === 0) {
      console.log('✅ No birthdays today')
      return
    }
    
    // Generate WhatsApp messages for each birthday
    for (const birthday of data.birthdays) {
      const message = `🎉 *Happy Birthday ${birthday.birthdayPerson}!* 🎂

Dear ${birthday.customerName},

Wishing ${birthday.birthdayPerson} a very Happy Birthday! 🎊

Make this special day even sweeter with Mr. COCO Bakery's delicious cakes! 🍰

🎁 *Special Birthday Offer:*
- 15% OFF on all cake orders today
- Free personalized message card
- Same-day delivery available

Order now: ${BASE_URL}/products?category=cakes

Celebrate with sweetness! ❤️

- Mr. COCO Bakery Team`
      
      const whatsappLink = `https://wa.me/91${birthday.customerPhone}?text=${encodeURIComponent(message)}`
      
      console.log(`📱 Birthday reminder for: ${birthday.customerName} (${birthday.birthdayPerson})`)
      console.log(`   WhatsApp Link: ${whatsappLink}`)
      
      // In a production setup with WhatsApp Business API:
      // await sendWhatsAppMessage(birthday.customerPhone, message)
      
      // For now, log the link (admin can manually send or use WhatsApp Business API)
      // You can integrate with services like Twilio, MessageBird, or WhatsApp Business API
    }
    
    console.log('✅ Birthday reminders processed successfully')
    
  } catch (error) {
    console.error('❌ Error sending birthday reminders:', error)
  }
}

// Run the script
sendBirthdayReminders()
