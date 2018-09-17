const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/CP",
      "/static"
    ],
    "target": "http://localhost:8000",
    "secure": false
  }
];

module.exports = PROXY_CONFIG;
