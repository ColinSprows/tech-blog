const router = require('express').Router();
const { User, blogPost, Comment } = require('../models');
const auth = require('../utils/auth');

router.get('/', async (req, res) => {
  console.log(req.session.logged_in)
  try {
    const postBoard = await blogPost.findAll({
      include: [{ model: User }]
    });

    const posts = postBoard.map((post) =>
      post.get({ plain: true })
    );
    console.log(posts)
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/blogpost/:id', async (req, res) => {
    try {
      const blogpost = await blogPost.findByPk(req.params.id, {
        include: [{
          model: User,
          model: Comment,
          include: [{ model: User, attributes: ['username']}]
        }]
      });
      const singlePost = blogpost.get({ plain: true });
      res.status(200).json({singlePost})
      res.render('blogpost', { post, logged_in: req.session.logged_in });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// router.get('/:id', async (req, res) => {
//   try { 
//     const post = await blogPost.findByPk(req.params.id, {
//         include: [{
//           model: Comment,
//           include: [{ model: User }]
//         }]
//     });
//     const singlePost = post.get({ plain: true });
//     res.status(200).json({singlePost})
//     res.render('post')
//     } catch (err) {
//         console.error(err);
//         res.status(400).json(err);
//   }
// });

router.get('/dashboard', async (req, res) => {
  const posts = await blogPost.findAll(
    {
      where: {
        user_id: req.session.user_id
      },
      include: [{
        model: Comment,
        include: {model: User, attributes: ['username']}
      }]
    });
  const userPosts = posts.map((blogPost) => blogPost.get({ plain: true}));
  res.render('dashboard', {userPosts, logged_in: req.session.logged_in})
});

module.exports = router;