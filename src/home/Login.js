/** @jsx h */
import { h } from 'hyperapp';

import { Actions, Routes } from '../app';
import { AuthServices } from '../auth';
import { notify } from '../notify';
import { setPropToAttr, preventDefault } from '../utils';

export const LoginModule = {
  actions: {
    init: () => ({ loading: false }),
    setEmail: setPropToAttr('email', 'value'),
    setPassword: setPropToAttr('password', 'value'),
    login: (state, actions) => (update) => {
      update({ loading: true });
      AuthServices.login(state.email, state.password)
        .then(() => Actions.setRoute(Routes.HOME))
        .catch((error) => update({ loading: false }))
      ;
    }
  },
  view: ({ state, actions, ...props }) =>
    <form oncreate={actions.init} onsubmit={preventDefault} {...props}>
      <fieldset class="flex-column" disabled={state.loading}>
        <input
          class="w-100p"
          type="email" name="email" placeholder="Email"
          oninput={actions.setEmail}
        />

        <input
          class="w-100p"
          type="password" name="password" placeholder="Password"
          required
          oninput={actions.setPassword}
        />

        <button class="home-button login w-100p" type="submit" onclick={actions.login}>Login</button>
      </fieldset>
    </form>
};

export const Login = LoginModule.view;
