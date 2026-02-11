const https = require("https");

module.exports = function handler(req, res) {
  const path = req.query.path ? "/" + req.query.path.join("/") : "/";

  const url = `https://api.themoviedb.org/3${path}`;
  const bearer = process.env.TMDB_BEARER || process.env.VITE_TMDB_BEARER;

  console.log("Proxying to:", url);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!bearer) {
    res.status(500).json({ error: "Missing TMDB_BEARER env variable" });
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
    res.status(proxyRes.statusCode);
    res.setHeader("Content-Type", "application/json");
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("TMDB proxy error:", err.message);
    res.status(500).json({ error: err.message });
  });

  proxyReq.end();
};
