const net = require("net");

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString();
        // console.log(request, "request")
        if (request.includes('/echo/abc ')) {
          const httpResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 6\r\n\r\nabcdja';
          socket.write(httpResponse);
        } 
        else {
            const httpResponse = 'HTTP/1.1 404 Not Found\r\n\r\n';
            socket.write(httpResponse);
        }
        socket.end();
  });
});

server.listen(4221);
console.log("Listening...")