var socket, quill

window.onload = function () {
    // alert("hello")
    initQuill()
    connectSocket()
}

function connectSocket() {
    // socket = io.connect(`http://20.185.60.9:6996`)
    socket = io.connect(`http://localhost:6996`)
    socket.on("connect", () => {
        console.log("socket connected")
        socket.emit('connected')
        socket.emit('getContent')
    });

    socket.on('reciveChange', delta => {
        quill.updateContents(delta)
    })

    socket.on('reciveContent', delta => {
        quill.setContents(delta)
    })

    socket.on('userListUpdate', clientList => {
        // console.log(clientList)
        let playerList = document.getElementById('playerList')
        // console.log(playerList)
        let players = ``
        clientList.forEach(player => {
            if (typeof player?.username !== null) players += `<li>${player?.username ?? '-'}</li>`
        })
        playerList.innerHTML = players
    })
}

function initQuill() {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    quill.on('text-change', function (delta, oldDelta, source) {
        socket.emit('change', delta, oldDelta, source)
    });
}