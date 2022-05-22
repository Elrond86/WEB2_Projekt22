const ForumThread = require('./ForumThreadModel');

// create forumThread
const createForumThread = (body, ownerID, callback) => {
}

// get all forumThreads
const getForumThreads = (callback) => {

};

// find forumThread by ID
const getForumThreadById = (threadID, callback) => {
 
};

// find forumThread by userID
const getForumThreadsByUserId = (ownerID, callback) => {
 
};

const updateForumThreadById = (threadID, body, userID, isAdministrator, callback) => {
 
};

// delete forumThread by ID
const deleteForumThreadById = (threadID, userID, isAdministrator, callback) => {
};

module.exports = {
  createForumThread,
  getForumThreads,
  getForumThreadById,
  updateForumThreadById,
  getForumThreadsByUserId,
  deleteForumThreadById
}