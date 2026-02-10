const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org/b";

// ── Cover image helpers ───────────────────────────────────────────────────────
// Use cover_i (OL cover ID) — this is the most reliable source
export const getBookCoverUrl = (isbn, size = "M") =>
  isbn ? `${COVERS_URL}/isbn/${isbn}-${size}.jpg` : null;

export const getBookCoverByOLID = (coverId, size = "M") =>
  coverId ? `${COVERS_URL}/id/${coverId}-${size}.jpg` : null;

// Build the best available cover URL from a book record
export const resolveCoverUrl = (book, size = "M") => {
  if (book.cover_i) return `${COVERS_URL}/id/${book.cover_i}-${size}.jpg`;
  if (book.cover_edition_key)
    return `${COVERS_URL}/olid/${book.cover_edition_key}-${size}.jpg`;
  if (book.isbn?.[0]) return `${COVERS_URL}/isbn/${book.isbn[0]}-${size}.jpg`;
  return null;
};

// ── Language helpers ──────────────────────────────────────────────────────────
export const normalizeLanguage = (langs = []) => {
  if (!langs || langs.length === 0) return "Unknown";
  const code = langs[0];
  const map = {
    eng: "English",
    tur: "Türkçe",
    spa: "Spanish",
    fre: "French",
    ger: "German",
    jpn: "Japanese",
    kor: "Korean",
    ita: "Italian",
    por: "Portuguese",
    rus: "Russian",
    ara: "Arabic",
    chi: "Chinese",
  };
  return map[code] || code?.toUpperCase() || "Unknown";
};

// ── API calls ─────────────────────────────────────────────────────────────────
export const searchBooks = async (query, page = 1, limit = 20, lang = "") => {
  const offset = (page - 1) * limit;
  const langParam = lang ? `&language=${lang}` : "";
  const res = await fetch(
    `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}${langParam}&fields=key,title,author_name,first_publish_year,cover_i,cover_edition_key,isbn,subject,ratings_average,ratings_count,number_of_pages_median,language,edition_count`,
  );
  if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);
  return res.json();
};

export const searchBooksBySubject = async (subject, limit = 20) => {
  const res = await fetch(
    `${BASE_URL}/subjects/${encodeURIComponent(subject.toLowerCase().replace(/ /g, "_"))}.json?limit=${limit}`,
  );
  if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);
  return res.json();
};

// Search Turkish books specifically
export const searchTurkishBooks = async (query = "", limit = 20) => {
  const q = query || "roman";
  const res = await fetch(
    `${BASE_URL}/search.json?q=${encodeURIComponent(q)}&language=tur&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,cover_edition_key,isbn,subject,ratings_average,ratings_count,number_of_pages_median,language,edition_count`,
  );
  if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);
  return res.json();
};

export const getBookDetails = async (workId) => {
  const res = await fetch(`${BASE_URL}${workId}.json`);
  if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);
  return res.json();
};

export const getTrendingBooks = async (limit = 20) => {
  const subjects = [
    "fiction",
    "fantasy",
    "thriller",
    "romance",
    "science_fiction",
  ];
  const random = subjects[Math.floor(Math.random() * subjects.length)];
  return searchBooksBySubject(random, limit);
};

export const getBooksByGenre = async (genre, limit = 20) => {
  const genreMap = {
    Fantasy: "fantasy",
    "Sci-Fi": "science_fiction",
    Thriller: "thriller",
    Romance: "romance",
    Drama: "fiction",
    Horror: "horror",
    Mystery: "mystery",
    Action: "adventure",
    Comedy: "humor",
  };
  const subject = genreMap[genre] || genre.toLowerCase();
  return searchBooksBySubject(subject, limit);
};

// ── Normalizer ────────────────────────────────────────────────────────────────
export const normalizeBook = (book) => {
  const coverUrl = resolveCoverUrl(book, "M");
  const langCode = book.language?.[0];
  return {
    id: `book_${book.key?.replace("/works/", "") || Math.random()}`,
    olid: book.key,
    type: "book",
    title: book.title || "Unknown Title",
    author: book.author_name?.[0] || "Unknown Author",
    authors: book.author_name || [],
    year: book.first_publish_year || null,
    genre: detectGenre(book.subject),
    rating: book.ratings_average
      ? Math.min(5, parseFloat(book.ratings_average.toFixed(1)))
      : null,
    ratingsCount: book.ratings_count || 0,
    language: normalizeLanguage(book.language),
    langCode,
    coverId: book.cover_i || null,
    isbn: book.isbn?.[0] || null,
    coverUrl,
    summary: null,
    tags:
      book.subject
        ?.slice(0, 5)
        .map((s) => s.toLowerCase().replace(/ /g, "-")) || [],
    pages: book.number_of_pages_median || null,
    editions: book.edition_count || null,
  };
};

// Also normalize works from subject endpoint (slightly different shape)
export const normalizeWork = (work) => {
  const coverId = work.cover_id || work.cover_i || null;
  return {
    id: `book_${work.key?.replace("/works/", "") || Math.random()}`,
    olid: work.key,
    type: "book",
    title: work.title || "Unknown Title",
    author: work.authors?.[0]?.name || "Unknown Author",
    authors: work.authors?.map((a) => a.name) || [],
    year: work.first_publish_year || null,
    genre: detectGenre(work.subject),
    rating: work.rating
      ? Math.min(5, parseFloat(work.rating.toFixed(1)))
      : null,
    ratingsCount: 0,
    language: "Unknown",
    coverId,
    isbn: null,
    coverUrl: coverId ? `${COVERS_URL}/id/${coverId}-M.jpg` : null,
    summary: null,
    tags:
      work.subject
        ?.slice(0, 5)
        .map((s) => s.toLowerCase().replace(/ /g, "-")) || [],
    pages: null,
    editions: work.edition_count || null,
  };
};

const detectGenre = (subjects = []) => {
  if (!subjects?.length) return "Fiction";
  const s = subjects.join(" ").toLowerCase();
  if (s.includes("fantasy") || s.includes("magic") || s.includes("fantastik"))
    return "Fantasy";
  if (
    s.includes("science fiction") ||
    s.includes("sci-fi") ||
    s.includes("bilim kurgu")
  )
    return "Sci-Fi";
  if (s.includes("thriller") || s.includes("suspense") || s.includes("gerilim"))
    return "Thriller";
  if (s.includes("romance") || s.includes("love") || s.includes("aşk"))
    return "Romance";
  if (s.includes("horror") || s.includes("ghost") || s.includes("korku"))
    return "Horror";
  if (s.includes("mystery") || s.includes("detective") || s.includes("gizem"))
    return "Mystery";
  if (s.includes("adventure") || s.includes("action") || s.includes("macera"))
    return "Action";
  if (s.includes("humor") || s.includes("comedy") || s.includes("komedi"))
    return "Comedy";
  return "Drama";
};
