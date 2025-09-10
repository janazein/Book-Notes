CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  isbn VARCHAR(13),
  cover_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  review TEXT,
  read_date DATE
);

INSERT INTO book (title, author, isbn , cover_url, rating, review, read_date ) VALUES ('The Stranger', 'Albert Camus', '9780679720201', 'https://ia600100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_72.zip&file=0012727338-L.jpg' , 10 , 'Albert Camus’s The Stranger (L’Étranger, 1942) is a cornerstone of existential and absurdist literature. The novel follows Meursault, a detached and emotionally indifferent French Algerian man whose passive attitude toward life and death leads to a shocking crime and a philosophical confrontation with meaning, morality and justice.
What makes this book striking is Meursault’s emotional detachment, he reacts to his mother’s death, a relationship and even murder with the same distant apathy. Camus uses this character to explore the absurd: the idea that life has no inherent meaning and that searching for one can lead to conflict with society’s expectations.', '2023-12-20') ;
