const http = require('http');
const nStatic = require('node-static');
const fileServer = new nStatic.Server('./public');
const host = 'localhost';
const port = 3000;
const apiKey = '8f6c90b85a72bcbe81565f1d59f78279';
let location = '';
let locationData;
let loading = false

const make_request = () => {
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
  loading = true
  http.get(apiUrl, response => {
    response.setEncoding("utf8");
    let body = "";
    response.on("data", data => {
      body += data;
    });
    response.on("end", () => {
      loading = false
      locationData = body;
      console.log(locationData);
    });
    response.on('error', (error) => {
      reject(error);
    });
  })
  .on('error', e => {
    loading = false
    console.log(e)
  })
}

http.createServer((req, res) => {
  // Getting static assets
  req.addListener('end', function () {
    fileServer.serve(req, res);
  }).resume();

  // Match url for getting location
  if (req.method === 'POST' && req.url === '/post_location') {
    let body = '';
    req.on('data', data => {
      body += data;
    });
    req.on('end', () => {
      location = JSON.parse(body).location;
      console.log(location);
      // Trying to make the getting of the location data synchronous here, but it didnt work
      make_request()
      res.end(JSON.stringify({message: "location recieved"}));
    });
  } else if (req.method === 'GET' && req.url === '/get_location_data') { // Match url for sending location data
    req.on('end', () => {
      
      res.writeHead(200, { 'Content-Type': 'application/json' });

      if(!locationData) {
        if(!loading) make_request()
        return res.end(JSON.stringify({ 'message': 'waiting'}))
      }
      
      res.end(locationData);
    })
  }
}).listen(port, host, () => {
  console.log(`Server is now running on http://${host}:${port}`);
});


