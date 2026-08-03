import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - Fetch baking course data
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    let courseData = await db.collection('baking_course').findOne({})
    
    if (!courseData) {
      // Return default data if nothing exists
      courseData = {
        bannerImage: '',
        courses: [
          {
            id: 'beginner',
            name: 'Beginner Baking Course',
            duration: '4 Weeks (12 Sessions)',
            nextBatch: '2025-03-15',
            content: ['Basic Baking Techniques', 'Simple Cakes & Cupcakes', 'Cookies & Biscuits', 'Basic Frosting & Decoration']
          },
          {
            id: 'advanced',
            name: 'Advanced Baking Course',
            duration: '6 Weeks (18 Sessions)',
            nextBatch: '2025-04-01',
            content: ['Advanced Cake Techniques', 'Fondant Work & Sugar Art', 'French Pastries', 'Wedding Cake Design']
          }
        ]
      }
    }

    return NextResponse.json({ courseData })
  } catch (error) {
    console.error('Error fetching course data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course data' },
      { status: 500 }
    )
  }
}

// POST - Update baking course data
export async function POST(request) {
  try {
    const body = await request.json()
    const { bannerImage, courses } = body

    const { db } = await connectToDatabase()

    const courseData = {
      bannerImage: bannerImage || '',
      courses: courses || [],
      updatedAt: new Date().toISOString()
    }

    await db.collection('baking_course').updateOne(
      {},
      { $set: courseData },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating course data:', error)
    return NextResponse.json(
      { error: 'Failed to update course data' },
      { status: 500 }
    )
  }
}
