export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(410).json({
    error: 'The former orientation quiz has been retired. Please use the therapist reflection.',
    nextPath: '/therapist-quiz'
  })
}
