const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const reviews = require("./booksdb.js").reviews;

let users = [];

const isValid = (username)=>{ //returns boolean
  
    // Filter the array of users to see if the given one exists
    let matchingUsers = users.filter((user) => {
        return user.username === username;
    });

    // Can a user with the same username be found?
    if (matchingUsers.length > 0)
    {
        // If so, the username is not valid
        return false;
    }

    // But if not
    else {
        return true;
    }
}

/* Do the username and password provided match those
    in the list of registered users? */
const authenticatedUser = (username,password)=>{

    /* Filter users array to see if there are any whose 
    credentials match those in the list */
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    // If a valid user can be found
    if (validUsers.length > 0)
    {
        // We authenticate them
        return true;
    }

    // But if not
    else {
        // We don't authenticate them
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    // Username and password - again, needed by the body
    const username = req.body.username;
    const password = req.body.password;

    // Is either field blank?
    if (!username || !password)
    {
        return res.status(404).json({message: "Login unsuccessful. One or both fields are blank."});
    }

    // Authenticate the user
    if (authenticatedUser(username, password))
    {
        // Generate JWT token
        let accessToken = jwt.sign({
            data: password
        }, 'access',{ expiresIn: 60 * 60});

        // Store both the username and token in session
        req.session.authorization = {
            accessToken, username
        }
        
        // Return message of success
        return res.status(200).json({message: "User successfully logged in."});
    }

    else {
        return res.status(208).json({message: "Invalid login. Please check username and password."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    // Review - must be a request query
    const review = req.query.review;
    
    let thisReview = users[review];

    // Review List - For adding the review to
    const reviewList = books.reviews;

    // ISBN Number - For specifying the book we want to review
    const isbnNumber = books.isbn;

    // If the user is logged in
    if (req.session.authorization)
    {
        // If the review exists
        if (thisReview)
        {
            // Update it
            users[review] = thisReview;
        }

        // But if it doesn't
        else {
            reviewList.add(user.username + " : " + review);
        }
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
