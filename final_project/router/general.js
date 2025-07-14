const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const isbnNumber = require("./booksdb.js").isbn;

// Registering a new user
public_users.post("/register", (req, res) => {

    // Username and Password - required by body
    const username = req.body.username;
    const password = req.body.password;

    // Is either field empty?
    if (username && password) {
        // If the username is valid
        if (isValid(username)) {
            // Add the user to the users array
            users.push({ "username": username, "password": password })
            {
                // Send message of success
                res.status(200).json({ message: "User successfully added. Login now permitted." });
            }
        }
        // Else if it is not
        else {
            // Return message of failure
            res.status(404).json({ message: "This username already exists." });
        }
    }

    // If either field is left blank
    return res.status(404).json({ message: "Unable to register user. Neither field can be left blank." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

    // Return list of available books
    res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    // ISBN Number
    const isbn = req.params.isbn;

    // Show list of books and their respective details
    res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    // Author parameter
    const authorParameter = req.params.author.toLowerCase();

    // Array of matching books
    const matchingBooks = [];

    // Loop through book array
    for (let key in books) {
        // If the author defined in the URL matches that of one in the list
        if (books[key].author.toLowerCase() === authorParameter) {
            // Retrieve details
            matchingBooks.push({ isbnNumber, key, ...books[key] });
        }
    }

    // Error handling and notification of success

    // If the array is greater than zero
    if (matchingBooks.length > 0) {
        // Return matching book
        return res.status(200).json(matchingBooks);
    }

    // Else if it is not
    else {
        // Return error message
        return res.status(404).json({ message: `No books found by author '${req.params.author}' .` });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    // Title parameter
    const titleParam = req.params.title.toLowerCase();

    // Array of titles
    const bookTitles = [];

    // Loop through the array of books
    for (let key in books) {
        // If the title matches that of any given book
        if (books[key].title.toLowerCase() === titleParam) {
            // Retrieve all details
            bookTitles.push({ isbnNumber, key, ...books[key] });
        }
    }

    // Error handling and notification of success
    if (bookTitles.length > 0) {
        // Return book's details
        return res.status(200).json(bookTitles);
    }

    // Else if no such book exists in the array
    else {
        // Return error message
        return res.status(404).json({ message: `Could not find any books with the title '${req.params.title}' . ` });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

    // ISBN Number
    const isbnParam = req.params.isbn;

    res.send("Reviews on this book: " + JSON.stringify(books[isbnParam].reviews));

});

// ** PROMISES **

// Promise callback for getting all books
let allBooksPromise = new Promise((resolve, reject) => {

    // Set timeout
    setTimeout(() => {
        resolve(JSON.stringify({ books }, null, 4));
    }, 1000)
});

// Notice given in advance
console.log("All books will be listed.");

// Display all books with success message
allBooksPromise.then((entireBookList) => {

    console.log("List of Books: " + entireBookList)
})

// Promise callback for getting book details via ISBN
let findByISBN = new Promise((resolve, reject) => {

    // Set timeout
    setTimeout(() => {

        // ISBN Number (pre-entered)
        const ISBNEntered = 1;

        // Does the ISBN exist within the array of books?
        for (let key in books) {
            // If se
            if (books[key].isbn === ISBNEntered) {
                // Return resolve message
                resolve("Find by ISBN number promise resolved.");

                // Return resolve message
                console.log(books[ISBNEntered]);
            }
        }
    }, 3000)
});

// Return message
findByISBN.then((successMessage) => {
    console.log(successMessage);
})

// Finding a book by author
let findByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {

        // Author of book (pre-entered)
        const authorEntered = "Jane Austen";

        // Does the author exist in the list of books?
        for (let key in books) {

            // If so
            if (books[key].author === authorEntered) {

                // Return resolve message
                resolve("Find by author promise resolved.");

                // Print book details
                console.log(books[key]);
            }
        }
    }, 4000)
})

// Return message
findByAuthor.then((successMessage) => {
    console.log(successMessage)
})

// Finding a book by title
let findByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {

        // Title of book (pre-entered)
        const titleEntered = "The Divine Comedy";

        // Does such a title exist in the list of books?
        for (let key in books) {

            // If so
            if (books[key].title === titleEntered) {

                // Return resolve message
                resolve("Find by title promise resolved.");

                // Return book details
                console.log(books[key]);
            }
        }
    }, 5000)
})

// Print success message
findByTitle.then((successMessage) => {
    console.log(successMessage)
})

module.exports.general = public_users;
