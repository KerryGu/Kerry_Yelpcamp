module.exports = func => { 
    // return a function that accepets a function
    return (req, res, next) => { 
        func(req, res, next).catch(next);
        // execute the passd in function, then catch any error, and pass it to next
    }
}