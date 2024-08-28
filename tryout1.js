const http = require("http")
const URL = require("url")
const qs = require('querystring')

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
    const url = URL.parse(req.url)
    if(req.method === 'GET' && url.pathname === '/home'){
        res.write(homePage(), responseErrorHandler)
    }
    else if(req.method === 'GET' && url.pathname === '/product'){
        res.write(productPage(), responseErrorHandler)
    }
    else{
        res.statusCode = 400
        res.statusMessage = "Bad request"
    }
    console.log(qs.decode(url.query), "query string")
    res.end()
})

server.listen(5000)