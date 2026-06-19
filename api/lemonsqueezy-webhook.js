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

        console.log(
            "LEMON WEBHOOK RECEIVED"
        )

        const eventName =
            request.body.meta?.event_name

        console.log(
            "EVENT:",
            eventName
        )

        if (eventName !== "order_created") {

            return response.status(200).json({
                received: true
            })

        }

        const attributes =
            request.body.data?.attributes || {}

        const email =
            attributes.user_email

        console.log(
            "CUSTOMER EMAIL:",
            email
        )

        if (!email) {

            return response.status(400).json({
                error: "Missing customer email"
            })

        }

        const {
            data: authUsers,
            error: authError
        } = await supabase
            .auth
            .admin
            .listUsers()

        if (authError) {

            console.error(
                "AUTH USER LOAD ERROR:",
                authError
            )

            return response.status(500).json({
                error: "Failed auth lookup"
            })

        }

        const matchedUser =
            authUsers?.users?.find(
                (user) =>
                    user.email?.toLowerCase() ===
                    email.toLowerCase()
            )

        if (!matchedUser) {

            return response.status(404).json({
                error: "User not found"
            })

        }

        console.log(
            "MATCHED USER:",
            matchedUser.id
        )

        const {
            data: existingEntitlement
        } = await supabase
            .from("course_entitlements")
            .select("id")
            .eq("user_id", matchedUser.id)
            .maybeSingle()

        const entitlementData = {
            user_id: matchedUser.id,
            email: email.toLowerCase(),
            full_course: true,
            active: true
        }

        if (!existingEntitlement) {

            const {
                error: insertError
            } = await supabase
                .from("course_entitlements")
                .insert([entitlementData])

            if (insertError) {

                console.error(
                    "ENTITLEMENT INSERT ERROR:",
                    insertError
                )

                return response.status(500).json({
                    error: "Failed entitlement insert"
                })

            }

            console.log("ENTITLEMENT CREATED")

        } else {

            const {
                error: updateError
            } = await supabase
                .from("course_entitlements")
                .update(entitlementData)
                .eq("id", existingEntitlement.id)

            if (updateError) {

                console.error(
                    "ENTITLEMENT UPDATE ERROR:",
                    updateError
                )

                return response.status(500).json({
                    error: "Failed entitlement update"
                })

            }

            console.log("ENTITLEMENT UPDATED")

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
            error:
                error.message ||
                "Server error"
        })

    }

}