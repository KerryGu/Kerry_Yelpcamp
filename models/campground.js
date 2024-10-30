const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String, image: String, price: String,
    description: String, location: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "review" }]
});

// middleware is trigger after Campground.findByIdAndDelete(id) is called, and
//delete all related reviews to a campground when a campground is deleted 
CampgroundSchema.post('findOneAndDelete', async function (doc) { 
    // if campground object is non-empty
    if (doc) { 
        await review.deleteMany({
            _id: {
                $in:doc.reviews
            }
            // remove the id that is in doc.reviews
        })
    }
}
)

module.exports = mongoose.model('Campground', CampgroundSchema);