import express from "express"
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHoursStringtoMinuts } from "./utils/convert-hour-string-to-minutes"
import { ConvertMinutesToHourString } from "./utils/convert-minutes-to-hour-string"

const app = express()
app.use(express.json())
app.use(cors())
const prisma = new PrismaClient()

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  })
  return res.json(games)
})

app.get('/games/:id/ads', async (req, res) => {
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId: req.params.id
    },
    orderBy: {
      createdAt: 'desc',
    }
  })

  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: ConvertMinutesToHourString(ad.hourStart),
      hourEnd: ConvertMinutesToHourString(ad.hourEnd),
    }
  }))
})

app.post('/games/:id/ads', async (req, res) => {
  const ad = await prisma.ad.create({
    data: {
      gameId: req.params.id,
      name: req.body.name,
      yearsPlaying: req.body.yearsPlaying,
      discord: req.body.discord,
      weekDays: req.body.weekDays.join(','),
      hourStart: convertHoursStringtoMinuts(req.body.hourStart),
      hourEnd: convertHoursStringtoMinuts(req.body.hourEnd),
      useVoiceChannel: req.body.useVoiceChannel
    }
  })
  return res.json(ad)
})

app.get('/ads/:id/discord', async (req, res) => {
  const discord = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: req.params.id,
    }
  })
  return res.json({
    discord: discord.discord
  })
})

app.listen(3333)