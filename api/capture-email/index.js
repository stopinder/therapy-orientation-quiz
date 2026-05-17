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

        const { email } = req.body || {}

        if (!email || !email.includes("@")) {

            return res.status(400).json({
                error: "Invalid email address"
            })

        }

        console.log("Captured email:", email)

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