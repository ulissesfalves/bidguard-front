import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false, // Necessário para verificar a assinatura do Stripe
  },
};

// Configuração segura
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Chave mestra (CUIDADO)

// Supabase Admin (para escrever no banco sem restrição)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    // 1. Verifica se o chamado vem mesmo do Stripe
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Processa o evento "Pagamento Aprovado"
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userEmail = session.customer_details?.email;

    if (userEmail) {
      console.log(`💰 Pagamento recebido de: ${userEmail}`);

      // 3. Atualiza o usuário para PRO no Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_pro: true,
          stripe_customer_id: session.customer as string
        })
        .eq('email', userEmail);

      if (error) {
        console.error('Erro ao atualizar Supabase:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }
    }
  }

  res.json({ received: true });
}