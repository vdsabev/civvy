import './Resume.css';

/** @jsx h */
import { h } from 'hyperapp';

import { Actions, initialUserAuth } from '../app';
import { flex } from '../flex';
import { Services } from '../services';

import { LanguageLevel } from './LanguageLevel';
import { PageBreak } from './PageBreak';

export const ResumeModule = {
  actions: {
    getData: (state, actions, { resumeId }) => (update) => initialUserAuth.then(() => {
      const { user } = Actions.getAuth();
      return (
        Services.Resume.get({ userId: user.uid, resumeId })
          .then((resume) => update({ resumeBackup: resume, resume, resumeId }))
          .then(actions.getProfile)
      );
    }),
    getProfile: (state, actions, { resume }) => (update) => {
      const { user } = Actions.getAuth();
      return (
        Services.Profile.get({ userId: user.uid, profileId: resume.profile })
          .then((profile) => update({ profile }))
      );
    },

    setAccentColor: (state, actions, e) => ({ resume: { ...state.resume, accentColor: e.currentTarget.value } }),
    reset: (state, actions) => ({ resume: state.resumeBackup }),
    save: (state, actions) => (update) => {
      const { user } = Actions.getAuth();
      return (
        Services.Resume.update({ userId: user.uid, resumeId: state.resumeId }, state.resume)
          .then(() => update({ resumeBackup: state.resume }))
      );
    }
  },
  // TODO: Fade in animation
  view: ({ state, actions, ...props }) =>
    <div class="resume" {...props}>
      <HeaderEdit
        resume={state.resume}
        changed={state.resume !== state.resumeBackup}
        setAccentColor={actions.setAccentColor}
        reset={actions.reset}
        save={actions.save}
      />
      <Header resume={state.resume} profile={state.profile} />
      <div class="resume-section">
        <h3 class="resume-title">Work Experience</h3>
        <WorkExperience resume={state.resume} />
        <h3 class="resume-title">Education</h3>
        <Education resume={state.resume} />
        <h3 class="resume-title">Languages</h3>
        <Languages resume={state.resume} />
        <h3 class="resume-title">Personal Skills</h3>
        <Skills resume={state.resume} />
      </div>
    </div>
};

export const Resume = ResumeModule.view;

const HeaderEdit = ({ resume, changed, setAccentColor, reset, save }) =>
  <div class="resume-header-edit">
    <span>
      <input type="text" value={resume.accentColor} oninput={setAccentColor} />
    </span>

    <button class="resume-reset" type="button" onclick={reset} disabled={!changed}>Reset</button>
    <button class="resume-save" type="button" onclick={save} disabled={!changed}>Save</button>
  </div>
;

const Header = ({ resume, profile }) =>
  <div class="resume-header" style={{ background: resume.accentColor }}>
    <div class="resume-section flex-row justify-content-start align-items-center">
      <div style={flex(1)}>
        <h1>{profile.name}</h1>
        <br />
        <div class="resume-spacer">
          <i class="fa fa-fw fa-envelope"></i>
          <a class="resume-header-link" href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
        <div class="resume-spacer">
          <i class="fa fa-fw fa-phone"></i>
          <a class="resume-header-link" href={`tel:${profile.phone}`}>{profile.phone}</a>
        </div>
        <div>
          <i class="fa fa-fw fa-birthday-cake"></i>
          {profile.birthdate}
        </div>
      </div>
      <img class="profile-picture" src={profile.pictureUrl} />
    </div>
  </div>
;

const WorkExperience = ({ resume }) => resume.workplaces && resume.workplaces.map((workplace, index) => wrapWithPageBreaks(workplace,
  <div class="resume-timeline">
    <div class="resume-timeline-point">
      <i class="fa fa-fw fa-clock-o"></i>
      {workplace.period.from} &ndash; {workplace.period.to || 'present'}
    </div>
    <div class="resume-timeline-content" style={flex(1)}>
      <h4 class="resume-item-title resume-spacer">{workplace.position}</h4>
      <div class="resume-item-info flex-row justify-content-start align-items-start resume-spacer">
        <img class="resume-item-picture" src={workplace.pictureUrl} />
        <div>
          <b>{workplace.name}</b>
          <i class="fa fa-fw fa-angle-double-right"></i>
          {workplace.websiteUrls && workplace.websiteUrls.map((url, urlIndex) =>
            <a style={{ color: resume.accentColor }} href={url}>
              {url}{workplace.websiteUrls.length > 1 && urlIndex < workplace.websiteUrls.length - 1 ? ', ' : ''}
            </a>
          )}
        </div>
      </div>
      {workplace.descriptions && workplace.descriptions.map((description) =>
        <div class="flex-row justify-content-start align-items-baseline resume-spacer">
          <div class="resume-item-list-item-icon">
            <i class="fa fa-fw fa-check"></i>
          </div>
          {description}
        </div>
      )}
    </div>
  </div>
));

const Education = ({ resume }) => resume.education && resume.education.map((education) => wrapWithPageBreaks(education,
  <div class="resume-timeline">
    <div class="resume-timeline-point">
      <i class="fa fa-fw fa-clock-o"></i>
      {education.period.from} &ndash; {education.period.to || 'present'}
    </div>
    <div class="resume-timeline-content" style={flex(1)}>
      <h4 class="resume-item-title resume-spacer">{education.position}</h4>
      <div class="resume-item-info flex-row justify-content-start align-items-start resume-spacer">
        <img class="resume-item-picture" src={education.pictureUrl} />
        <div>
          <b>{education.name}</b>
        </div>
      </div>
      {education.subjects && education.subjects.map((subject) =>
        <div class="flex-row justify-content-start align-items-baseline resume-spacer">
          <div class="resume-item-list-item-icon">
            <i class="fa fa-fw fa-check"></i>
          </div>
          {subject}
        </div>
      )}
    </div>
  </div>
));

const Languages = ({ resume }) =>
  <table class="language-list">
    <tr>
      <th class="language-list-item"></th>
      <th class="language-list-item">
        Understanding
      </th>
      <th class="language-list-item">
        Speaking
      </th>
      <th class="language-list-item">
        Writing
      </th>
    </tr>
    {resume.languages && resume.languages.map((language) =>
      <tr>
        <th>{language.name}</th>
        <td><LanguageLevel level={language.understanding} /></td>
        <td><LanguageLevel level={language.speaking} /></td>
        <td><LanguageLevel level={language.writing} /></td>
      </tr>
    )}
  </table>
;

const Skills = ({ resume }) => resume.skills && resume.skills.map((skill) => wrapWithPageBreaks(skill,
  <div class="flex-row justify-content-start align-items-baseline resume-spacer">
    <div class="resume-item-list-item-icon">
      <i class="fa fa-fw fa-check"></i>
    </div>
    <div>
      <b>{skill.name}</b>
      {skill.description && <span> &ndash; {skill.description}</span>}
    </div>
  </div>
));

const wrapWithPageBreaks = (item, component) => [
  item.pageBreak === 'before' && <PageBreak />,
  component,
  item.pageBreak === 'after' && <PageBreak />,
];
