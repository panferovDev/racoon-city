const router = require('express').Router();
const {Post} = require('../db/models')
router.route('/')
.post(async (req, res) => {

    await Post.create({...req.body, user_id: req.session.user.id})

    res.redirect('/')
})

module.exports = router