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
userId,
week
} = request.body || {}

if (!userId || !week) {

return response
.status(400)
.json({
error:
"Missing userId or week"
})

}

const {
data,
error
} = await supabase
.from("course_reflections")
.select("*")
.eq("user_id", userId)
.eq("week_number", week)
.order(
"created_at",
{
ascending: false
}
)
.limit(1)
.maybeSingle()

if (error) {

console.error(
"GET REFLECTION ERROR:",
error
)

return response
.status(500)
.json({
error:
"Failed to load reflection"
})

}

return response
.status(200)
.json({

reflection:
data || null

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