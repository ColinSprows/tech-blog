const User = require('./User');
const blogPost = require('./blogPost');
const Comment = require('./Comment');

User.hasMany(blogPost, {
    foreignKey: 'user_id',
});

blogPost.belongsTo(User, {
    foreignKey: 'user_id',
});



User.hasMany(Comment, {
    foreignKey: 'user_id',
});



Comment.belongsTo(User, {
    foreignKey: 'user_id',
});

blogPost.hasMany(Comment, {
    foreignKey : 'post_id',
    onDelete: 'CASCADE'
})

Comment.belongsTo(blogPost, {
    foreignKey: 'post_id'
})

module.exports = { User, blogPost, Comment };