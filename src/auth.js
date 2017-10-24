/** @jsx h */
import { h } from 'hyperapp';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { catchError } from './utils';

export const AuthModule = {
  init(state, actions) {
    actions.onAuthStateChanged(actions.setUser);
  },
  state: {
    user: false
  },
  actions: {
    setUser: (state, actions, user) => ({ user }),
    onAuthStateChanged: (state, actions, ...args) => () => firebase.auth().onAuthStateChanged(...args)
  }
};

export const AuthServices = {
  register: (email, password) => catchError(firebase.auth().createUserWithEmailAndPassword(email, password)),
  login: (email, password) => catchError(firebase.auth().signInWithEmailAndPassword(email, password)),
  logout: () => catchError(firebase.auth().signOut())
};
