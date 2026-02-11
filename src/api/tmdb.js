const https = require("https");

module.exports = function handler(req, res) {
  const rawPath = req.url.replace(/^\/api\/tmdb/, "") || "/";
  const url = `https://api.themoviedb.org/3${rawPath}`;

  // Try both with and without VITE_ prefix
  const bearer = process.env.VITE_TMDB_BEARER || process.env.TMDB_BEARER;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (!bearer) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Missing TMDB bearer token" }));
    return;
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };

  const proxyReq = https.request(url, options, (proxyRes) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = proxyRes.statusCode;
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("TMDB proxy error:", err.message);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  });

  proxyReq.end();
};
