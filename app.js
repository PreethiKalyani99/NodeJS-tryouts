const net = require("net");
const fs = require("fs")

const server = net.createServer((socket) => {
    socket.on("data", (request) => {

        const req = request.toString().split(" ")
        const url = req[1]
        const headers = request.toString().split('\r\n')
        const method = req[0]

        console.log(request.toString().split(" "), "requestt")
        console.log(request.toString().split('\r\n'), "hearders")
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
        else if (method === 'GET' && url.toLowerCase().startsWith('/files/')) {
            const filePath = `.${url}.js`
            if (fs.existsSync(`${filePath}`)) {
                const content = fs.readFileSync(`${filePath}`).toString()
                const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`
                socket.write(res)
            } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            }
        } 
        else if(method === 'POST' && url.toLowerCase().startsWith('/files/')){
            const content = request.toString("utf-8").split("\r\n\r\n")[1]

            fs.writeFile(`.${url}`, content, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    socket.write("HTTP/1.1 500 INTERNAL SERVER ERROR\r\n\r\n")
                    return
                } else {
                    socket.write("HTTP/1.1 201 CREATED\r\n\r\n")
                }
            })
        }
        else{
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
        }
        socket.end()
    });
});

server.listen(4221);