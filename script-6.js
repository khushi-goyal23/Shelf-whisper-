const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");
const bookGrid = document.getElementById("book-grid");
let books = [];

// Fetch books data from JSON
fetch('progress-6.json')
  .then(response => response.json())
  .then(data => {
    books = data;
    displayBooks(books); // Display books when the page loads
  })
  .catch(error => console.error('Error fetching the books data:', error));

// Function to display books on the webpage
function displayBooks(bookList) {
    bookGrid.innerHTML = ''; // Clear the existing books
    bookList.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
            <a href="${book.link}">
                <img src="${book.image}" alt="${book.title}">
                <p>${book.title}</p>
            </a>
        `;
        bookGrid.appendChild(bookDiv);
    });
}

// Function to search books
function searchBooks() {
    const filter = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(filter));
    
    // Display search result
    if (filteredBooks.length > 0 && filter) {
        searchResult.innerText = filteredBooks[0].title;
        searchResult.style.display = "block";
    } else {
        searchResult.style.display = "none";
    }
    
    // Display filtered books
    displayBooks(filteredBooks);
}

// Event listener for real-time search results as the user types
searchInput.addEventListener("input", searchBooks);
