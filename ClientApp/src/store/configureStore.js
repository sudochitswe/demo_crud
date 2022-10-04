import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
//import * as WeatherForecasts from './WeatherForecasts';
import * as Auth from './Auth';

// export default function configureStore (history, initialState) {
//   const reducers = {
//     auth: Auth.reducer,
//     // weatherForecasts: WeatherForecasts.reducer
//   };

export default function configureStore (history, initialState) {
  const reducers = {
    auth: Auth.reducer,
    //counter: Counter.reducer,
    //weatherForecasts: WeatherForecasts.reducer
  };

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  const middleware = [
    thunk,
    routerMiddleware(history)
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
