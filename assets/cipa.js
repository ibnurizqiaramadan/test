var socket, quill

window.onload = function () {
    // alert("hello")
    initQuill()
    connectSocket()
}

function connectSocket() {
    socket = io.connect(`https://dev.xyrus10.com`)
    // socket = io.connect(`http://localhost:6996`)
    socket.on("connect", () => {
        console.log("socket connected")
        socket.emit('getContent')
    });

    socket.on('reciveChange', delta => {
        quill.updateContents(delta)
    })

    socket.on('reciveContent', delta => {
        quill.setContents(delta)
    })
}

function initQuill() {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    quill.on('text-change', function (delta, oldDelta, source) {
        if (source == 'api') {
            console.log("An API call triggered this change.");
        } else if (source == 'user') {
            console.log("A user action triggered this change.");
        }
        // console.log(delta);
        socket.emit('change', delta, oldDelta, source)
    });
}