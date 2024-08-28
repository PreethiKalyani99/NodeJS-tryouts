const events = require('events')

let eventEmitter = new events.EventEmitter()

eventEmitter.on('hi', () => {
    console.log("hello")
})

eventEmitter.on('hi', (name) => {
    console.log("My name is " + name)
})

eventEmitter.on('sleep', () => {
    console.log("Good night")
})

setTimeout(() => eventEmitter.emit('hi', 'Preethi'), 2000)
setTimeout(() => eventEmitter.emit('sleep'), 5000)