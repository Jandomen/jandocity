import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.get('/', (req,res)=> res.json({ ok:true, at: new Date().toISOString(), clients: io?.engine?.clientsCount || 0 }))
app.get('/rooms', (req,res)=> res.json(rooms))

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

let rooms = [] 

io.on('connection', socket => {
  socket.on('create-room', ({ key, player }) => {
    rooms.push({ key, hostId: socket.id, players: [player], status: 'waiting' })
    socket.join(key); socket.data.key = key
    io.emit('rooms', rooms)
  })
  socket.on('join-room', ({ key, player }) => {
    const r = rooms.find(x=>x.key===key)
    if (r && r.players.length < 8) { r.players.push(player); socket.join(key); socket.data.key = key; io.to(key).emit('room-update', r); io.emit('rooms', rooms) }
  })
  socket.on('update-room', (room) => {
    const idx = rooms.findIndex(x=>x.key===room.key)
    if (idx!==-1) { rooms[idx]=room; io.to(room.key).emit('room-update', room); io.emit('rooms', rooms) }
  })
  socket.on('disconnect', () => {
    
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, '0.0.0.0', () => console.log(`LAN server on http://0.0.0.0:${PORT} — host guarda mundo local, clientes verán Esperando/Accediendo`))
