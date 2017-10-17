/** @jsx h */
import { h } from 'hyperapp';

export const createRouter = ({ routes, defaultRoute }) => {
  const getRouteKeyFromPath = (path) => path ? path.replace('/', '').toUpperCase() : '';

  const matchPath = (path) => {
    // NOTE: Object key order is not guaranteed, we could provide an array instead
    // https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
    for (let key in routes) {
      if (!routes.hasOwnProperty(key)) continue;

      const route = routes[key];
      const params = {};
      const routeParts = route.path.split('/').filter(identity);
      const pathParts = path.split('/').filter(identity);

      // TODO: Match `/a/b/c` to `:url`
      if (routeParts.length !== pathParts.length) continue;

      let matched;
      for (let index = 0; index < routeParts.length; index++) {
        const routePart = routeParts[index];
        const pathPart = pathParts[index];
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

    return { route: defaultRoute, params: {} };
  };
  const initial = matchPath(window.location.pathname);

  // NOTE: Allows us to use the `setRoute` action in the `Link` component
  let setRoute;

  const RouterModule = {
    init(state, actions) {
      setRoute = actions.setRoute;

      const initialRouteKey = getRouteKeyFromPath(window.location.pathname);
      window.history.replaceState(initialRouteKey, null, window.location.pathname);
      window.addEventListener('popstate', (e) => {
        // NOTE: We're restoring the state from the route key, which will stop working if we change a route's key
        actions.setRoute({ route: getRouteFromKey(e && e.state), options: { skipHistoryStateUpdate: true } });
      });
    },
    state: {
      route: initial.route,
      params: initial.params
    },
    actions: {
      setRoute(state, actions, { route, options }) {
        if (!(options && options.skipHistoryStateUpdate)) {
          const routeKey = getRouteKeyFromPath(route.path);
          if (options && options.replace) {
            window.history.replaceState(routeKey, null, route.path);
          }
          else {
            window.history.pushState(routeKey, null, route.path);
          }
        }

        if (route.title) {
          // TODO: Dynamic / async title
          document.title = `Civvy - ${route.title}`;
        }

        // TODO: Return params
        return { route };
      }
    }
  };

  // `href` can be overridden for more flexibility
  // `onclick` handler will be called after main click handler if provided
  const Link = ({ route, options, onclick, ...props }, children) =>
    <a href={route.path} {...props} onclick={setRouteAndReturnFalse(route, options, onclick)}>{children}</a>
  ;

  const setRouteAndReturnFalse = (route, options, onclick) => (e) => {
    setRoute({ route, options });

    if (onclick) {
      onclick(e);
    }

    // Cancel the default route change so we can get a nice SPA :)
    return false;
  };

  return {
    module: RouterModule,
    Link
  };
};

const identity = (x) => x;
