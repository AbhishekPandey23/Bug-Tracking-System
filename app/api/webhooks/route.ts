// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error('❌ Missing Clerk Webhook Secret');
      return NextResponse.json(
        { error: 'Missing Clerk Webhook Secret' },
        { status: 500 }
      );
    }

    // ✅ Safely get required headers
    const headerList = await headers();
    const svix_id = headerList.get('svix-id');
    const svix_timestamp = headerList.get('svix-timestamp');
    const svix_signature = headerList.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing Svix headers' },
        { status: 400 }
      );
    }

    // ✅ Parse the raw body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // ✅ Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('❌ Webhook verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const eventType = evt.type;
    console.log(`📩 Clerk Webhook received: ${eventType}`);

    // ✅ Handle events
    if (eventType === 'user.created') {
      const { id, first_name, last_name, email_addresses } = evt.data;
      const email = email_addresses?.[0]?.email_address ?? '';
      const fullName = `${first_name ?? ''} ${last_name ?? ''}`.trim();

      await prisma.user.upsert({
        where: { clerkId: id },
        update: { name: fullName, email },
        create: { clerkId: id, name: fullName, email },
      });
    }

    if (eventType === 'user.updated') {
      const { id, first_name, last_name, email_addresses } = evt.data;
      const email = email_addresses?.[0]?.email_address ?? '';
      const fullName = `${first_name ?? ''} ${last_name ?? ''}`.trim();

      await prisma.user.updateMany({
        where: { clerkId: id },
        data: { name: fullName, email },
      });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      await prisma.user.deleteMany({
        where: { clerkId: id },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('🔥 Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
