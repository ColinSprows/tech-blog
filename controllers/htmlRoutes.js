const router = require('express').Router();
const { User, blogPost, Comment } = require('../models');
const auth = require('../utils/auth');

// router.get('/', async (req, res) => {
//   res.render('login');
// });

router.get('/', async (req, res) => {
  try {
    const postBoard = await blogPost.findAll({
      include: [{ model: User }]
    });

    const posts = postBoard.map((post) =>
      post.get({ plain: true })
    );

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
  if (req.session.loggedIn) {
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
          include: [{ model: User, attributes: ['user_name']}]
        }]
      });

      const post = blogpost.get({ plain: true });

      res.render('blogpost', { post, logged_in: req.session.logged_in });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

module.exports = router;