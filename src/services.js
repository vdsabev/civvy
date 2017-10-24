import * as firebase from 'firebase/app';
import 'firebase/database';

import { catchError } from './utils';

const firebaseGet = (path) => catchError(firebase.database().ref(path).once('value')).then((snapshot) => snapshot.val());

export const Services = {
  Resume: {
    query: ({ userId }) => firebaseGet(`users/${userId}/resumes`),
    get: ({ userId, resumeId }) => firebaseGet(`users/${userId}/resumes/${resumeId}`)
  },

  Profile: {
    get: ({ userId, profileId }) => firebaseGet(`users/${userId}/profiles/${profileId}`)
  }
};
