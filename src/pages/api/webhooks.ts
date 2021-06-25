import { Stripe } from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readble: Readable) {
    const chunks = []

    for await (const chunck of readble) {
        chunks.push(
            typeof chunck === 'string' ? Buffer.from(chunck) : chunck
        )
    }

    return Buffer.concat(chunks)
}

export const config = {
    api: {
        bodyPaser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("---------RECEBI-----------", req)
    if (req.method === 'POST'){
        
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event
      
        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
           
        } catch (err) {
       
           return res.status(400).json(`Webhoo error: ${err.message}`) 
        }

        const { type } = event
     
        if (relevantEvents.has(type)){
            try {
                switch (type) {
                    case 'checkout.session.completed':
                        const checkoutSession = event.data.object as Stripe.Checkout.Session
                    
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString()
                        )    
                        break;
                
                    default:
                        throw new Error('Unhandled event')
                        break;
                }    
            } catch (error) {
                return res.json({error: 'Webhook handler failed'})    
            }
            
            console.log('Evento recebido', event)
            
        }

        res.status(200).json({ ok: true})
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method not allowed");
    }
    
    
}