export const config = {
    runtime: "nodejs"
}

export default async function handler(req, res) {
    console.log("Brevo endpoint hit")

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { email, reflection } = req.body || {}

    if (!email) {
        return res.status(400).json({ error: "Email required" })
    }

    try {
        //
        // 1. SAVE CONTACT
        //
        const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
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

        const contactText = await contactRes.text()

        if (!contactRes.ok) {
            console.error("Brevo contact error:", contactText)
            // don't fail completely — still return success
        }

        //
        // 2. OPTIONAL: SEND EMAIL (only if reflection provided)
        //
        if (reflection) {
            const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.BREVO_API_KEY
                },
                body: JSON.stringify({
                    sender: {
                        name: "MindWorks",
                        email: "your@email.com" // change this
                    },
                    to: [{ email }],
                    subject: "Your MindWorks Reflection",
                    htmlContent: `
            <html>
              <body style="font-family: Arial; max-width: 600px; margin: 40px auto; line-height: 1.6;">
                <h2>Your Reflection</h2>
                ${reflection
                        .split("\n\n")
                        .map(p => `<p>${p}</p>`)
                        .join("")}
              </body>
            </html>
          `
                })
            })

            const emailText = await emailRes.text()

            if (!emailRes.ok) {
                console.error("Brevo email error:", emailText)
            }
        }

        return res.status(200).json({ success: true })

    } catch (err) {
        console.error("Brevo endpoint crash:", err)

        return res.status(500).json({
            error: err.message || "Server error"
        })
    }
}