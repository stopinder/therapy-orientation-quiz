import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
    runtime: "nodejs"
}

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        })
    }

    try {

        const { email, profile } = req.body || {}

        if (!email || !email.includes("@")) {

            return res.status(400).json({
                error: "Invalid email address"
            })

        }

        const normalisedEmail =
            String(email)
                .trim()
                .toLowerCase()

        console.log("PROFILE RECEIVED:", profile)

        const investigationAreas = profile?.investigationAreas || []
        const signals = profile?.transitionSignals || []
        const situations = profile?.recurringSituations || []

        const quizProfileSummary = `
INVESTIGATION SNAPSHOT

Top Investigation Areas:
${investigationAreas.map(a => `- ${a.id} (strength: ${a.strength.toFixed(2)})`).join("\n")}

Transition Signals:
${signals.join(", ")}

Recurring Situations:
${situations.join(", ")}

Primary Question:
${profile?.firstQuestion}
`.trim()

        const { error } = await supabase
            .from("quiz_submissions")
            .upsert(
                {
                    email: normalisedEmail,
                    profile_data: profile || null,
                    quiz_profile_summary: quizProfileSummary
                },
                {
                    onConflict: "email"
                }
            )

        console.log("SUPABASE ERROR:", error)

        if (error) {

            console.error(
                "QUIZ SUBMISSION SAVE ERROR:",
                error
            )

            return res.status(500).json({
                error: "Failed to save quiz submission"
            })

        }

        console.log("Quiz submission saved:", normalisedEmail)

        return res.status(200).json({
            success: true
        })

    } catch (err) {

        console.error("Capture email error:", err)

        return res.status(500).json({
            error: "Server error"
        })

    }

}