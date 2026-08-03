import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request) {
  try {
    const body = await request.json()
    const { currentPassword, newUsername, newPassword } = body

    // Verify current password
    const currentAdminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'MrCoco@2025#Secure'
    
    if (currentPassword !== currentAdminPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Read current .env file
    const envPath = path.join(process.cwd(), '.env')
    let envContent = fs.readFileSync(envPath, 'utf8')

    // Update username if changed
    if (newUsername && newUsername !== process.env.NEXT_PUBLIC_ADMIN_USERNAME) {
      const usernameRegex = /NEXT_PUBLIC_ADMIN_USERNAME=.*/
      if (usernameRegex.test(envContent)) {
        envContent = envContent.replace(usernameRegex, `NEXT_PUBLIC_ADMIN_USERNAME=${newUsername}`)
      } else {
        envContent += `\nNEXT_PUBLIC_ADMIN_USERNAME=${newUsername}`
      }
    }

    // Update password if provided
    if (newPassword) {
      const passwordRegex = /NEXT_PUBLIC_ADMIN_PASSWORD=.*/
      if (passwordRegex.test(envContent)) {
        envContent = envContent.replace(passwordRegex, `NEXT_PUBLIC_ADMIN_PASSWORD="${newPassword}"`)
      } else {
        envContent += `\nNEXT_PUBLIC_ADMIN_PASSWORD="${newPassword}"`
      }
    }

    // Write updated content back to .env
    fs.writeFileSync(envPath, envContent, 'utf8')

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully. Please restart the server for changes to take effect.'
    })
  } catch (error) {
    console.error('Error updating admin settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
