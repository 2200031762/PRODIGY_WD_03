const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Set content type based on file extension
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.mp3': 'audio/mpeg', // Adjust this MIME type if needed
    };

    // Parse requested URL and get file extension
    let filePath = '.' + req.url;
    const extname = path.extname(filePath);
    const contentTypeHeader = contentType[extname] || 'application/octet-stream';

    // Check if the requested file exists
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found (404)
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                // Server error (500)
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // File found, serve it with appropriate content type
            res.writeHead(200, { 'Content-Type': contentTypeHeader });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000; // Use the provided PORT or default to 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
