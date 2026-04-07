const express = require("express")
const fs = require("fs")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const data = fs.readFileSync("data.txt", "utf8")

function normalizeQuestion(question) {
  let q = question.toLowerCase()

  q = q.replace(/\?/g, "")
  q = q.replace(/\./g, "")
  q = q.replace(/\,/g, "")

  q = q.replace("palautusaika", "palautus")
  q = q.replace("toimitusaika", "toimitus")
  q = q.replace("toimituksen hinta", "maksaa")
  q = q.replace("toimitusmaksu", "maksaa")
  q = q.replace("paljonko", "maksaa")
  q = q.replace("milloin", "auki")
  q = q.replace("aukioloaika", "auki")

  return q
}

function findAnswer(question) {
  const lines = data.split("\n").filter((line) => line.trim() !== "")

  const stopWords = [
    "mita",
    "mitä",
    "mika",
    "mikä",
    "on",
    "kuinka",
    "pitkä",
    "kauan",
    "se",
    "ja",
    "voi",
    "voiko",
    "olla",
  ]

  const normalized = normalizeQuestion(question)

  const words = normalized
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word !== "" && !stopWords.includes(word))

  let bestMatch = ""
  let bestScore = 0

  for (let line of lines) {
    let score = 0
    const lowerLine = line.toLowerCase()

    for (let word of words) {
      if (lowerLine.includes(word)) {
        score += 2
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = line
    }
  }

  if (bestScore > 0) {
    return bestMatch
  }

  return "Tietoa ei löytynyt"
}

app.post("/chat", (req, res) => {
  const question = req.body.question

  if (!question) {
    return res.json({ answer: "Kysymys puuttuu" })
  }

  const answer = findAnswer(question)

  res.json({
    answer: answer,
  })
})

app.listen(3000, () => {
  console.log("Backend running on port 3000")
})
