import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { weaponId, priceMX, userId } = req.body
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: { name: `Jandocity — ${weaponId}` },
          unit_amount: priceMX * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL || 'https://jandocity.vercel.app'}/?success=${weaponId}`,
      cancel_url: `${process.env.VITE_APP_URL || 'https://jandocity.vercel.app'}/?canceled=1`,
      metadata: { weaponId, userId },
    })
    res.status(200).json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
