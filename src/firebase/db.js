import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, isAdmin) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    isAdmin,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Other db APIs ...
