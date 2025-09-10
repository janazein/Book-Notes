import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let books = [];

// Endpoint to fetch book cover by ISBN
app.get('/api/book/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    try {
        // Fetching the image from the Open Library API
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', 'image/jpeg'); // Set the content type for the response
        res.send(response.data); // Send the image data
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error fetching the image'); // Sending an error response
    }
});

// Route to display books
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM book ORDER BY id ASC");
    const books = result.rows;

    // Render the index.ejs file and pass the book data
    res.render("index.ejs", { books: result.rows });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

// Route to render the form for adding a new book
app.get("/add", (req, res) => {
    res.render("add.ejs");
});

// Route to handle form submission for adding a new book
app.post("/add", async (req, res) => {
    // Create a book object from the form data
    const book = {
        title: req.body.newTitle,
        author: req.body.newAuthor,
        isbn: req.body.newisbn,
        review: req.body.newBookReview,
        rating: req.body.newBookRating,
        dateRead: req.body.newDateRead
    };

    try {
        // Insert the new book into the database
        await db.query(
            "INSERT INTO book (title, author, isbn, review, rating, read_date) VALUES ($1, $2, $3, $4, $5, $6)", 
            [book.title, book.author, book.isbn, book.review, book.rating, book.dateRead]
        );
        // Redirect to the homepage after successful insertion
        res.redirect("/");
    } catch (err) {
        // Log error and send an error response
        console.error("Error inserting book:", err);
        res.status(500).send("An error occurred while adding the book.");
    }
});

// Route to get the review page for a specific book based on its ID
app.get("/review/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    // Get the main book
    const result = await db.query("SELECT * FROM book WHERE id = $1", [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = result.rows[0];

    // Get other books for the sidebar
    const others = await db.query("SELECT * FROM book WHERE id != $1 ORDER BY id DESC LIMIT 4", [bookId]);
    const otherBooks = others.rows;

    // Render the view with both
    res.render("review.ejs", { book: book, otherBooks: otherBooks });
  } catch (err) {
    console.error("Error fetching book review:", err);
    res.status(500).send("Could not load the review.");
  }
});


// Route to render the edit form for a specific book based on its ID
app.get("/edit/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const result = await db.query("SELECT * FROM book WHERE id = $1", [bookId]);

        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        }

        const book = result.rows[0];
        res.render("edit.ejs", { book: book }); // Pass book details to the template
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).send("Could not load the edit form.");
    }
});

// Route to handle the submission of the edited book details
app.post("/edit/:id", async (req, res) => {
    const bookId = req.params.id;

    // Constructing updated book object from request body
    const updatedBook = {
        title: req.body.newTitle,
        author: req.body.newAuthor,
        isbn: req.body.newIsbn, 
        review: req.body.newBookReview,
        rating: req.body.newBookRating,
        read_date: req.body.newDateRead,
    };

   try {
    console.log("Updating book with ID:", bookId);
    console.log("Updated Book Data:", updatedBook);

   await db.query(
    "UPDATE book SET title = $1, author = $2, isbn = $3, review = $4, rating = $5, read_date = $6 WHERE id = $7",
    [updatedBook.title, updatedBook.author, updatedBook.isbn, updatedBook.review, updatedBook.rating, updatedBook.read_date, bookId]
);

    res.redirect("/");
} catch (err) {
    console.error("Error updating book:", err.message);
    res.status(500).send("Could not update the book.");
}
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteBookId;
  try {
    await db.query("DELETE FROM book WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});