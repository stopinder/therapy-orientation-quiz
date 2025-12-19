export default async function handler(req, res) {
    try {
        res.setHeader("Content-Type", "application/json")
        res.status(200).end(
            JSON.stringify({
                ok: true,
                method: req.method
            })
        )
    } catch (err) {
        res.status(500).end(
            JSON.stringify({
                error: err.message
            })
        )
    }
}
