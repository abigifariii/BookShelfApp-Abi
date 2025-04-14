// Book Class
class Book {
    constructor(id, title, author, year, isComplete) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.year = year;
      this.isComplete = isComplete;
    }
  }
  
  // Bookshelf App Class
  class BookshelfApp {
    constructor() {
      this.books = [];
      this.loadBooks();
  
      // Form elements
      this.bookForm = document.getElementById('bookForm');
      this.searchForm = document.getElementById('searchBook');
      this.searchInput = document.getElementById('searchBookTitle');
  
      // Book lists
      this.incompleteBookList = document.getElementById('incompleteBookList');
      this.completeBookList = document.getElementById('completeBookList');
  
      // Initialize the app
      this.renderBooks();
      this.setupEventListeners();
    }
  
    // Load books from localStorage
    loadBooks() {
      const storedBooks = localStorage.getItem('books');
      if (storedBooks) {
        this.books = JSON.parse(storedBooks);
      }
    }
  
    // Save books to localStorage
    saveBooks() {
      localStorage.setItem('books', JSON.stringify(this.books));
    }
  
    // Generate a unique ID
    generateId() {
      return Date.now();
    }
  
    // Add a new book
    addBook(title, author, year, isComplete) {
      const id = this.generateId();
      const newBook = new Book(id, title, author, year, isComplete);
      this.books.push(newBook);
      this.saveBooks();
      this.renderBooks();
    }
  
    // Move book between shelves
    moveBook(bookId, isComplete) {
      const bookIndex = this.books.findIndex(book => book.id == bookId);
      if (bookIndex !== -1) {
        this.books[bookIndex].isComplete = isComplete;
        this.saveBooks();
        this.renderBooks();
      }
    }
  
    // Delete a book
    deleteBook(bookId) {
      this.books = this.books.filter(book => book.id != bookId);
      this.saveBooks();
      this.renderBooks();
    }
  
    // Search books
    searchBooks(query) {
      return this.books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Render books to the DOM
    renderBooks(filteredBooks = null) {
      // Clear existing books
      this.incompleteBookList.innerHTML = '';
      this.completeBookList.innerHTML = '';
  
      // Use filtered books if provided, otherwise use all books
      const booksToRender = filteredBooks || this.books;
  
      booksToRender.forEach(book => {
        const bookElement = this.createBookElement(book);
        if (book.isComplete) {
          this.completeBookList.appendChild(bookElement);
        } else {
          this.incompleteBookList.appendChild(bookElement);
        }
      });
    }
  
    // Create book element
    createBookElement(book) {
      const bookElement = document.createElement('div');
      bookElement.dataset.bookid = book.id;
      bookElement.dataset.testid = 'bookItem';
      bookElement.className = 'book-card' + (book.isComplete ? ' finished' : '');
  
      bookElement.innerHTML = `
        <div class="book-cover">
          <i class="fas fa-book"></i>
          ${book.isComplete ? '<div class="finished-badge"><i class="fas fa-check"></i></div>' : ''}
        </div>
        <div class="book-info">
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor"><i class="fas fa-user"></i> ${book.author}</p>
          <p data-testid="bookItemYear"><i class="fas fa-calendar"></i> ${book.year}</p>
        </div>
        <div class="book-actions">
          <button data-testid="bookItemIsCompleteButton" class="${book.isComplete ? 'btn-success' : 'btn-primary'}">
            <i class="fas ${book.isComplete ? 'fa-undo' : 'fa-check'}"></i> ${book.isComplete ? 'Mark Unread' : 'Mark as Read'}
          </button>
          <button data-testid="bookItemDeleteButton" class="btn-danger">
            <i class="fas fa-trash"></i> Delete
          </button>
          <button data-testid="bookItemEditButton" class="btn-warning">
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
      `;
  
      return bookElement;
    }
  
    // Setup event listeners
    setupEventListeners() {
      // Add book form
      this.bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = parseInt(document.getElementById('bookFormYear').value);
        const isComplete = document.getElementById('bookFormIsComplete').checked;
        
        this.addBook(title, author, year, isComplete);
        this.bookForm.reset();
      });
  
      // Search form
      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = this.searchInput.value.trim();
        if (query) {
          const filteredBooks = this.searchBooks(query);
          this.renderBooks(filteredBooks);
        } else {
          this.renderBooks();
        }
      });
  
      // Clear search when input is empty
      this.searchInput.addEventListener('input', () => {
        if (this.searchInput.value.trim() === '') {
          this.renderBooks();
        }
      });
  
      // Event delegation for book actions
      document.addEventListener('click', (e) => {
        const bookItem = e.target.closest('[data-bookid]');
        if (!bookItem) return;
  
        const bookId = bookItem.dataset.bookid;
  
        // Mark as read/unread
        if (e.target.closest('[data-testid="bookItemIsCompleteButton"]')) {
          const book = this.books.find(b => b.id == bookId);
          if (book) {
            this.moveBook(bookId, !book.isComplete);
          }
        }
  
        // Delete book
        if (e.target.closest('[data-testid="bookItemDeleteButton"]')) {
          if (confirm('Are you sure you want to delete this book?')) {
            this.deleteBook(bookId);
          }
        }
  
        // Edit book (placeholder for future implementation)
        if (e.target.closest('[data-testid="bookItemEditButton"]')) {
          alert('Edit functionality will be implemented later');
        }
      });
    }
  }
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new BookshelfApp();
  });