/** @jsx h */
import { h } from 'hyperapp';

export const createRouter = ({ routes, defaultRoute, setTitle }) => {
  const getRouteByKey = (key) => routes.find((route) => route.key === key) || defaultRoute;

  const getPathByRouteAndParams = (route, params) => {
    if (!params) return route.path;

    return Object.keys(params).reduce((path, key) => {
      return path.replace(new RegExp(`/:${key}/?`), `/${params[key]}`)
    }, route.path)
  };

  const getRouteAndParamsByPath = (path) => {
    // NOTE: Object key order is not guaranteed, we could provide an array instead
    // https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
    for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
      const route = routes[routeIndex];
      const params = {};
      const routeParts = route.path.split('/').filter(identity);
      const pathParts = path.split('/').filter(identity);

      // TODO: Match `/a/b/c` to `:url`
      if (routeParts.length !== pathParts.length) continue;

      let matched;
      for (let partIndex = 0; partIndex < routeParts.length; partIndex++) {
        const routePart = routeParts[partIndex];
        const pathPart = pathParts[partIndex];
        if (routePart === pathPart) {
          matched = true;
        }
        else if (routePart.charAt(0) !== ':') {
          matched = false;
          break;
        }
        else {
          matched = true;
          params[routePart.slice(1)] = pathPart;
        }
      }

      if (matched) return { route, params };
    }

    return { key: null, route: defaultRoute, params: {} };
  };

  // NOTE: Allows us to use the `setRoute` action in the `Link` component
  let setRoute;

  const RouterModule = {
    init(state, actions) {
      setRoute = actions.setRoute;

      window.history.replaceState({ key: state.route.key, params: state.params }, null, window.location.pathname);

      // NOTE: We're restoring the state from the route key, which will stop working if we change a route's key
      window.addEventListener('popstate', (e) => {
        const history = e && e.state || {};
        actions.setState({
          route: getRouteByKey(history.key),
          params: history.params,
        });
      });
    },
    state: getRouteAndParamsByPath(window.location.pathname),
    actions: {
      setState: (state, actions, newState) => newState,
      setRoute(state, actions, { route, params, options }) {
        // TODO: Dynamic / async title
        const title = setTitle ? setTitle(route.title) : route.title;
        const path = getPathByRouteAndParams(route, params);
        const args = [{ key: route.key, params }, title || null, path];
        if (options && options.replace) {
          window.history.replaceState(...args);
        }
        else {
          window.history.pushState(...args);
        }

        return { route, params };
      }
    }
  };

  // `href` can be overridden for more flexibility
  // `onclick` handler will be called after main click handler if provided
  const Link = ({ route, params, options, onclick, ...props }, children) => {
    if (process.env.NODE_ENV === 'development') {
      if (!route) throw new Error(`Invalid route: ${route}`);
    }

    return (
      <a
        {...props}
        href={getPathByRouteAndParams(route, params)}
        onclick={setRouteAndReturnFalse(route, params, options, onclick)}
      >{children}</a>
    );
  };

  const setRouteAndReturnFalse = (route, params, options, onclick) => (e) => {
    // Support ctrl+click
    if (e.ctrlKey) return;

    // Prevent the default route change so we can get a nice SPA :)
    e.preventDefault();

    setRoute({ route, params, options });

    if (onclick) {
      onclick(e);
    }
  };

  return {
    module: RouterModule,
    Link
  };
};

const identity = (x) => x;
