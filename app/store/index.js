import { AsyncStorage } from 'react-native';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

//配置redux-persist，但下次进入应用，就会从root里面获得数据
let persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet
}
const persistedReducer = persistReducer(persistConfig, reducer);
export default function configureStore() {
    const store = createStore(persistedReducer);
    let persistor = persistStore(store);
    return { store, persistor };
}
