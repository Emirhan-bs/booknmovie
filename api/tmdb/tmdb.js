const https = require("https");
console.log("ENV TMDB_BEARER:", process.env.TMDB_BEARER);
console.log("ENV VITE_TMDB_BEARER:", process.env.VITE_TMDB_BEARER);

module.exports = function handler(req, res) {
  console.log("REQ URL:", req.url);
  console.log("REQ QUERY:", req.query);

  const path = req.query?.path
    ? "/" + req.query.path.join("/")
    : req.url.replace(/^\/api\/tmdb/, "");

  const url = `https://api.themoviedb.org/3${path}`;

  const bearer = process.env.TMDB_BEARER;

  console.log("Bearer exists?", !!bearer);
  console.log("Proxying to:", url);

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
