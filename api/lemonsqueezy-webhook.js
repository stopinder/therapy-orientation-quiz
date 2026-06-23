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
        console.log("LEMON WEBHOOK: Method not allowed:", request.method)
        return response.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        const payload = request.body || {}
        const eventType = payload.meta?.event_name

        if (eventType !== "order_created") {
            return response.status(200).json({
                received: true,
                ignored_event: eventType
            })
        }

        console.log("Webhook received")

        // Extract customer email safely
        let rawEmail = null

        const placeholders = [
            "YOUR-PAID-EMAIL-HERE",
            "your-paid-email-here",
            "test@example.com",
            "customer@example.com"
        ]

        const isPlaceholder = (email) => {
            if (!email) return false
            const normalized = email.trim().toLowerCase()
            return placeholders.some(p => p.toLowerCase() === normalized)
        }

        if (payload.data?.attributes?.user_email) {
            rawEmail = payload.data.attributes.user_email
        } else if (payload.data?.attributes?.customer_email) {
            rawEmail = payload.data.attributes.customer_email
        } else if (payload.meta?.custom_data?.email && !isPlaceholder(payload.meta.custom_data.email)) {
            rawEmail = payload.meta.custom_data.email
        }

        if (!rawEmail) {
            if (payload.meta?.custom_data?.email && isPlaceholder(payload.meta.custom_data.email)) {
                console.log("LEMON WEBHOOK: Placeholder email detected - not inserting paid_access")
                return response.status(400).json({
                    error: "Placeholder email detected - not inserting paid_access"
                })
            }

            console.error("LEMON WEBHOOK: Missing customer email in payload")
            return response.status(400).json({
                error: "Missing customer email"
            })
        }

        const normalisedEmail = rawEmail.trim().toLowerCase()
        console.log("Payment email:", normalisedEmail)

        const { data: upsertData, error: upsertError } = await supabase
            .from("paid_access")
            .upsert({
                email: normalisedEmail,
                active: true,
                product: "mindworks_course"
            }, {
                onConflict: "email"
            })
            .select()

        if (upsertError) {
            console.error("Supabase error:", upsertError)
            return response.status(500).json({
                error: "Supabase upsert failed",
                details: upsertError
            })
        }

        console.log("Course access granted:", normalisedEmail)

        return response.status(200).json({
            success: true,
            email: normalisedEmail
        })

    } catch (error) {
        console.error("LEMON WEBHOOK ERROR:", error)
        return response.status(500).json({
            error: error.message || "Server error"
        })
    }
}