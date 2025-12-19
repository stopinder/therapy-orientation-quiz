export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { email } = req.body

    if (!email) {
        return res.status(400).json({ error: "Email required" })
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email,
                updateEnabled: true,
                attributes: {
                    SOURCE: "mindworks_quiz",
                    OPT_IN: true
                }
            })
        })

        if (!response.ok) {
            const err = await response.text()
            return res.status(500).json({ error: err })
        }

        return res.status(200).json({ success: true })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}
