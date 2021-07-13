var express = require('express')
var app = express()
var http = require('http').createServer(app);
var request = require('request');
app.use(express.static('public'));

http.listen(process.env.PORT || 6996, function () {
    var host = http.address().address
    var port = http.address().port
    console.log(`App listening at http://${host}:${port}`)
});

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

const io = require("socket.io")(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
});

var clientList = []
var clientList2 = []
var oldDeltaData = []

function cekUsername(username) {
    let flag = 0
    Object.keys(clientList).forEach(item => {
        if (clientList[item].userData.username == username) flag++
        // console.log(clientList[item])
    })
    return flag > 0 ? false : true
}

io.on("connection", socket => {

    socket.on('connected', () => {
        // if (!) console.log("hadehh");
        // if (!cekUsername(userData.username)) return socket.emit('error', "Username sudah ada")
        console.log(`User Connected`)
        clientList[socket.id] = {username: socket.id, room:socket.rooms}
        clientList2.push({username: socket.id, room:socket.rooms})
        console.log(clientList)
        io.emit("userListUpdate", clientList2)
    })

    socket.on('change', (delta, oldDelta, source) => {
        if (source == 'api') return
        socket.broadcast.emit('reciveChange', delta)
        oldDeltaData = oldDelta
    })

    socket.on('getContent', () => {
        socket.emit('reciveContent', oldDeltaData)
    })

    socket.on("disconnect", (reason) => {
        console.log("user leave", reason, clientList[socket.id])
        let flag = 0
        Object.keys(clientList2).forEach(item => {
            if (clientList2[item].username == socket.id) flag = item;
            // console.log(clientList[item])
        })
        console.log(flag)
        // delete(clientList2[flag])
        clientList2.splice(flag, 1)
        io.emit("userListUpdate", clientList2)
    })

})