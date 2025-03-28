//'node seeds/index.js' command to seed the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'
    , { useNewUrlParser: true, useUnifiedtopology: true}
)
const { places, descriptors } = require('./seedHelpers.js');
const Campground = require("../models/campground.js")
const cities = require("./cities.js")

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
// Sample is a function, in which we pass in an array
// and it returns a random element in the array : Math.random generates a random number from 0 - 1, 
//times that number by the array length, and take the floor -> get an index within the range of the array

//node seeds/index.js command to seed the database


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000); // get a random number from 0 to 1000
        const price = Math.floor(Math.random()* 30) + 10
        const camp = new Campground({
            author: '671590b1914b71b6c8d1977f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`, // that we have exported from cities.js or seedHelpers.js
            title: `${sample(descriptors)} ${sample(places)}`, // get a random element out of the descriptors / places array
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum',
            price,
            images: [ {
                url: 'https://res.cloudinary.com/df6sihvhh/image/upload/v1733777493/Kerry_YelpCamp/cppymhymzezijcuvvczv.jpg',
                filename: 'Kerry_YelpCamp/cppymhymzezijcuvvczv'
              },
              {
                url: 'https://res.cloudinary.com/df6sihvhh/image/upload/v1733777493/Kerry_YelpCamp/k2kpa8gswv2fazfmmjm4.jpg',
                filename: 'Kerry_YelpCamp/k2kpa8gswv2fazfmmjm4'
                }],
            geometry: {type:"Point", coordinates:[cities[random1000].longitude, cities[random1000].latitude]}
           
        })
        await camp.save();

    }
}

//seedDB returns a promise by async function
seedDB().then(() => {
    mongoose.connection.close();
})