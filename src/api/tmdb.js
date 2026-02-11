export default async function handler(req, res) {
  const rawPath = req.url.replace(/^\/api\/tmdb/, "") || "/";
  const url = `https://api.themoviedb.org/3${rawPath}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.VITE_TMDB_BEARER}`,
      },
    });
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
