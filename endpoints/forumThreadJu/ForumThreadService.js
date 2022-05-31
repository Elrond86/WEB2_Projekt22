const ForumThread = require('./ForumThreadModel');

// create forumThread
const createForumThread = (body, ownerID, callback) => {
  const { name } = body;
  if (!name) {
    callback('Please provide a name for the ForumThread', null, 400);
  } else {
    ForumThread.create({
      name: body.name,
      description: body.description || 'No description provided',
      ownerID: ownerID
    }, (err, thread) => {
      if (err) {
        callback(`Creation of forumThread failed`, null, 500);
      } else {
        const { _id, name, description, ownerID } = thread;
        const subset = { _id, name, description, ownerID };
        callback(null, subset, 200);
      }
    });
  }
}

// get all forumThreads
const getForumThreads = (callback) => {
  ForumThread.find({}).exec((err, threads) => {
    if (err) {
      callback('Error while getting ForumThreads', null, 500);
    } else {
      let filteredThreads = threads.map(thread => {
        const { _id, name, description, ownerID } = thread;
        return { _id, name, description, ownerID };
      });
      callback(null, filteredThreads, 200);
    }
  });
};

// find forumThread by ID
const getForumThreadById = (threadID, callback) => {
  ForumThread.findOne({_id: threadID}).exec((err, thread) => {
    if (err) {
      callback(`No ForumThread with ID "${threadID}" found`, null, 404);
    } else {
      if (thread) {
        const { _id, name, description, ownerID } = thread;
        const subset = { _id, name, description, ownerID };
        callback(null, subset, 200);
      } else {
        callback(`No ForumThread with ID "${threadID}" found`, null, 404);     
      }
    }
  });
};

// find forumThread by userID
const getForumThreadsByUserId = (ownerID, callback) => {
  ForumThread.find({ownerID: ownerID}).exec((err, threads) => {
    if (err) {
      callback(`No ForumThreads of user with ID ${ownerID} found`, null, 404);
    } else {
      if (threads) {
        let filteredThreads = threads.map(thread => {
          const { _id, name, description, ownerID } = thread;
          return { _id, name, description, ownerID };
        });
        callback(null, filteredThreads, 200);
      } else {
        callback(`No ForumThreads of user with ID ${ownerID} found`, null, 404);     
      }
    }
  });
};

// update forumThread by ID
const updateForumThreadById = (threadID, body, userID, isAdministrator, callback) => {
  ForumThread.findOne({_id: threadID}, (err, thread) => {
    if (thread) {
      if (thread.ownerID == userID || isAdministrator) {
        Object.assign(thread, body);
        thread.save((err) => {
          if (err) {
            callback('Error while updating ForumThread', null, 500);
          } else {
            const { _id, name, description, ownerID } = thread;
            const subset = { _id, name, description, ownerID };
            callback(null, subset, 200);
          }
        });
      } else {
        callback('You are not allowed to update this ForumThread', null, 401);
      }
    } else {
      callback(`No ForumThread with ID "${threadID}" found`, null, 404);
    }
  });
};

// delete forumThread by ID
const deleteForumThreadById = (threadID, userID, isAdministrator, callback) => {
  ForumThread.findOne({_id: threadID}, (err, thread) => {
    if (thread) {
      if (thread.ownerID == userID || isAdministrator) {
        ForumThread.deleteOne({
          userID: userID,
          _id: threadID
        }, (err, result) => {
          if (err) {
            callback('Internal Server Error', null, 500);
          } else {
            callback(`ForumThread with ID ${threadID} succesfully deleted`, true, 204);
          }
        });
      } else {
        callback('You are not allowed to delete this ForumThread', null, 401);
      }
    } else {
      callback(`No ForumThread with ID "${threadID}" found`, null, 404);
    }
  });
  
}

module.exports = {
  createForumThread,
  getForumThreads,
  getForumThreadById,
  updateForumThreadById,
  getForumThreadsByUserId,
  deleteForumThreadById
}