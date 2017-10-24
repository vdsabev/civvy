/** @jsx h */
import { h } from 'hyperapp';

import { Actions, Routes } from '../app';
import { AuthServices } from '../auth';
import { notify } from '../notify';
import { setPropToAttr, preventDefault } from '../utils';

export const RegisterModule = {
  actions: {
    init: () => ({ loading: false }),
    setEmail: setPropToAttr('email', 'value'),
    setPassword: setPropToAttr('password', 'value'),
    setPasswordConfirmation: setPropToAttr('passwordConfirmation', 'value'),
    register: (state, actions) => (update) => {
      if (state.password !== state.passwordConfirmation) {
        notify.error(`Password does not match confirmation! Please try again!`);
        return;
      }

      update({ loading: true });
      AuthServices.register(state.email, state.password)
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
          required autofocus
          oninput={actions.setEmail}
        />

        <input
          class="w-100p"
          type="password" name="password" placeholder="Password"
          required
          oninput={actions.setPassword}
        />

        <input
          class="w-100p"
          type="password" name="passwordConfirmation" placeholder="Confirm password"
          required
          oninput={actions.setPasswordConfirmation}
        />
        <button class="home-button register w-100p" type="submit" onclick={actions.register}>Register</button>
      </fieldset>
    </form>
};

export const Register = RegisterModule.view;
