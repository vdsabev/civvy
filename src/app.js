/** @jsx h */
import { app, h } from 'hyperapp';
import logger from '@hyperapp/logger';
import classy from 'classwrap';

import { AuthModule } from './auth';
import { initializeFirebaseApp } from './firebase';
import { Home, HomeModule } from './home/Home';
import { Pages, Page } from './page/Page';
import { Resume, ResumeModule } from './resume/Resume';
import { arrayToObject, select } from './utils';

// Firebase
initializeFirebaseApp();

// Auth
const initialUserAuthResolver = { done: false, resolve: null };
export const initialUserAuth = new Promise((resolve) => initialUserAuthResolver.resolve = resolve);

// Router
import { createRouter } from './router';

const RoutesArray = [
  { key: 'HOME', path: '/'                                              },
  { key: 'LOGIN', path: '/login',               title: 'Login'          },
  { key: 'REGISTER', path: '/register',         title: 'Register'       },
  { key: 'RESUME_CREATE', path: '/resumes/new', title: 'Create Resume'  },
  { key: 'RESUME', path: '/resumes/:resumeId',  title: 'Resume'         },
  // TODO: Implement
  { key: 'OTHER', path: ':url',                 title: 'Page Not Found' }
];

export const Routes = arrayToObject(RoutesArray, 'key');

const router = createRouter({
  routes: RoutesArray,
  defaultRoute: Routes.HOME,
  setTitle: (title) => title ? `Civvy - ${title}` : 'Civvy'
});

export const Link = router.Link;

// App
let createApp = app;
if (process.env.NODE_ENV === 'development') {
  createApp = logger()(app);
}

export const Actions = createApp({
  init(state, actions) {
    // We need to use `setTimeout` for the animation to run properly
    setTimeout(actions.animate, 0);

    // Auth
    actions.auth.onAuthStateChanged((user) => {
      if (!initialUserAuthResolver.done) {
        initialUserAuthResolver.resolve(user);
        initialUserAuthResolver.done = true;
      }
    });

    // PWA
    if (process.env.NODE_ENV === 'production' && navigator.serviceWorker) {
      navigator.serviceWorker.register('service-worker.js', { scope: './' });
    }
  },
  state: {
    animation: false
  },
  actions: {
    animate: () => ({ animation: true }),

    // Thunks that return slices of the state, but don't cause a re-render
    getModuleState: (state, actions, moduleKey) => () => select(moduleKey, state),
    getModuleActions: (state, actions, moduleKey) => () => select(moduleKey, actions),

    getAuth: (state) => () => state.auth,

    getRouteParams: (state) => () => state.router.params,
    getRoute: (state) => () => state.router.route,
    setRoute: (state, actions, route) => actions.router.setRoute({ route })
  },
  modules: {
    home: HomeModule,
    resume: ResumeModule,

    auth: AuthModule,
    router: router.module
  },
  view: (state, actions) =>
    <div class={classy(['fade-in', { 'fade-in-start': state.animation  }])}>
      <Pages>
        {/* TODO: Support multiple routes for a module */}
        <Page route={Routes.HOME} view={Home} module="home" />
        <Page route={Routes.LOGIN} view={Home} module="home" />
        <Page route={Routes.REGISTER} view={Home} module="home" />

        <Page route={Routes.RESUME} view={Resume} module="resume" resolve={actions.resume.getData} />
      </Pages>
    </div>
});
