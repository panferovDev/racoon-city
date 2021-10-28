require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
// const redis = require('redis')
const session = require('express-session')
// const RedisStore = require('connect-redis')(session)
// const redisClient = redis.createClient()
const FileStore = require('session-file-store')(session);

const app = express();
const fileStoreOptions = {};
const PORT = process.env.PORT ?? 3000;
const userRouter = require('./route/userRouter');
const indexRouter = require('./route/indexRouter')
const postRouter = require('./route/postRouter');

hbs.registerPartials(path.join(process.env.PWD, 'views/partials'));

hbs.registerHelper('ownerCheck', (post, user) => {
  if(post && user){
    return post.user_id === user.id
  }
    return false
})

app.set('view engine', 'hbs');
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    name:'sid',
    // store: new RedisStore({ client: redisClient }),
    store: new FileStore(fileStoreOptions),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
  })
)

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

app.use('/', indexRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)

app.listen(PORT, () => {
    console.log('Server start on ', PORT);
  });
