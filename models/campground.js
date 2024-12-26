const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const ops = { toJSON: {virtuals:true} }

//virtual : define our own attribute for the picture schema
ImageSchema.virtual('thumbnail').get(function(){
    // for the url, replace the /upload with /upload/w_200
   return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String, images: [ImageSchema],
    geometry: {
        type: { type: String, enum: ['Point'], requried: true }, coordinates: { type: [Number], required: true }},
    price: Number,
    description: String,  location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
}, opts);

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

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<string><a href="/campgrounds/${this._id}">${this.title}</a><strong>
                <p>${this.description.substring(0,20)}...</p>`
});
module.exports = mongoose.model('Campground', CampgroundSchema);