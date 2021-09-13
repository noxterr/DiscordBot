var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const todo_data = new Schema({
    todo_id: String,
    discord_id: String,
    author: String,
    todo: String,
    insert_date: Date,
    prioritize: String
});

module.exports = mongoose.model('todo-data', todo_data);

/*
done: Boolean,
complete_date: Date
*/