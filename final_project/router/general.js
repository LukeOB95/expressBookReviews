const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const isbnNumber = require("./booksdb.js").isbn;

// Registering a new user
public_users.post("/register", (req,res) => {
    
    // Username and password - required by the body
    const {username, password} = req.body;

    // What if the user already exists?
    if (username.isValid === false)
    {
        // Return an error message
        return res.status(400).json({message: `User already exists.`});
    }

    // What if the username is not provided?
    else if (username === null)
    {
        // Return an error message
        return res.status(400).json({message: `Username field cannot be left empty.`});
    }

    // What if the password is not provided?
    else if (password === null)
    {
        // Return an error message
        return res.status(400).json({message: `Password field cannot be left empty.`});
    }

    // But if they don't and the password field is not empty
    else if (username.isValid === true | password != null) {
        
        users.push({
        "username": req.query.username,
        "password": req.query.password
    });
        // Return message of success
        return res.status(200).json({message: username + " successfully added!"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    // Return list of available books
    res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    // ISBN Number
    const isbn = req.params.isbn;

    // Show list of books and their respective details
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    // Author parameter
    const authorParameter = req.params.author.toLowerCase();
    
    // Array of matching books
    const matchingBooks = [];

    // Loop through book array
    for (let key in books)
    {
        // If the author defined in the URL matches that of one in the list
        if (books[key].author.toLowerCase() === authorParameter)
        {
            // Retrieve details
            matchingBooks.push({isbnNumber, key, ...books[key]});
        }
    }

    // Error handling and notification of success
    
    // If the array is greater than zero
    if (matchingBooks.length > 0)
    {
        // Return matching book
        return res.status(200).json(matchingBooks);
    }

    // Else if it is not
    else{
        // Return error message
        return res.status(404).json({message: `No books found by author '${req.params.author}' .`});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    // Title parameter
    const titleParam = req.params.title.toLowerCase();

    // Array of titles
    const bookTitles = [];

    // Loop through the array of books
    for (let key in books)
    {
        // If the title matches that of any given book
        if (books[key].title.toLowerCase() === titleParam)
        {
            // Retrieve all details
            bookTitles.push({isbnNumber, key, ...books[key]});
        }
    }

    // Error handling and notification of success
    if (bookTitles.length > 0)
    {
        // Return book's details
        return res.status(200).json(bookTitles);
    }

    // Else if no such book exists in the array
    else {
        // Return error message
        return res.status(404).json({message: `Could not find any books with the title '${req.params.title}' . `});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    // ISBN Number
    const isbnParam = req.params.isbn;

    res.send("Reviews on this book: " + JSON.stringify(books[isbnParam].reviews));

});

module.exports.general = public_users;
