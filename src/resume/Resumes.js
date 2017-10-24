import './Resumes.css';

/** @jsx h */
import { h } from 'hyperapp';

import { Actions, Link, Routes, initialUserAuth } from '../app';
import { Services } from '../services';
import { values } from '../utils';

export const ResumesModule = {
  actions: {
    getData: (state, actions, userId) => (update) => initialUserAuth.then(() => {
      const { user } = Actions.getAuth();
      return Services.Resume.query({ userId: user.uid }).then((resumes) => update({ resumes }));
    })
  },
  view: ({ state, actions, userId }) =>
    <div class="resumes" oncreate={() => actions.getData(userId)}>
      {values(state.resumes, 'key').map(ResumeItem)}
    </div>
};

export const Resumes = ResumesModule.view;

const ResumeItem = (resume) =>
  <Link class="resume-item" route={Routes.RESUME} params={{ resumeId: resume.key }} style={{ background: resume.accentColor }}>
    <h2>{resume.name}</h2>
    {resume.workplaces && resume.workplaces.map(ResumeItemWorkplace)}
  </Link>
;

const ResumeItemWorkplace = (workplace) =>
  <div class="text-left">{workplace.name}</div>
;
