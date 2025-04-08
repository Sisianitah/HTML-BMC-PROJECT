document.addEventListener("DOMContentLoaded", () => {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    
    const bookList = document.getElementById("bookList");
    const addBookBtn = document.getElementById("addBookBtn");
    const bookModal = document.getElementById("bookModal");
    const closeBtn = document.querySelector(".close");
    const bookForm = document.getElementById("bookForm");
    const searchInput = document.getElementById("searchInput");
    const tabs = document.querySelectorAll(".tab");
    const status = document.getElementById('status')

    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
        displayBooks();
    }

    function displayBooks(category = "all" , searchTerm = "") {
        bookList.innerHTML = "";

        let filteredBooks = books.filter(book => {
            const matchesCategory =    
                 category === "all" || 
                 (category === "favorites" && book.favorite) || 
                 (category === "unread" && book.status === "Unread") || 
                 (category === "read" && book.status === "Read");
            
           const matchesSearch = 
               book.title.toLowerCase().includes(searchTerm) ||
               book.author.toLowerCase().includes(searchTerm) ||
               book.genre.toLowerCase().includes(searchTerm);

           return matchesCategory && matchesSearch;
    });

        filteredBooks.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");
            bookCard.innerHTML = `
                <img src="${book.image}" alt="Book Cover">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <button class="favorite" data-id="${book.id}">${book.favorite ? "★" : "☆"}</button>
                <button class="edit" data-id="${book.id}">🖊️ Edit</button> 
                <button class="delete" data-id="${book.id}">🗑️ Delete</button>
            `;

            bookList.appendChild(bookCard);
        });
    }

    addBookBtn.onclick = () => bookModal.style.display = "flex";
    closeBtn.onclick = () => bookModal.style.display = "none";

    bookForm.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById("bookId").value || Date.now().toString();
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const genre = document.getElementById("genre").value;
        const status = document.getElementById("status").value;
        const imageFile = document.getElementById("bookImage").files[0];

        const reader = new FileReader();
        reader.onload = () => {
            const newBook = { id, title, author, genre, status, favorite: false, image: reader.result };
            books = books.filter(b => b.id !== id);
            books.push(newBook);
            saveBooks();
            bookModal.style.display = "none";
        };
        if (imageFile) reader.readAsDataURL(imageFile);
    };

    bookList.onclick = (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("favorite")) {
            books = books.map(book => book.id === id ? { ...book, favorite: !book.favorite } : book);
        } else if (e.target.classList.contains("edit")) {
            const book = books.find(b => b.id === id);
            document.getElementById("bookId").value = book.id;
            document.getElementById("title").value = book.title;
            document.getElementById("author").value = book.author;
            document.getElementById("genre").value = book.genre;
            document.getElementById("status").value = book.status;
            bookModal.style.display = "flex";
        } else if (e.target.classList.contains("delete")) {
            books = books.filter(b => b.id !== id);
        }
        saveBooks();
    };

    searchInput.oninput = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector(".tab.active").dataset.category;
        displayBooks(activeCategory, searchTerm);
    };

    // searchInput.oninput = () => {
    //     const searchTerm = searchInput.value.toLowerCase();
    //     books.forEach(book => {
    //         document.querySelector(`[data-id="${book.id}"]`).parentElement.style.display = 
    //             book.title.toLowerCase().includes(searchTerm) ? "block" : "none";
    //     });
    // };

    tabs.forEach(tab => tab.onclick = () => {
        document.querySelector(".tab.active").classList.remove("active");
        tab.classList.add("active");
        displayBooks(tab.dataset.category);
    });

    displayBooks();
});