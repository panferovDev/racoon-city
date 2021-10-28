const router = require('express').Router()
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const {authCheck} = require('../middleware/userMiddleware')

router.route('/signup')
.get(authCheck, async (req, res) => {

    res.render('signup')
})
.post(async (req, res) => {
    const {email, name, password} = req.body;
    if(email && name && password){
        const cryptPass = await bcrypt.hash(password, Number(process.env.SALT_ROUND))
        try{
          const currentUser =  await User.create({...req.body, password:cryptPass})
          req.session.user = {id:currentUser.id, name:currentUser.name}
          return res.redirect('/')
        }catch(err){
            console.log(err)
            return res.redirect('/user/signup')
        }
    } else {
        return res.redirect('/user/signup')
    }
    res.redirect('/user/signup')
})

router.route('/signin')
.get(authCheck,(req, res) => {

    res.render('signin')
})

.post(async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        try{
            const currentUser = await User.findOne({where:{email}})
            if(currentUser && await bcrypt.compare(password, currentUser.password)){
                req.session.user = {id:currentUser.id, name:currentUser.name}
                return res.redirect('/')
            } else {
                return res.redirect('/user/signin') 
            }
        }catch(err){
            console.log(err)
            return res.redirect('/user/signin')
        }
    }else{
        return res.redirect('/user/signin')
    }

})


router.route('/logout')
.get((req, res) => {
    req.session.destroy()
    res.clearCookie('sid').redirect('/')
})


module.exports = router