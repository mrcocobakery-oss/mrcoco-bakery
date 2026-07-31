import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL

let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }
  const client = await MongoClient.connect(uri)
  cachedClient = client
  return client
}

// GET - Get today's birthdays
export async function GET(request) {
  try {
    const client = await connectToDatabase()
    const db = client.db('bakery')
    
    const today = new Date()
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0')
    const todayDay = String(today.getDate()).padStart(2, '0')
    const todayDateStr = `${todayMonth}-${todayDay}` // Format: MM-DD
    
    // Find all customers with birthdays today
    const customers = await db.collection('users')
      .find({
        birthdays: {
          $elemMatch: {
            date: { $regex: `-${todayDateStr}$` } // Matches any year with today's month-day
          }
        }
      })
      .toArray()
    
    const birthdaysToday = []
    
    customers.forEach(customer => {
      customer.birthdays.forEach(birthday => {
        const birthDate = birthday.date.split('-') // YYYY-MM-DD
        if (birthDate.length === 3) {
          const monthDay = `${birthDate[1]}-${birthDate[2]}`
          if (monthDay === todayDateStr) {
            birthdaysToday.push({
              customerId: customer._id,
              customerName: customer.name,
              customerPhone: customer.phone,
              birthdayPerson: birthday.name,
              birthdayDate: birthday.date
            })
          }
        }
      })
    })
    
    return Response.json({
      success: true,
      birthdays: birthdaysToday,
      count: birthdaysToday.length
    })
  } catch (error) {
    console.error('Error fetching birthdays:', error)
    return Response.json({ success: false, error: 'Failed to fetch birthdays' }, { status: 500 })
  }
}
