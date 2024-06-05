function isUsernameTooShort(username) {
    // Check if username is at least 5 characters long
    if (username.length < 5) {
        return true;
    } else {
        return false;
    }
}

function isUsernameTooLong(username) {
    // Check if username is no longer than 15 characters long
    if (username.length > 16) {
        return true;
    } else {
        return false;
    }
}

function isUsernameHasSymbol(username) {
    // Check if username contains only letters and numbers
    const regex = /^[a-zA-Z0-9]+$/;
    if(regex.test(username)) {
        return false;
    } else {
        return true;
    }
}

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(email)) {
        return false;
    } else {
        return true;
    }
}

function isPasswordValid(password) {
    if(password.length >= 8) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    isUsernameTooShort,
    isUsernameTooLong,
    isUsernameHasSymbol,
    isPasswordValid,
}