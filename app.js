const net = require("net");

const server = net.createServer((socket) => {
    socket.on("data", (request) => {

        const url = request.toString().split(" ")[1]
        const headers = request.toString().split('\r\n')

        if(url === '/'){
            socket.write("HTTP/1.1 200 OK\r\n\r\n")
        }
        else if(url.includes("/echo/")){
            const content = url.split('/echo/')[1];
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
        }
        else if(url.toLowerCase() === '/user-agent'){
            const userAgent = headers.find(header => header.toLowerCase().startsWith('user-agent'))
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
        }
        else{
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        socket.end();
    });
});

server.listen(4221);