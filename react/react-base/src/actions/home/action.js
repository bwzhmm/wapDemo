import xFetch from '../../util/xFetch';
import { UPDATE_MENUS_DATA, UPDATE_MENUS_DATA_ALL, UPDATE_ALL_PROJECT } from '../../constants/actionTypes';
import { UPDATE_SIDER_COLLAPSED } from '../../constants/actionTypes';
import _ from 'lodash';
const url = '/user/getLoginMenus';  //菜单权限

function updateSiderCollapsed(data) {
    return {
        type: UPDATE_SIDER_COLLAPSED,
        payload: data
    };
}

function updateMenusAction(data) {
    return {
        type: UPDATE_MENUS_DATA,
        payload: data
    };
}

function requestMenusAction(data, callback) {
    // thunkMiddleware给这里dispatch形参进行赋值
    return dispatch => {
        xFetch(url, {
            data: {}
        }).then(result => {
            if (_.isFunction(callback)) {
                callback(result.result);
            }
            dispatch(updateMenusAction(result.result.data.menus));
        });
    };
}

export { updateSiderCollapsed, updateMenusAction, requestMenusAction };