// Do your work here...
const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  books = JSON.parse(serializedData) || [];
};

const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  refreshDataFromBooks();
};

const generateId = () => +new Date();

const makeBook = (id, title, author, year, isComplete) => ({
  id,
  title,
  author,
  year,
  isComplete
});

const renderBook = (book) => {
  const bookItem = document.createElement('div');
  bookItem.classList.add('book-item');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.innerText = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.innerText = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement('div');
  
  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', function() {
    const bookId = parseInt(bookItem.getAttribute('data-bookid'));
    toggleBookStatus(bookId);
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.addEventListener('click', function() {
    const bookId = parseInt(bookItem.getAttribute('data-bookid'));
      deleteBook(bookId);
  });

  buttonContainer.append(toggleButton, deleteButton);
  bookItem.append(title, author, year, buttonContainer);

  return bookItem;
};

const refreshDataFromBooks = () => {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = renderBook(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
};

const addBook = (e) => {
  e.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const id = generateId();
  const book = makeBook(id, title, author, year, isComplete);
  books.push(book);
  
  document.getElementById('bookForm').reset();
  saveData();
};

const toggleBookStatus = (bookId) => {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveData();
  }
};

const deleteBook = (bookId) => {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveData();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', addBook);

  const isCompleteCheckbox = document.getElementById('bookFormIsComplete');
  const submitButton = document.getElementById('bookFormSubmit').querySelector('span');
  
  isCompleteCheckbox.addEventListener('change', function() {
    submitButton.innerText = this.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
  });

  loadDataFromStorage();
  refreshDataFromBooks();
});