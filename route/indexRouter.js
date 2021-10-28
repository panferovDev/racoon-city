const router = require('express').Router()
const { Post } = require('../db/models')


router.route('/')
.get(async (req, res) => {
    const posts = await Post.findAll()
    //Вариант проверки 1
    // for(let post of posts) {
    //     post.owner = post.user_id === req.session.user.id
    // }
    res.render('index', {posts})
})

module.exports = router