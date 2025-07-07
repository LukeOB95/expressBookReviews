const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  
    // Cycle through the list of users
    for (let key in users)
    {
        // If the key matches the name provided
        if (users[key] === username)
        {
            // It is considered valid
            users[key].isValid = true;
        }

        // But if not
        else {
            users[key].isValid = false;
        }
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    // Username and password - required by the body
    const {username, password} = req.body;
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
