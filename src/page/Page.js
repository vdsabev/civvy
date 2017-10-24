import './Page.css';

/** @jsx h */
import { h } from 'hyperapp';

import { Actions } from '../app';
import { Loader } from '../loader/Loader';
import { animationDuration } from '../style';

export const Pages = (props, children) => <div class="page-container" {...props}>{children}</div>;

export const Page = (props) => {
  if (process.env.NODE_ENV === 'development' & !props.route) {
    throw new Error(`Invalid route ${props.route} for page '${props.module}'`);
  }

  if (Actions.getRoute() !== props.route) return null;

  const params = Actions.getRouteParams();
  const MaybeLoader = cacheAndResolveWithLoader(props.module, params, props.resolve);
  if (MaybeLoader != null) return MaybeLoader;

  const key = params ?
    `${props.module}-${Object.keys(params).map((key) => `${key}=${params[key]}`).join('-')}`
    :
    props.module
  ;

  return (
    <props.view
      key={key}
      onremove={props.cache ? fadeOutPage : invalidateCacheAndFadeOutPage(props.module) }
      state={Actions.getModuleState(props.module)}
      actions={Actions.getModuleActions(props.module)}
    />
  );
};

const cachedModules = {};

const cacheAndResolveWithLoader = (moduleKey, params, resolve) => {
  if (!resolve) return null;

  if (!cachedModules[moduleKey]) {
    cachedModules[moduleKey] = {};
  }

  const cachedModule = cachedModules[moduleKey];
  if (cachedModule.$resolved) return null;

  if (!cachedModule.$pending) {
    cachedModule.$pending = true;
    resolve(params)
      .then(() => {
        cachedModule.$resolved = true;
        cachedModule.$pending = false;
      })
      .catch(() => {
        cachedModule.$pending = false;
      })
    ;
  }

  return <Loader key={moduleKey} />;
};

const invalidateCacheAndFadeOutPage = (moduleKey) => (el) => {
  const cachedModule = cachedModules[moduleKey];
  if (cachedModule) {
    cachedModule.$resolved = false;
  }

  fadeOutPage(el);
};


const fadeOutPage = (el) => (remove) => {
  el.classList.add('page-fade-out');
  setTimeout(remove, 1000 * animationDuration);
};
