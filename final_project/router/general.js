const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const isbnNumber = require("./booksdb.js").isbn;
let fs = require('fs');

// Registering a new user
public_users.post("/register", (req,res) => {
    
    // Username and Password - required by body
    const username = req.body.username;
    const password = req.body.password;

    // Is either field empty?
    if (username && password)
    {
        // If the username is valid
        if (isValid(username))
        {
            // Add the user to the users array
            users.push({"username": username, "password": password})
            {
                // Send message of success
                res.status(200).json({message: "User successfully added. Login now permitted."});
            }
        }
        // Else if it is not
        else {
            // Return message of failure
            res.status(404).json({message: "This username already exists."});
        }
    }

    // If either field is left blank
    return res.status(404).json({message: "Unable to register user. Neither field can be left blank."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    // Return list of available books
    res.send(JSON.stringify({books}, null, 4));
});

// Promise callback for getting all books
let allBooksPromise = new Promise ((resolve, reject) => {
    
    // Set timeout
    setTimeout(() => {
        resolve(JSON.stringify({books}, null, 4));
    }, 1000)
});

// Notice given in advance
console.log("All books will be listed.");

// Display all books with success message
allBooksPromise.then((entireBookList) =>{

    console.log("From callback: " + entireBookList)
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    // ISBN Number
    const isbn = req.params.isbn;

    // Show list of books and their respective details
    res.send(books[isbn]);
 });

 // Retrieving the book's details via ISBN - Async
 async function retrieveViaISBN()
 {
    // ISBN Parameter
    let isbnInput = 1;

    // If statement
    if (isbnInput >= 1 && isbnInput <= 10)
    {
        // Return book's details
        return(books[isbnInput]);
    }

    else{
        // Post error message
        throw new Error("ISBN is invalid.");
    }
 }

 // Execution of the method provided above
 async function carryOutRetrievalViaISBN() {
    try {
      // Await the async function call to get the result
      const result = await retrieveViaISBN();
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
  }

  carryOutRetrievalViaISBN();

 // Retrieving the book's details via ISBN - Async
 async function retrieveViaAuthor()
 {
    // Author Parameter
    let authorInput = "Jane Austen";

    // Loop through book array
    for (let key in books)
    {
        // If the author defined in the URL matches that of one in the list
        if (books[key].author === authorInput)
        {
            // Retrieve details
            return (books[key]);
        }

        else {
            throw new Error ("Could not find a book with the author specified.");
        }
    }
 }

 // Execution of the method provided above
 async function carryOutRetrievalViaAuthor() {
    try {
      // Await the async function call to get the result
      const result = await retrieveViaAuthor();
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
  }

  carryOutRetrievalViaAuthor();

// Retrieving the book's details via title - Async
 async function retrieveViaTitle()
 {
    // Author Parameter
    let titleInput = "The Book Of Job";

    // Loop through book array
    for (let key in books)
    {
        // If the author defined in the URL matches that of one in the list
        if (books[key].title === titleInput)
        {
            // Retrieve details
            return (books[key]);
        }

        else {
            throw new Error ("Could not find a book with the title specified.");
        }
    }
 }

  // Execution of the method provided above
 async function carryOutRetrievalViaTitle() {
    try {
      // Await the async function call to get the result
      const result = await retrieveViaTitle();
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
  }

  carryOutRetrievalViaTitle();

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
