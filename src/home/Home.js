/** @jsx h */
import { h } from 'hyperapp';
import { Services } from '../services';

export const HomeModule = {
  actions: {
    getData: (state, actions) => (update) => Services.Page.query().then((pages) => update({ pages }))
  }
};

export const Home = (state, actions) => [
  <h1>Home</h1>,
  <pre><code>{JSON.stringify(state.pages, null, 2)}</code></pre>
];
