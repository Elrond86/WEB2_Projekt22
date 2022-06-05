const { populate } = require('./MessageModel');
const Message = require('./MessageModel');

function getMessagesOfChat(user, callback) {
  try {
    Message.find({ $or: [{ to: user._id }, { by: user._id }] })
      .populate('by', ['username', '_id'])
      .populate('to', ['username', '_id'])
      .exec((err, messages) => {
        if (err || !messages)
          return callback(
            { error: 'Couldnt get messages for the user ' + user.username },
            null
          );
        else {
          let users = [];
          messages.forEach((message) => {
            const user1 = message.to._id;
            const user2 = message.by._id;
            if (!users.includes(user1)) {
              users.push(user1.toString());
            }
            if (!users.includes(user2)) {
              users.push(user2.toString());
            }
          });
          let uniqueUsers = new Set(users);
          console.log(uniqueUsers);
          let chats = [];
          uniqueUsers.forEach((userChat) => {
            let chat = [];
            messages.forEach((message) => {
              if (
                (message.by._id.toString() == user._id.toString() &&
                  message.to._id == userChat) ||
                (message.to._id.toString() == user._id.toString() &&
                  message.by._id == userChat)
              ) {
                chat.push(message);
              }
            });
            if (!chat.length < 1) chats.push(chat);
          });
          console.log(chats);
          callback(null, chats);
        }
      });
  } catch (error) {
    return callback({ error: 'Something went wrong' }, null);
  }
}

function createNewMessage(content, to, user, callback) {
  try {
    const message = {
      content: content,
      to: to,
      by: user._id,
    };
    const newMessage = new Message(message);
    newMessage.save((err, document) => {
      if (err) {
        return callback({ error: "Message couldn't be created." }, null);
      } else return callback(null, document);
    });
  } catch (error) {
    return callback({ error: 'Something went wrong' }, null);
  }
}

module.exports = {
  createNewMessage,
  getMessagesOfChat,
};
