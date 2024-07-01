const bcrypt = require('bcryptjs');
const { Passenger, Article } = require('./model.js');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await Passenger.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Passenger({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Passenger.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        res.status(200).json({message: "login Successful"});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
};

exports.logoutUser = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

exports.getAllUsers = async (req, res) => {
    try {
        const passengers = await Passenger.find();
        if (passengers.length > 0) {
            res.status(200).json(passengers);
        } else {
            res.status(404).json({ error: 'No users found' });
        }
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.getUserByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const userInfo = await Passenger.findOne({ username: username });
        if (userInfo) {
            res.status(200).json(userInfo);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.deleteUser = async (req, res) => {
    const username = req.params.username;
    try {
        const deletedUser = await Passenger.findOneAndDelete({ username });
        if (deletedUser) {
            res.status(200).json(deletedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.getLikedArticlesOfUser = async (req, res) => {
    const username = req.params.username;
    try {
        const passenger = await Passenger.findOne({ username }).populate('likedArticles');
        if (passenger) {
            res.status(200).json(passenger.likedArticles);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching liked articles:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        if (articles.length > 0) {
            res.status(200).json(articles);
        } else {
            res.status(404).json({ error: 'No articles yet' });
        }
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

exports.getArticlesByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const articles = await Article.find({ username: username }).sort({ createdAt: -1 });
        if (articles.length > 0) {
            res.status(200).json(articles);
        } else {
            res.status(404).json({ error: 'No articles yet' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// search option
exports.getArticleByName = async (req, res) => {
    const articleName = req.params.name;
    try {
        const articleInfo = await Article.findOne({ name: articleName });
        if (articleInfo) {
            res.status(200).json(articleInfo);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.createArticle = async (req, res) => {
    const { name, title, content, username } = req.body;
    try {
        const existingArticle = await Article.findOne({ name });
        if (existingArticle) {
            return res.status(400).json({ error: 'Article name already exists' });
        }
        const article = new Article({ name, username, title, content });
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (error) {
        console.error('Error creating article:', error.message);
        res.status(400).json({ error: 'An error occurred while creating the article' });
    }
};

exports.updateArticle = async (req, res) => {
    const articleName = req.params.name;
    const { title, content, username } = req.body;
    try {
        const updatedArticle = await Article.findOneAndUpdate(
            { name: articleName, username },
            { title, content },
            { new: true }
        );
        if (updatedArticle) {
            res.status(200).json(updatedArticle);
        } else {
            res.status(404).json({ error: 'Article not found or you are not the owner' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.deleteArticle = async (req, res) => {
    const articleName = req.params.name;
    try {
        const deletedArticle = await Article.findOneAndDelete({ name: articleName });
        if (deletedArticle) {
            res.status(200).json(deletedArticle);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.addCommentToArticle = async (req, res) => {
    const { username, content } = req.body;
    const articleName = req.params.name;
    try {
        const articleInfo = await Article.findOne({ name: articleName });
        if (articleInfo) {
            if(username){
                articleInfo.comments.push({ username, content });
                articleInfo.commentsCount += 1;
                await articleInfo.save();
                res.status(200).json({ comments: articleInfo.comments, commentsCount: articleInfo.commentsCount });
            }else{
                res.status(404).json({ error: 'Please login to Comment' });
            }
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.getCommentsOfArticle = async (req, res) => {
    const articleName = req.params.name;
    try {
        const article = await Article.findOne({ name: articleName });
        if (article) {
            if(article.comments.length > 0)
                res.status(200).json(article.comments);
            else {
                res.status(404).json({ error: 'No Comments yet' });
            }
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

exports.likeArticle = async (req, res) => {
    const articleName = req.params.name;
    const username = req.body.username;
    try {
        const article = await Article.findOne({ name: articleName });
        const passenger = await Passenger.findOne({ username });
        if (article && passenger) {
            const alreadyLiked = passenger.likedArticles.includes(article._id);
            if (alreadyLiked) {
                return res.status(400).json({ error: 'Article already liked by you' });
            }
            article.likes += 1;
            await article.save();
            passenger.likedArticles.push(article._id);
            await passenger.save();
            res.status(200).json({ article, passenger });
        } else {
            res.status(404).json({ error: 'Please login to like' });
        }
    } catch (error) {
        console.error('Error liking the article:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};


