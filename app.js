const net = require("net")
const fs = require("fs")

const getHeader = ((headers, str) => headers.find(header => header.toLowerCase().startsWith(str)))

function handleInitialPageRequest(socket){
    socket.write("HTTP/1.1 200 OK\r\n\r\n")
}

function handleEchoRequest(socket, url, headers){
    const content = url.split('/echo/')[1]
    const encodingHeader = getHeader(headers, "accept-encoding")
    let response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`

    if(encodingHeader && encodingHeader.split(':')[1].trim() === 'gzip'){
        response += '\r\nContent-Encoding: gzip\r\n'
    }
    socket.write(response)
}

function handleUserAgentRequest(socket, headers){
    const userAgent = getHeader(headers, "user-agent")
    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
}

function handleGetFileRequest(socket, url){
    const filePath = `.${url}`

    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath).toString()
        const response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`
        socket.write(response)
        return
    } 
    socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
}

function handlePostFileRequest(socket, url, request){
    const content = request.toString("utf-8").split("\r\n\r\n")[1]
    const filepath = `.${url}`

    fs.writeFile(filepath, content, (err) => {
        if (err) {
            socket.write("HTTP/1.1 500 INTERNAL SERVER ERROR\r\n\r\n")
            return
        }
        socket.write("HTTP/1.1 201 CREATED\r\n\r\n")
    })
}

const handleRequest = (socket, request) => {
    const [method, url] = request.toString().split(" ")
    const headers = request.toString().split("\r\n")

    if(url === '/'){
        handleInitialPageRequest(socket)
    }
    else if(url.includes("/echo/")){
        handleEchoRequest(socket, url, headers)
    }
    else if(url.toLowerCase() === '/user-agent'){
        handleUserAgentRequest(socket, headers)
    }
    else if(method === 'GET' && url.toLowerCase().startsWith("/files/")){
        handleGetFileRequest(socket, url)
    }
    else if(method === 'POST' && url.toLowerCase().startsWith('/files/')){
        handlePostFileRequest(socket, url, request)
    }
    else{
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
    }
    socket.end()
}

const server = net.createServer((socket) => {
    socket.on("data", (request) => {
        handleRequest(socket, request)
    })
})
server.listen(4221)