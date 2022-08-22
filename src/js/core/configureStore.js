import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import monitorReducersEnhancer from 'js/library/utils/monitorReducer';
import loggerMiddleware from 'js/library/utils/logger';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from 'js/core/reducers/rootReducer.js'; // the value from combineReducers

const persistConfig = {
 key: 'root',
 storage: storage,
 stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const middlewares = process.env.NODE_ENV === 'development' ? [loggerMiddleware, thunkMiddleware] : [thunkMiddleware];
//const middlewares = [loggerMiddleware, thunkMiddleware];

const middlewareEnhancer = applyMiddleware(...middlewares)

const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
const composedEnhancers = compose(...enhancers)

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, composedEnhancers);
export const persistor = persistStore(store);
