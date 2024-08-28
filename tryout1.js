const http = require("http")

function homePage(){
    return `<html>
                <head>
                    <title>Home Page</title>
                </head>
                <body>You are in Home Page</body>
            </html>`
}

function productPage(){
    return `<html>
                <head>
                    <title>Product Page</title>
                </head>
                <body>You are in Product Page</body>
            </html>`
}

function responseErrorHandler(err){
    if(err){
        console.error(err)
        console.log("Error in sending response")
        return
    }
}
const server = http.createServer((req, res) => {
    if(req.method === 'GET' && req.url === '/home'){
        res.write(homePage(), responseErrorHandler)
    }
    else if(req.method === 'GET' && req.url === '/product'){
        res.write(productPage(), responseErrorHandler)
    }
    else{
        res.statusCode = 400
        res.statusMessage = "Bad request"
    }
    res.end()
})

server.listen(5000)