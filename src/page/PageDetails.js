import './PageDetails.css';

/** @jsx h */
import { h } from 'hyperapp';

import { flex } from '../flex';
import { Services } from '../services';

import { LanguageLevel } from './LanguageLevel';
import { PageBreak } from './PageBreak';

export const PageDetailsModule = {
  actions: {
    getData: (state, actions, { pageId }) => (update) => (
      Services.Page.get({ pageId }).then((page) => update({ page })).then(actions.getCandidate)
    ),
    getCandidate: (state, actions) => (update) => (
      Services.Candidate.get({ candidateId: state.page.candidate }).then((candidate) => update({ candidate }))
    )
  }
};

export const PageDetails = (state, actions) =>
  <div>
    <PageHeader page={state.page} candidate={state.candidate} />
    <div class="page-section">
      <h3>Work Experience</h3>
      <br />
      <WorkExperience page={state.page} />
      <br />
      <h3>Education</h3>
      <br />
      <Education page={state.page} />
      <br />
      <h3>Languages</h3>
      <br />
      <Languages page={state.page} />
      <br />
      <h3>Personal Skills</h3>
      <br />
      <Skills page={state.page} />
    </div>
  </div>
;

const PageHeader = ({ page, candidate }) =>
  <div class="page-header" style={{ background: page.accentColor }}>
    <div class="page-section flex-row justify-content-start align-items-center" style={{ background: page.accentColor }}>
      <div style={flex(1)}>
        <h1>{candidate.name}</h1>
        <br />
        <div class="page-spacer">
          <i class="fa fa-fw fa-envelope"></i>
          <a class="page-header-link" href={`mailto:${candidate.email}`}>{candidate.email}</a>
        </div>
        <div class="page-spacer">
          <i class="fa fa-fw fa-phone"></i>
          <a class="page-header-link" href={`tel:${candidate.phone}`}>{candidate.phone}</a>
        </div>
        <div>
          <i class="fa fa-fw fa-birthday-cake"></i>
          {candidate.birthdate}
        </div>
      </div>
      <img class="candidate-picture" src={candidate.pictureUrl} />
    </div>
  </div>
;

const WorkExperience = ({ page }) => page.workplaces.map((workplace, index) => wrapWithPageBreaks(workplace,
  <div class="page-timeline">
    <div class="page-timeline-point">
      <i class="fa fa-fw fa-clock-o"></i>
      {workplace.period.from} &ndash; {workplace.period.to || 'present'}
    </div>
    <div class="page-timeline-content" style={flex(1)}>
      <h4 class="page-item-title page-spacer">{workplace.position}</h4>
      <div class="page-item-info flex-row justify-content-start align-items-start page-spacer">
        <img class="page-item-picture" src={workplace.pictureUrl} />
        <div>
          <b>{workplace.name}</b>
          <i class="fa fa-fw fa-angle-double-right"></i>
          {workplace.websiteUrls.map((url, urlIndex) =>
            <a style={{ color: page.accentColor }} href={url}>
              {url}{workplace.websiteUrls.length > 1 && urlIndex < workplace.websiteUrls.length - 1 ? ', ' : ''}
            </a>
          )}
        </div>
      </div>
      {workplace.responsibilities.map((responsibility) =>
        <div class="flex-row justify-content-start align-items-baseline page-spacer">
          <div class="page-item-list-item-icon">
            <i class="fa fa-fw fa-check"></i>
          </div>
          {responsibility}
        </div>
      )}
    </div>
  </div>
));

const Education = ({ page }) => page.education.map((education) => wrapWithPageBreaks(education,
  <div class="page-timeline">
    <div class="page-timeline-point">
      <i class="fa fa-fw fa-clock-o"></i>
      {education.period.from} &ndash; {education.period.to || 'present'}
    </div>
    <div class="page-timeline-content" style={flex(1)}>
      <h4 class="page-item-title page-spacer">{education.position}</h4>
      <div class="page-item-info flex-row justify-content-start align-items-start page-spacer">
        <img class="page-item-picture" src={education.pictureUrl} />
        <div>
          <b>{education.name}</b>
        </div>
      </div>
      {education.subjects && education.subjects.map((subject) =>
        <div class="flex-row justify-content-start align-items-baseline page-spacer">
          <div class="page-item-list-item-icon">
            <i class="fa fa-fw fa-check"></i>
          </div>
          {subject}
        </div>
      )}
    </div>
  </div>
));

const Languages = ({ page }) =>
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
    {page.languages.map((language) =>
      <tr>
        <th>{language.name}</th>
        <td><LanguageLevel level={language.understanding} /></td>
        <td><LanguageLevel level={language.speaking} /></td>
        <td><LanguageLevel level={language.writing} /></td>
      </tr>
    )}
  </table>
;

const Skills = ({ page }) => page.skills.map((skill) => wrapWithPageBreaks(skill,
  <div class="flex-row justify-content-start align-items-baseline page-spacer">
    <div class="page-item-list-item-icon">
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
