const { cloudinary } = require("../cloudinary");
const Post = require('../models/post');

module.exports.index = async (req, res) => {
    const posts = await Post.find({}); // Fetch all posts from the database
    res.render('posts/index', { posts }); // Pass posts to the view
}

module.exports.new = (req, res) => {
    res.render('posts/new');
}

module.exports.newForm = async(req, res, next) => {
    // if(!req.body.post) throw new ExpressError('Invalid data');
     const post =  new Post(req.body.post);
     post.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
     post.author = req.user._id;
     await post.save();
     console.log(post);
     req.flash('success', 'Created a new blog');
     res.redirect(`/posts/${ post._id }`);
 }

module.exports.show =  async (req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
        

    if (!post) {
        req.flash('error', 'Cannot find that blog');
        return res.redirect('/posts');
    }
    res.render('posts/show', { post });
}

module.exports.editForm = async(req, res) => {  
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post) {
        req.flash('error', 'Cannot find that blog');
        return res.redirect('/posts');
    }
    if(!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/posts/${ id }`);
    }
    res.render('posts/edit' , { post });
}

module.exports.update = async(req, res) => {
    const { id } = req.params;
    const posts = await Post.findById(id);
    if(!posts.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/posts/${ id }`);
    }
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    const imgs = req.files.map( f => ({ url: f.path, filename: f.filename }));
    post.images.push(...imgs);
    await post.save();
    if(req.body.deleteImages)  {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated a blog');
    res.redirect(`/posts/${post._id}`);
}

module.exports.deletePost = async(req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Deleted');
    res.redirect('/posts');
}