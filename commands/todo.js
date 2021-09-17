const mongoose = require('mongoose');
var Todo = require('./todo_schema.js');

module.exports = {
    name: 'todo',
    description: 'command that adds the TODO to the DB',
    execute(message, args) {

        //creds  ${process.env.MONGO_DB_CREDS}

        if (!args) {
            return message.reply("please insert the correct value");
        }

        if (args.length == 1) {
            mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_CREDS}@cluster1.j7mnp.mongodb.net/purple-lambda?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            
            let connected = true

            mongoose.connection.once('open', function() {
                console.log('Connected!');
                //create the schemed player
                (async() => {
                    await Todo.find({ todo_id: args[0] }, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (data && data.length != 0) {
                                message.reply("your todo has number " + args[0] + " and exists");
                            } else {
                                message.reply("your asked todo does not and exists, free to create a new one");
                            }
                        }
                    });
                })();
                if (connected) {
                    console.log('I close the connection')
                    setTimeout(() => {
                        mongoose.connection.close()
                    }, 1500)
                }
            }).on('error', function(error) {
                console.log("Err:\n" + error);
            })
        } else {
            let finish = "";
            let start = "";
            let j = 0;
            for (let i = 0; i < args.length; i++) {
                if (args[i].includes("\"")) {
                    if (j != 0) {
                        finish = args[i];
                        break;
                    } else {
                        j = i;
                        start = args[j];
                    }
                }
            }

            let arguments = ""
            for (let i = 0; i < args.length; i++) {
                if (args[i] == start) {
                    for (let j = 0; j < args.length; j++) {
                        if (args[j] == finish) {
                            arguments += (args[j] + " ");
                            break
                        } else {
                            arguments += (args[j] + " ");
                        }
                    }
                }
            }

            let user_id = message.author.id
            let user_name = message.author.username
            console.log("username: " + user_name)
            console.log(message.author)
            mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_CREDS}@cluster1.j7mnp.mongodb.net/purple-lambda?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            let connected = true
            let stringOfTodo = args.join(' '); //arguments.toString();
            let todayDate = new Date();
            rndBumber = Math.floor(Math.random() * 100000);

            mongoose.connection.once('open', function() {
                console.log('Connected!');
                //create the schemed player
                (async() => {
                    await Todo.create({
                        todo_id: rndBumber,
                        discord_id: user_id,
                        author: user_name,
                        todo: stringOfTodo,
                        insert_date: todayDate,
                        prioritize: "always",
                    });
                })();

                if (connected) {
                    console.log('I close the connection')
                    setTimeout(() => {
                        mongoose.connection.close()
                        message.reply("your todo has been added to the list and has ID: " + rndBumber);
                    }, 1500)
                }

            }).on('error', function(error) {
                console.log("Err:\n" + error);
                message.reply("There has been some kind of error, somehow, somewhere");
            })
        }
    }
}
