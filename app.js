// Node's built-in modules
const os = require("os");

// 3rd party modules
const logger = require("logger").createLogger("log.text");
const args = require("yargs").argv;

// Custom module
const users = require("./users");

// Get user info
var appUser = os.userInfo();

// Grab user input
var command = process.argv[2];
var userName = args.username;
var email = args.email;
var password = args.password;

let logStatus = "Failure";
let logMsg = "";

if (!command || command.match(/-/g)) {
    logMsg = "Command not found";
}
// Process command
else {
    // Creates the user
    if (command === "create") {
        if (userName !== undefined && email !== undefined && password !== undefined) {
            var user = users.insertUser(userName, password, email);
            if (user) {
                logStatus = 'Success';
                logMsg = `User Created: ${userName} ${password} ${email}.`;
            } 
            else {
                logMsg = `User not created: Duplicate User (${userName}) found!`;
            }
        } 
        else {
            logMsg = 'Missing User Data param(s).';
        }
    } 
    // Reads the user
    else if (command === 'read') {
        if (userName === undefined) {
            logMsg = 'Missing User name param.';
        } 
        else {
            var user = users.getUser(userName);
            if (user) {
                logStatus = 'Success';
                logMsg = `User: ${user.username} ${user.email}.`;
            } 
            else {
                logMsg = `User (${userName}) not found!`;
            }
        }
    } 
    // Updates the user
    else if (command === 'update') {
        if (userName !== undefined && password !== undefined && email !== undefined) {
            var user = users.updateUser(userName, password, email);
            if (user) {
                logStatus = 'Success';
                logMsg = `User Updated: ${user.username} ${user.email}.`;
            } 
            else {
                logMsg = `User (${userName}) not found!`;
            }
        } 
        else {
            logMsg = 'Missing User Data param(s).';
        }
    } 
    // Deletes the user
    else if (command === 'delete') {
        if (userName === undefined || password === undefined) {
            logMsg = 'Missing User name param.';
        } 
        else {
            var user = users.deleteUser(userName, password);
            if (user) {
                logStatus = 'Success';
                logMsg = `User (${userName}) deleted.`;
            } 
            else {
                logMsg = `User (${userName}) not found!`;
            }
        }
    } 
    // List users in log file
    else if (command === 'list') {
        if (userName === undefined || password === undefined) {
            logMsg = 'Missing credentials.';
        } 
        else if (userName !== "Admin" || password !== "admin") {
            logMsg = 'Invalid credentials.';
        } 
        else {
            var userList = users.listUsers();
            if (userList.length === 0) {
                logMsg = 'No users found.';
            } 
            else {
                logStatus = 'Success';
                logMsg = ('Users:');
                userList.forEach((val) => {
                    logMsg += `${val.username}, ${val.email}'; `;
                });
            }
        }
    } 
    else {
        logMsg = `Command (${command}) not able to be processed.`;
    }
}

logger.info(`App accessed by ${appUser.username}: ${logStatus} - ${logMsg}`)