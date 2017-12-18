import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Chat API

export const doCreateMessage = (userId, text) =>
  db.ref('messages').push({
    userId,
    text,
  });

export const onMessageAdded = (callback) =>
  db.ref('messages')
    .orderByKey()
    .limitToLast(100)
    .on('child_added', callback);

