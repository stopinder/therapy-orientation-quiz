```js id="mr9l0w"
import { createClient }
    from "@supabase/supabase-js"

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

        const {
            userId
        } = request.body || {}

        if (!userId) {

            return response
                .status(400)
                .json({
                    error:
                        "Missing user ID"
                })

        }

        const {
            data,
            error
        } = await supabase
            .from("course_reflections")
            .select("*")
            .eq("user_id", userId)
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
```
