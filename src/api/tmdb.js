export default async function handler(req, res) {
  const { path, ...query } = req.query;
  const params = new URLSearchParams(query).toString();
  const url = `https://api.themoviedb.org/3/${path}${params ? "?" + params : ""}`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.VITE_TMDB_BEARER}`,
    },
  });

  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(response.status).json(data);
}
