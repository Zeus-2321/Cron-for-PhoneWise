const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    slug: String,
    brand: String,
    phone_name: String,
    image: String,
    thumbnail: String,
});

module.exports = mongoose.model('Phone', phoneSchema);