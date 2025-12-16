export default async function handler(req, res) {
    let body = req.body

    if (typeof body === "string") {
        body = JSON.parse(body)
    }

    const { report } = body || {}

    return res.status(200).json({
        text: report || "<<EMPTY REPORT RECEIVED>>"
    })
}
