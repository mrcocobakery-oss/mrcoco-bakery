import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin user (you should add admin role check here)
    jwt.verify(token, JWT_SECRET)

    const { db } = await connectToDatabase()

    // Get all loyalty transactions
    const loyaltyTransactions = await db.collection('transactions')
      .find({
        category: { $in: ['loyalty_points', 'loyalty_redemption'] }
      })
      .toArray()

    // Calculate total points distributed and redeemed
    const totalPointsDistributed = loyaltyTransactions
      .filter(t => t.category === 'loyalty_points' && t.loyaltyPoints > 0)
      .reduce((sum, t) => sum + (t.loyaltyPoints || 0), 0)

    const totalPointsRedeemed = Math.abs(loyaltyTransactions
      .filter(t => t.category === 'loyalty_redemption' && t.loyaltyPoints < 0)
      .reduce((sum, t) => sum + (t.loyaltyPoints || 0), 0))

    // Get top customers by loyalty points
    const topCustomersByPoints = await db.collection('users')
      .find({ loyaltyPoints: { $gt: 0 } })
      .sort({ loyaltyPoints: -1 })
      .limit(10)
      .project({ name: 1, email: 1, loyaltyPoints: 1 })
      .toArray()

    // Get all users with referredBy to calculate referrals
    const usersWithReferrals = await db.collection('users')
      .find({ referredBy: { $exists: true, $ne: '' } })
      .toArray()

    // Group referrals by referral code
    const referralCounts = {}
    for (const user of usersWithReferrals) {
      const code = user.referredBy
      if (!referralCounts[code]) {
        referralCounts[code] = { count: 0, userIds: [] }
      }
      referralCounts[code].count++
      referralCounts[code].userIds.push(user._id)
    }

    // Get top referrers
    const topReferrers = await Promise.all(
      Object.entries(referralCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(async ([code, data]) => {
          const referrer = await db.collection('users').findOne({ referralCode: code })
          return {
            _id: referrer?._id,
            name: referrer?.name,
            email: referrer?.email,
            referralCode: code,
            referralCount: data.count,
            totalEarnings: data.count * 50
          }
        })
    )

    // Get recent loyalty transactions with user names
    const recentLoyaltyTxns = await db.collection('transactions')
      .find({
        category: { $in: ['loyalty_points', 'loyalty_redemption'] }
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    const recentLoyaltyTransactions = await Promise.all(
      recentLoyaltyTxns.map(async (txn) => {
        const user = await db.collection('users').findOne(
          { _id: txn.userId },
          { projection: { name: 1 } }
        )
        return {
          ...txn,
          userName: user?.name || 'Unknown'
        }
      })
    )

    // Get recent referrals (users who signed up with a referral code)
    const recentReferrals = await Promise.all(
      usersWithReferrals
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20)
        .map(async (user) => {
          const referrer = await db.collection('users').findOne(
            { referralCode: user.referredBy },
            { projection: { name: 1 } }
          )
          return {
            _id: user._id,
            newUserName: user.name,
            newUserEmail: user.email,
            referrerName: referrer?.name || 'Unknown',
            referralCode: user.referredBy,
            createdAt: user.createdAt
          }
        })
    )

    return NextResponse.json({
      totalPointsDistributed,
      totalPointsRedeemed,
      netPoints: totalPointsDistributed - totalPointsRedeemed,
      totalReferralEarnings: usersWithReferrals.length * 50,
      totalReferrals: usersWithReferrals.length,
      topCustomersByPoints,
      topReferrers: topReferrers.filter(r => r._id), // Filter out null referrers
      recentLoyaltyTransactions,
      recentReferrals
    })
  } catch (error) {
    console.error('Error fetching loyalty/referral analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
