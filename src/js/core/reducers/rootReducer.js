import {combineReducers} from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//Models
import mapfreQueryModel from 'js/core/reducers/models/mapfreQueryModel.js';
import phoneInputModel from 'js/core/reducers/models/phoneInputModel.js';
import userFormModel from 'js/core/reducers/models/userFormModel.js';
import editUserInfoModel from 'js/core/reducers/models/editUserInfoModel.js';
import phoneLoginModel from 'js/core/reducers/models/phoneLoginModel.js';

//Components
import mapfreQueryComponent from 'js/core/reducers/components/mapfreQueryReducer.js';
import phoneInputComponent from 'js/core/reducers/components/phoneInputReducer.js';
import userFormComponent from 'js/core/reducers/components/userFormReducer.js';
import editUserInfoComponent from 'js/core/reducers/components/editUserInfoReducer.js';
import phoneLoginComponent from 'js/core/reducers/components/phoneLoginReducer.js';

export default combineReducers({
    mapfreQueryModel: createReducer("mapfreQuery", mapfreQueryModel ),
    phoneInputModel: createReducer("phoneInputModel", phoneInputModel ),
    phoneLoginModel: createReducer("phoneLoginModel", phoneLoginModel ),
    userFormModel: createReducer("userFormModel", userFormModel ),
    editUserInfoModel: createReducer("editUserInfoModel", editUserInfoModel ),

    mapfreQueryComponent: mapfreQueryComponent,
    phoneInputComponent: phoneInputComponent,
    phoneLoginComponent: phoneLoginComponent,
    userFormComponent: userFormComponent,
    editUserInfoComponent: editUserInfoComponent
});

function createReducer(key, reducer) {
    return persistReducer(createConfig(key), reducer);
}

function createConfig(key) {
    return {
      key: key,
      storage
    }
}