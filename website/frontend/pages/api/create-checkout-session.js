import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { jerseyType, jerseyPrice, playerName, customerName } = req.body;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmalisheva.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: jerseyType || 'Fanella FC Malisheva',
              description:
                playerName && playerName !== 'Pa emër'
                  ? `Emri në fanellë: ${playerName}`
                  : undefined,
              images: ['https://fcmalisheva.vercel.app/assets/MalishevaLogo.png'],
            },
            unit_amount: Math.round((jerseyPrice || 15) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        customerName: customerName || '',
        jerseyType: jerseyType || '',
        playerName: playerName || '',
      },
      success_url: `${siteUrl}/checkout?success=true`,
      cancel_url: `${siteUrl}/checkout?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
