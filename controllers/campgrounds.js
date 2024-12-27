const Campground = require('../models/campground.js');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
// grocoder contains forward geocoding
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // geocoding the location information and save that information as the campground.geometry
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.author = req.user._id;
    // req.files.map, map each image to an image object 
    campground.images = req.files.map(f => ({ 
        url: f.path, filename: f.filename
    }));

    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    // populate reviews + author for each review
    const campground = await Campground.findById(req.params.id).populate({

        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground});
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ 
        url: f.path, filename: f.filename
    }))

    // makes the imgs array first, added images array can't be direclty passed in to the original images array
    //... spread function, spread each item in the images array and push them to the list seperately 
    campground.images.push( ...imgs); 
    await campground.save();

    //cloudinary storage
    if (req.body.deleteImages) { 
        for (let filename of req.body.deleteImages) { 
            // delete the selected images from cloudinary through cloudinary.deestroy
            await cloudinary.uploader.destroy(filename);
        }
        //pull operator : pull elements(images) out of the images array for images with fileNames is in deleteImages
        const result = await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        const updatedCampground = await Campground.findById(id);
    }
    
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}