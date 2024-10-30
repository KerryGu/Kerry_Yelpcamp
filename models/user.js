const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String,
        required: true, 
        unique: true
    }

});

//add on to the schema a field for password, username
// manages password / username : make sure usernames are unique and not duplicated
//also include additional methods we can use 
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);