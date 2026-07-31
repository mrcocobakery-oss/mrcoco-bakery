import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Cookies from 'cookies'

function getUserFromCookies(request) {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const cookies = new Cookies(request)
  return cookies.get('user_email') || null
}

// GET - Fetch user's addresses
export async function GET(request) {
  try {
    const userEmail = getUserFromCookies(request)
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    
    const addresses = await db.collection('addresses')
      .find({ userEmail })
      .sort({ isDefault: -1, createdAt: -1 })
      .toArray()

    return NextResponse.json({ 
      success: true,
      addresses 
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch addresses' 
    }, { status: 500 })
  }
}

// POST - Add new address
export async function POST(request) {
  try {
    const userEmail = getUserFromCookies(request)
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const addressData = await request.json()
    const { db } = await connectToDatabase()
    
    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await db.collection('addresses').updateMany(
        { userEmail },
        { $set: { isDefault: false } }
      )
    }

    const newAddress = {
      _id: crypto.randomUUID(),
      userEmail,
      ...addressData,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection('addresses').insertOne(newAddress)

    return NextResponse.json({ 
      success: true,
      address: newAddress,
      message: 'Address added successfully' 
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to add address' 
    }, { status: 500 })
  }
}

// PUT - Update address
export async function PUT(request) {
  try {
    const userEmail = getUserFromCookies(request)
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { addressId, ...updates } = await request.json()
    const { db } = await connectToDatabase()
    
    // If setting as default, unset other defaults
    if (updates.isDefault) {
      await db.collection('addresses').updateMany(
        { userEmail, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      )
    }

    await db.collection('addresses').updateOne(
      { _id: addressId, userEmail },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ 
      success: true,
      message: 'Address updated successfully' 
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update address' 
    }, { status: 500 })
  }
}

// DELETE - Remove address
export async function DELETE(request) {
  try {
    const userEmail = getUserFromCookies(request)
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('addressId')
    const { db } = await connectToDatabase()

    await db.collection('addresses').deleteOne({
      _id: addressId,
      userEmail
    })

    return NextResponse.json({ 
      success: true,
      message: 'Address deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete address' 
    }, { status: 500 })
  }
}
