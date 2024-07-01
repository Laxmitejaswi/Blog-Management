const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

const ArticleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    username: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    comments: [
        {
            username: { type: String, required: true },
            content: { type: String, required: true },
            created_at: { type: Date, default: Date.now }
        }
    ]
    
}, { timestamps: true });

const Passenger = mongoose.model('Passenger', PassengerSchema);
const Article = mongoose.model('Article', ArticleSchema);

module.exports = { Passenger, Article };