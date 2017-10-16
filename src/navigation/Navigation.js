import './Navigation.css';

/** @jsx h */
import { h } from 'hyperapp';
import classy from 'classwrap';

import { Actions, Routes, Link } from '../app';

export const Navigation = () => {
  const currentRoute = Actions.getRoute();

  return (
    <header class="navigation narrow">
      <PageLink currentRoute={currentRoute} pageRoute={Routes.HOME} />
    </header>
  );
};

const PageLink = ({ currentRoute, pageRoute, ...props }) =>
  <Link
    class={classy(['navigation-page-link', { active: currentRoute === pageRoute }])}
    route={pageRoute}
    onclick={scrollToContainer}
    {...props}
  >{pageRoute.title}</Link>
;

const scrollToContainer = (e) => {
  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
};
