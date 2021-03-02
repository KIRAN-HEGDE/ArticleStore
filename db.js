const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/articles');

mongoose.connection.once('open', function() {
    console.log('Connection to articles database has been created.');

}).on('error', function(error) {
    console.log('Connection error:', error);
});