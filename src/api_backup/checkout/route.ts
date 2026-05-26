import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with a fallback so the app won't crash if env var is missing during dev
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(req: Request) {
    try {
        const { priceId } = await req.json();
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        if (!process.env.STRIPE_SECRET_KEY) {
            // Return a simulated success for demonstration if no keys are set
            console.warn("STRIPE_SECRET_KEY is missing. Simulating checkout.");
            return NextResponse.json({ url: `${origin}/success?session_id=simulated_session` });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    // e.g. price_12345 (you get this from your Stripe Dashboard)
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/pricing`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
