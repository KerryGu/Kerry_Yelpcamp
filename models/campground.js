const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String, image: String, price: String,
    description: String, location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
});

// middleware is trigger after Campground.findByIdAndDelete(id) is called, and
//delete all related reviews to a campground when a campground is deleted 
CampgroundSchema.post('findOneAndDelete', async function (doc) { 
    // if campground object is non-empty
    if (doc) { 
        await Review.deleteMany({
            _id: {
                $in:doc.reviews
            }
            // remove the id that is in doc.reviews
        })
    }
}
)

module.exports = mongoose.model('Campground', CampgroundSchema);