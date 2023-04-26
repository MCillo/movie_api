
//// Creates a variable called http then assigns to it an instance of the HTTP module. This imports the HTTP module allowing me to use the createServer() function
const http = require('http'),
    // Creates a constant variable called url then assigns it to an instance of the URL module, this imports the URL module into the app
    url = require('url'),

    // Creates a variable called fs then assigns it to an instance of the FS module, this imports the FS module into the app
    fs = require('fs');

// function of the HTTP module, request and response are 2 arguments passed to the function
http.createServer((request, response) => {
    let address = request.url,  // creates variable - address and assigns it to the 
        query = url.parse(address, true),
        filePath = '';

    fs.appendFile('log.txt', 'URL: ' + address + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.txt');
        }
    });

    // if/else - if the the request URL contains the word documentation - return the documentation.html file, else return the index.html file
    if (query.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
        // Adds a header to the response that will be returned, along with the HTTP status code for OK
        response.writeHead(200, { 'Content-Type': 'text/html' });

        response.write(data);
        response.end();
    });
}).listen(8080); // listens for a response of port 8080

console.log('My first Node test server is running on Port 8080');