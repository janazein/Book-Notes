# Book-Notes
A mini book notes web app to save what you read, add ratings &amp; notes and fetch covers from Open Library.

# Overview

This project is inspired by Derek Sivers’ book notes site
It helps you track books you’ve read, take notes, assign ratings and sort them in a clean, user friendly way.

# Features

Add, update, and delete books from your collection

Save notes and ratings

Fetch and display covers from the Open Library API

Sort by rating, recency, or title

Clean interface with EJS templates

# Tech Stack

Node.js + Express.js

PostgreSQL + pg

EJS Templating

Axios (for API requests)

HTML, CSS, JavaScript

# Screenshots
1. home page
<img width="1890" height="865" alt="homepage" src="https://github.com/user-attachments/assets/98678ede-f18c-4722-83f8-f22ce0cfd9e2" />

2.library
<img width="1884" height="816" alt="library" src="https://github.com/user-attachments/assets/20405137-0b00-45ca-814e-bc4c720da08a" />

3. books review
<img width="1897" height="800" alt="bookreview" src="https://github.com/user-attachments/assets/0d7169a0-a86c-42d1-8daa-575cab728409" />


## 1. Clone the Repo
git clone https://github.com/janazein/Book-Notes.git
cd Book-Notes

## 2. Install Dependencies
npm install

## 3. Setup Database
### a. Create a PostgreSQL database (e.g. booknotes)
### b. Run schema:
psql -d booknotes -f db/schema.sql
### c. Create .env file with:
PG_USER=yourusername
PG_PASSWORD=yourpassword
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=booknotes

## 4. Start Server
nodemon app.js
Visit: http://localhost:3000
