const mongoose = require('mongoose');
const Comment = require('./comment'); 
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_300');
});
    const PostSchema = new Schema({
        title: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        images: [ImageSchema],
        description: String,
        
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    });
    
PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        });
    }
});

module.exports = mongoose.model('Post', PostSchema);

