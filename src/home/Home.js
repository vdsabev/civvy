import './Home.css';
import './logo.svg';

/** @jsx h */
import { h } from 'hyperapp';

import { Actions, Link, Routes } from '../app';
import { AuthServices } from '../auth';
import { Pages, Page } from '../page/Page';
import { Resumes, ResumesModule } from '../resume/Resumes';

import { Login, LoginModule } from './Login';
import { Register, RegisterModule } from './Register';

export const HomeModule = {
  actions: {
    logout: () => AuthServices.logout()
  },
  modules: {
    login: LoginModule,
    register: RegisterModule,
    resumes: ResumesModule
  },
  view: ({ state, actions, ...props }) => {
    const { user } = Actions.getAuth();
    return (
      <div class="home" {...props}>
        <div class="home-hero">
          <img class="home-logo" src="logo.svg" />
          <p class="home-text">Your résumé redefined</p>
          {user == null && <LoggedOutPage />}
          {user && <LoggedInPage user={user} logout={actions.logout} resumes={{ state: state.resumes, actions: actions.resumes }} />}
        </div>
        {user && <Resumes key="home.resumes" state={state.resumes} actions={actions.resumes} userId={user.uid} />}
      </div>
    );
  }
};

export const Home = HomeModule.view;

const LoggedOutPage = () =>
  <Pages>
    <Page route={Routes.HOME} view={Links} />
    <Page route={Routes.LOGIN} view={Login} module="home.login" />
    <Page route={Routes.REGISTER} view={Register} module="home.register" />
  </Pages>
;

const Links = (props) =>
  <div>
    <Link class="home-button login w-100p" route={Routes.LOGIN}>Login</Link>
    <div class="home-spacer"></div>
    <Link class="home-button register w-100p" route={Routes.REGISTER}>Register</Link>
  </div>
;

const LoggedInPage = ({ user, logout, resumes }) =>
  <div class="flex-row justify-content-center align-items-center">
    <span>You are logged in with {user.email || '...'}</span>
    <button class="home-button logout inline" onclick={logout}>Logout</button>
  </div>
;
