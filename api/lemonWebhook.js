import crypto from "crypto"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
    runtime: "nodejs"
}

export default async function handler(request, response) {

    if (request.method !== "POST") {

        return response.status(405).json({
            error: "Method not allowed"
        })

    }

    try {

        const rawBody = JSON.stringify(request.body)

        const signature =
            request.headers["x-signature"]

        const secret =
            process.env.LEMON_WEBHOOK_SECRET

        const digest = crypto
            .createHmac("sha256", secret)
            .update(rawBody)
            .digest("hex")

        if (digest !== signature) {

            console.error(
                "INVALID LEMON SIGNATURE"
            )

            return response.status(401).json({
                error: "Invalid signature"
            })

        }

        const eventName = request.body.meta?.event_name

        if (eventName !== "order_created") {

            return response.status(200).json({
                received: true
            })

        }

        const attributes =
            request.body.data?.attributes || {}

        const email =
            attributes.user_email

        if (!email) {

            return response.status(400).json({
                error: "Missing customer email"
            })

        }

        const { data: existingUser } =
            await supabase
                .from("course_entitlements")
                .select("id")
                .eq("email", email)
                .maybeSingle()

        if (!existingUser) {

            const {
                data: authUsers
            } = await supabase.auth.admin.listUsers()

            const matchedUser =
                authUsers?.users?.find(
                    (user) =>
                        user.email?.toLowerCase() ===
                        email.toLowerCase()
                )

            await supabase
                .from("course_entitlements")
                .insert([
                    {
                        user_id:
                            matchedUser?.id || null,

                        email,

                        full_course_bool: true,

                        active_bool: true
                    }
                ])

        }

        return response.status(200).json({
            success: true
        })

    } catch (error) {

        console.error(
            "LEMON WEBHOOK ERROR:",
            error
        )

        return response.status(500).json({
            error: error.message || "Server error"
        })

    }

}