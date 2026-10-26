import { NextRequest, NextResponse } from 'next/server';
import { sendInvoiceEmail } from '@/lib/stripe';
import { db } from '@/lib/db';

/**
 * POST /api/admin/leads/[id]/invoice
 * Email the lead a Stripe invoice they can pay online.
 * Body: { description, amount, shipping?, daysUntilDue?, memo? } (amounts in dollars)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const amount = Number(body.amount);
    const shipping = Number(body.shipping || 0);
    const daysUntilDue = Number(body.daysUntilDue || 7);
    const description = String(body.description || lead.productName || 'Medical equipment').trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'El precio debe ser mayor que 0' }, { status: 400 });
    }
    if (!Number.isFinite(shipping) || shipping < 0) {
      return NextResponse.json({ error: 'El envio no es valido' }, { status: 400 });
    }
    if (!Number.isInteger(daysUntilDue) || daysUntilDue < 1 || daysUntilDue > 90) {
      return NextResponse.json({ error: 'Los dias para pagar deben estar entre 1 y 90' }, { status: 400 });
    }

    const items = [{ description, amountInCents: Math.round(amount * 100) }];
    if (shipping > 0) {
      items.push({ description: 'Shipping', amountInCents: Math.round(shipping * 100) });
    }

    const invoice = await sendInvoiceEmail({
      customerName: lead.name,
      customerEmail: lead.email,
      customerPhone: lead.phone,
      items,
      daysUntilDue,
      memo: body.memo ? String(body.memo) : undefined,
      metadata: { leadId: lead.id, ...(lead.productId ? { productId: lead.productId } : {}) },
    });

    // Track the invoice as a pending order; the webhook completes it on invoice.paid
    await db.order.create({
      data: {
        stripeSessionId: invoice.id,
        productId: lead.productId,
        productName: description,
        customerEmail: lead.email,
        customerName: lead.name,
        amount: (invoice.amount_due || 0) / 100,
        currency: invoice.currency || 'usd',
        status: 'pending',
        metadata: JSON.stringify({
          type: 'invoice',
          leadId: lead.id,
          invoiceNumber: invoice.number,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
        }),
      },
    });

    if (lead.status === 'new') {
      await db.lead.update({ where: { id }, data: { status: 'contacted' } });
    }

    return NextResponse.json({
      invoiceId: invoice.id,
      number: invoice.number,
      url: invoice.hosted_invoice_url,
      amount: (invoice.amount_due || 0) / 100,
    });
  } catch (error: unknown) {
    console.error('Error sending invoice:', error);
    const message = error instanceof Error ? error.message : 'Failed to send invoice';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
