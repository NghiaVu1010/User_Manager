// Require fileSystem
const fs = require("fs");

// Read file
var getUsers = () => {
    try {
        let usersString = fs.readFileSync("users.json");
        return JSON.parse(usersString);
    }
    catch(err) {
        return [];
    }
};

// Write to file
var saveUsers = (users) => {
    fs.writeFileSync("users.json", JSON.stringify(users));
};

// Create user
var insertUser = (username, password, email) => {
    let users = getUsers();

    // Grab info
    let user = {username, password, email};

    // Check for duplicates 
    let duplicateUsers = users.filter((user) => {
        return (user.username === username || user.email === email)
    });

    if(duplicateUsers.length === 0) {
        users.push(user);
        saveUsers(users);
        return users;
    }
};

// Read user
var getUser = (username) => {
    let users = getUsers();
    let filteredUsers = users.filter((user) => user.username === username);
    return filteredUsers[0];
};

// "Update" (delete and insert) a user
var updateUser = (username, password, email) => {
    let users = getUsers();

    // Searches for user
    let filteredUsers = users.filter((user) => user.username === username && user.password === password);

    // Checks if user exists
    if (filteredUsers.length > 0) {
        // Delete then re-insert
        deleteUser(username, password);
        return insertUser(username, password, email);
    }

    return filteredUsers[0];
};

// Delete a user
var deleteUser = (username, password) => {
    let users = getUsers();
    let filteredUsers = users.filter((user) => user.username !== username && user.password !== password);

    saveUsers(filteredUsers);

    return users.length !== filteredUsers.length;
};

// Return all Users
var listUsers = () => {
    return getUsers();
};

module.exports = {
    insertUser,
    getUser,
    updateUser,
    deleteUser,
    listUsers
};