const express = require('express');
const http = require('http');

const host = 'localhost';
const port = 3000;

const app = express();

app.use((req,res,next)=>{
   console.log(req.headers);
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/html');
   res.end('<html><body>This is a Expresss Server</body></html>');

});

const server = http.createServer(app);

server.listen(port, host, ()=>{
    console.log(`Server running at http://${host}:${port}`);
});