const https = require("https");

module.exports = function handler(req, res) {
  let tmdbPath = req.url || "/";

  tmdbPath = tmdbPath.replace(/^\/api\/tmdb/, "");

  if (!tmdbPath || tmdbPath === "") tmdbPath = "/";

  const url = `https://api.themoviedb.org/3${tmdbPath}`;
  const bearer = process.env.TMDB_BEARER || process.env.VITE_TMDB_BEARER;

  console.log("Proxying to:", url);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (!bearer) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Missing TMDB_BEARER env variable" }));
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
