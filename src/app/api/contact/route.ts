import { NextResponse } from 'next/server'

// Replace with your email service (Resend, SendGrid, Postmark, etc.)
// This stub logs the lead and returns success — wire up an email API before going live.

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, message, companyName, companyId } = body

    if (!name || !phone || !companyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: send email via Resend/SendGrid
    // await sendLeadEmail({ name, phone, email, message, companyName })

    console.log('[LEAD]', { name, phone, email, message, companyName, companyId, ts: new Date().toISOString() })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
