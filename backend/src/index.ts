import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('💼 OFFER-HUB backend is up and running!')
})

app.listen(port, () => {
  console.log(`🚀 OFFER-HUB server is live at http://localhost:${port}`)
  console.log('🌐 Connecting freelancers and clients around the world...')
  console.log('💼 Working...')
})
