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
            attributes.user_email?.toLowerCase().trim()

        console.log(
            "CUSTOMER EMAIL (NORMALIZED):",
            email
        )

        if (!email) {

            return response.status(400).json({
                error: "Missing customer email"
            })

        }

        // Try to find matching user, but don't fail if not found
        let userId = null

        try {
            const {
                data: authUsers,
                error: authError
            } = await supabase
                .auth
                .admin
                .listUsers()

            if (authError) {
                console.error("AUTH USER LIST ERROR (NON-FATAL):", authError)
            } else {
                const matchedUser = authUsers?.users?.find(
                    (user) => user.email?.toLowerCase().trim() === email
                )
                if (matchedUser) {
                    userId = matchedUser.id
                    console.log("MATCHED USER ID:", userId)
                }
            }
        } catch (e) {
            console.error("AUTH LOOKUP EXCEPTION (NON-FATAL):", e)
        }

        // Try to find if user has a quiz submission which might have a user_id
        if (!userId) {
            try {
                const { data: submission } = await supabase
                    .from('quiz_submissions')
                    .select('user_id')
                    .eq('email', email)
                    .not('user_id', 'is', null)
                    .limit(1)
                    .maybeSingle()

                if (submission?.user_id) {
                    userId = submission.user_id
                    console.log("MATCHED USER ID FROM SUBMISSION:", userId)
                }
            } catch (e) {
                console.log("SUBMISSION LOOKUP EXCEPTION (NON-FATAL):", e)
            }
        }

        // Prepare the record
        const entitlementData = {
            email: email,
            active: true,
            full_course: true,
            updated_at: new Date().toISOString()
        }

        if (userId) {
            entitlementData.user_id = userId
        }

        console.log("UPSERTING ENTITLEMENT:", entitlementData)

        // Use upsert on email if possible, or at least insert/update
        // We first try to find by email
        const { data: existing, error: findError } = await supabase
            .from("course_entitlements")
            .select("id")
            .eq("email", email)
            .maybeSingle()

        if (findError) {
            console.error("FIND ENTITLEMENT ERROR:", findError)
            // If the error is that 'email' column doesn't exist (400), we fallback to user_id if we have it
            if (findError.code === '42703' || findError.message?.includes('email')) {
                console.log("FALLBACK: email column missing in course_entitlements")
                
                if (userId) {
                    const { error: upsertByIdError } = await supabase
                        .from("course_entitlements")
                        .upsert({
                            user_id: userId,
                            active: true,
                            full_course: true
                        }, { onConflict: 'user_id' })

                    if (upsertByIdError) {
                        console.error("UPSERT BY ID ERROR:", upsertByIdError)
                        return response.status(500).json({ error: upsertByIdError })
                    }
                } else {
                    return response.status(400).json({ error: "Email column missing and no user_id found" })
                }
            } else {
                return response.status(500).json({ error: findError })
            }
        } else if (existing) {
            console.log("EXISTING ENTITLEMENT FOUND, UPDATING:", existing.id)
            const { error: updateError } = await supabase
                .from("course_entitlements")
                .update(entitlementData)
                .eq("id", existing.id)

            if (updateError) {
                console.error("UPDATE ERROR:", updateError)
                return response.status(500).json({ error: updateError })
            }
        } else {
            console.log("NO EXISTING ENTITLEMENT, INSERTING")
            const { error: insertError } = await supabase
                .from("course_entitlements")
                .insert([entitlementData])

            if (insertError) {
                console.error("INSERT ERROR:", insertError)
                // If it fails because of email column, it might have already returned in findError above,
                // but if not, we handle it here too.
                return response.status(500).json({ error: insertError })
            }
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