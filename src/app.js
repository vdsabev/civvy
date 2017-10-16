/** @jsx h */
import { app, h } from 'hyperapp';
import logger from '@hyperapp/logger';
import classy from 'classwrap';

import { Home, HomeModule } from './home';
import { Navigation } from './navigation';
import { Page } from './page';

import { createRouter } from './router';

export const Routes = {
  HOME: { path: '/', title: 'Home' },
  PAGE_CREATE: { path: '/pages/new', title: 'Create Page' },
  PAGE: { path: '/pages/:pageId', title: 'Page' },
  OTHER: { path: ':url', title: 'Page Not Found' }
};

const router = createRouter({
  routes: Routes,
  defaultRoute: Routes.HOME
});

export const Link = router.Link;

let createApp = app;
if (process.env.NODE_ENV === 'development') {
  createApp = logger()(app);
}

export const Actions = createApp({
  init(state, actions) {
    // We need to use `setTimeout` for the animation to run properly
    setTimeout(actions.animate, 0);

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
    getRoute: (state) => () => state.router.route,
    // NOTE: If needed, we can allow using dot notation to go deeper *inception.jpg*
    getModuleState: (state, actions, moduleKey) => () => state[moduleKey],
    getModuleActions: (state, actions, moduleKey) => () => actions[moduleKey]
  },
  modules: {
    home: HomeModule,

    router: router.module
  },
  view: (state, actions) =>
    <div class={classy(['fade-in', { 'fade-in-start': state.animation  }])}>
      <Navigation />
      <div class="page-container">
        <Page route={Routes.HOME} view={Home} module="home" resolve={actions.home.getData} />
      </div>
    </div>
});
