const mongoose = require('mongoose');

//Article Schema

const  ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true 
    },
    meta: {
        visited: {
            type: Boolean,
            default: false
        }
    }
});

let Article = module.exports = mongoose.model('Article', ArticleSchema);