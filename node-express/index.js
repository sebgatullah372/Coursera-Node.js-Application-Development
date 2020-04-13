const express = require('express');
const http = require('http');
const morgan = require('morgan');

const host = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname+'/public'));

app.use((req,res,next)=>{
   
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/html');
   res.end('<html><body>This is a Expresss Server</body></html>');

});

const server = http.createServer(app);

server.listen(port, host, ()=>{
    console.log(`Server running at http://${host}:${port}`);
});