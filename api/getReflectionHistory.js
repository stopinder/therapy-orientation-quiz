import { createClient }
    from "@supabase/supabase-js"
import { getAuthenticatedUser } from "./_lib/auth"

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

        return response
            .status(405)
            .json({
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

        const verifiedUserId = user.id

        const {
            data,
            error
        } = await supabase
            .from("course_reflections")
            .select("*")
            .eq("user_id", verifiedUserId)
            .order(
                "created_at",
                {
                    ascending: false
                }
            )

        if (error) {

            console.error(
                "REFLECTION HISTORY ERROR:",
                error
            )

            return response
                .status(500)
                .json({
                    error:
                        "Failed to load reflections"
                })

        }

        return response
            .status(200)
            .json({

                reflections:
                    data || []

            })

    } catch (error) {

        console.error(
            "SERVER ERROR:",
            error
        )

        return response
            .status(500)
            .json({
                error:
                    error.message ||
                    "Server error"
            })

    }

}