export const config = {
    runtime: "nodejs"
}

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        console.log("LEMON WEBHOOK BODY:", JSON.stringify(req.body, null, 2))

        const event = req.body

        // We only care about successful checkouts
        if (event.meta?.event_name !== "order_created") {
            return res.status(200).json({ ignored: true })
        }

        const email = event.data?.attributes?.user_email
        const orderId = event.data?.id

        if (!email || !orderId) {
            return res.status(400).json({ error: "Missing email or order ID" })
        }

        await supabase.from("email_optins").insert({
            email,
            order_id: orderId,
            opt_in: false
        })

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Webhook error" })
    }
}
