const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
});
module.exports = mongoose.model('Comment', commentSchema);