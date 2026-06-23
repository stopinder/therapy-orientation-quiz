import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
    runtime: "nodejs"
}

export default async function handler(
    request,
    response
) {

    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        console.log("webhook received")

        const eventType = request.body.meta?.event_name
        console.log("event type:", eventType)

        if (eventType !== "order_created") {
            return response.status(200).json({
                received: true
            })
        }

        const attributes = request.body.data?.attributes || {}
        const rawEmail = attributes.user_email
        console.log("raw email:", rawEmail)

        if (!rawEmail) {
            return response.status(400).json({
                error: "Missing customer email"
            })
        }

        const normalisedEmail = rawEmail.trim().toLowerCase()
        console.log("normalised email:", normalisedEmail)

        console.log("paid_access upsert attempt")
        const { error: upsertError } = await supabase
            .from("paid_access")
            .upsert({
                email: normalisedEmail,
                active: true,
                product: "mindworks_course"
            }, {
                onConflict: "email"
            })

        if (upsertError) {
            console.error("Supabase error:", upsertError)
            return response.status(500).json({ error: upsertError })
        }

        console.log("Supabase success")

        return response.status(200).json({
            success: true
        })

    } catch (error) {
        console.error("LEMON WEBHOOK ERROR:", error)
        return response.status(500).json({
            error: error.message || "Server error"
        })
    }
}