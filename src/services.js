import * as firebase from 'firebase/app';
import 'firebase/database';

import { catchError } from './utils';

const firebaseRef = (path) => firebase.database().ref(path);
const firebaseGet = (path) => catchError(firebaseRef(path).once('value')).then((snapshot) => snapshot.val());
const firebaseUpdate = (path, data) => catchError(firebaseRef(path).update(data));

export const Services = {
  Resume: {
    query: ({ userId }) => firebaseGet(`users/${userId}/resumes`),
    get: ({ userId, resumeId }) => firebaseGet(`users/${userId}/resumes/${resumeId}`),
    update: ({ userId, resumeId }, data) => firebaseUpdate(`users/${userId}/resumes/${resumeId}`, data)
  },

  Profile: {
    get: ({ userId, profileId }) => firebaseGet(`users/${userId}/profiles/${profileId}`)
  }
};
