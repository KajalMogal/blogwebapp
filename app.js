if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();  
  }
  
  const express = require('express');
  const connectDB = require('./db');  // Import connectDB 
  const mongoose = require('mongoose');
  const path = require('path');
  const ejsMate = require('ejs-mate');
  const flash = require('connect-flash');
  const ExpressError = require('./utils/ExpressError');
  const methodOverride = require('method-override');
  const bcrypt = require('bcrypt');
  const session = require('express-session');
  const passport = require('passport');
  const LocalStrategy = require('passport-local');
  const User = require('./models/user');
  const mongoSanitize = require('express-mongo-sanitize');
  const userRoutes = require('./routes/users');
  const posts = require('./routes/posts');
  const comment = require('./routes/comments');
 const store = require('./sessionStore');
  

  // Initialize the Express app
  const app = express();
  app.engine('ejs', ejsMate);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  
  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(mongoSanitize());
  
  const secret = process.env.SECRET;

  // Session configuration
  const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
  
  app.use(session(sessionConfig));
  
  app.use(flash());
  
  // Passport local strategy configuration
  passport.use(new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user._id);  // Save user ID in session
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);  
    } catch (err) {
      done(err);
    }
  });
  
  // Local variables for Flash messages and user session
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });
  
  // Use routes
  app.use('/', userRoutes);
  app.use('/posts', posts);
  app.use('/posts/:id/comments', comment);
  
  // Home route
  app.get('/', (req, res) => {
    res.render('home');
  });
  
  // 404 handler
  app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
  });
  
  // Error handler
  app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh no, something went wrong';
    res.status(statusCode).render('error', { err });
  });
  
  // Connect to the MongoDB database
  connectDB();  
  
  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Serving on port ${port}`);
  });
  
  


