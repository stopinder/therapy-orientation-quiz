import { createClient } from "@supabase/supabase-js"
import { getAuthenticatedUser } from "../_lib/auth"

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
        const user = await getAuthenticatedUser(request)
        if (!user) {
            return response.status(401).json({
                error: "Unauthorized"
            })
        }

        const verifiedEmail = user.email
        const normalizedEmail = verifiedEmail.trim().toLowerCase()
        
        const { data, error } = await supabase
            .from("paid_access")
            .select("id")
            .eq("email", normalizedEmail)
            .eq("active", true)
            .limit(1)
            .maybeSingle()

        if (error) {
            console.error("Supabase error checking course access:", error)
            return response.status(500).json({
                error: "Internal server error"
            })
        }

        const rowFound = !!data
        const hasAccess = rowFound
        
        return response.status(200).json({
            hasAccess
        })

    } catch (err) {
        console.error("Unexpected error in check-course-access:", err)
        return response.status(500).json({
            error: "Internal server error"
        })
    }
}
