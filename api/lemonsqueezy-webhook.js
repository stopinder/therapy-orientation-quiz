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
        console.log("Method not allowed:", request.method)
        return response.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        console.log("webhook received")
        console.log("Request method:", request.method)

        const payload = request.body || {}
        console.log("Event type:", payload.meta?.event_name)
        console.log("Raw payload structure (keys):", Object.keys(payload))
        if (payload.data) {
            console.log("Payload data keys:", Object.keys(payload.data))
            console.log("Payload data attributes:", payload.data.attributes)
        }
        if (payload.meta) {
            console.log("Payload meta keys:", Object.keys(payload.meta))
            console.log("Payload meta custom_data:", payload.meta.custom_data)
        }

        console.log("SUPABASE_URL present:", !!process.env.VITE_SUPABASE_URL)
        console.log("SUPABASE_SERVICE_ROLE_KEY present:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

        const eventType = payload.meta?.event_name

        if (eventType !== "order_created") {
            return response.status(200).json({
                received: true,
                ignored_event: eventType
            })
        }

        // Extract customer email safely
        let rawEmail = null
        let sourceField = null

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
            sourceField = "data.attributes.user_email"
        } else if (payload.data?.attributes?.customer_email) {
            rawEmail = payload.data.attributes.customer_email
            sourceField = "data.attributes.customer_email"
        } else if (payload.meta?.custom_data?.email && !isPlaceholder(payload.meta.custom_data.email)) {
            rawEmail = payload.meta.custom_data.email
            sourceField = "meta.custom_data.email"
        }

        console.log("Raw email:", rawEmail)
        console.log("Email source field:", sourceField)

        if (!rawEmail) {
            if (payload.meta?.custom_data?.email && isPlaceholder(payload.meta.custom_data.email)) {
                console.log("Placeholder email detected - not inserting paid_access")
                return response.status(400).json({
                    error: "Placeholder email detected - not inserting paid_access"
                })
            }

            console.error("Missing customer email in payload")
            return response.status(400).json({
                error: "Missing customer email",
                diagnostics: {
                    has_data: !!payload.data,
                    has_attributes: !!payload.data?.attributes,
                    has_meta: !!payload.meta,
                    has_custom_data: !!payload.meta?.custom_data
                }
            })
        }

        const normalisedEmail = rawEmail.trim().toLowerCase()
        console.log("normalised email:", normalisedEmail)

        console.log("paid_access upsert attempt")
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

        console.log("Supabase success:", upsertData)

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