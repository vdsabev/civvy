/** @jsx h */
import { h } from 'hyperapp';
import { Services } from '../services';

export const HomeModule = {
  actions: {
    getData: (state, actions) => (update) => Services.Portfolio.query().then((portfolios) => ({ portfolios })).then(update)
  }
};

export const Home = (state, actions) => [
  <h1>Home</h1>,
  <pre><code>{JSON.stringify(state.portfolios, null, 2)}</code></pre>
];
