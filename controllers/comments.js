const Comment = require('../models/comment.js');
const Post = require('../models/post.js');

module.exports.NewComment = async (req, res) => {
    //console.log(res.body());
     const post = await Post.findById(req.params.id).populate('author')  
     .populate({ path: 'comments', populate: { path: 'author' } });  
     const comment = new Comment(req.body.comment);
     comment.author = req.user._id;
     post.comments.push(comment);
     await comment.save();
     await post.save();
     req.flash('success', 'New comment added!');
     res.redirect(`/posts/${post._id}`);
}

module.exports.deleteComment = async(req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: {comments: commentId}});
    await Comment.findByIdAndDelete(commentId);
    req.flash('success','Deleted comment!')
    res.redirect(`/posts/${id}`);
}