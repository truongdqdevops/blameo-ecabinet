import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root-reducer';
import Reactotron from '../../ReactotronConfig';
const initialState = {};

const logger = createLogger({diff: true, collapsed: true});

const Store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(thunk), Reactotron.createEnhancer()),
);

// console.log('state Store--', Store.getState());
export default Store;
