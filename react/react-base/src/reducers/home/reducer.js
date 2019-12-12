import _ from 'lodash';
import { UPDATE_MENUS_DATA, UPDATE_SIDER_COLLAPSED } from '../../constants/actionTypes';

 var response = {
	"success": true,
	"busiCode": "00300",
	"message": "成功获取菜单",
	"result": {
		"data": {
			"menus": [{
					"name": "首页",
					"icon": "iconfont-home",
					"path": "dashboard/dashboard"
				},{
					"name": "组件-demo",
					"icon": "iconfont-order-list",
					"path": "modules",
					 "children":[
						        {
						            "name": "树",
                                    "path": "tree",
                                    "children":[
                                        {
                                            "name":"权限树",
                                            "path":"permission"
                                        }
                                    ]
                                },
                                {
						            "name": "拖拽",
                                    "path": "drag",
                                    "children":[
                                        {
                                            "name":"beautiful-dnd插件",
                                            "path":"beaut-dnd"
                                        }
                                    ]
						        }
					        ]
				}
			]
		}
	}
}


// 菜单数据
const menuData = response.result.data.menus;
// 是否收缩
const isCollapsed = false;

let switchMap = {};

switchMap[UPDATE_SIDER_COLLAPSED] = (state, action) => {
    return action.payload;
};

switchMap[UPDATE_MENUS_DATA] = (state, action) => {
    return action.payload;
};

function collapsed(state = isCollapsed, action) {
    if (_.isEqual(action.type, UPDATE_SIDER_COLLAPSED) && switchMap[action.type]) {
        return switchMap[action.type](state, action);
    } else {
        return state;
    }
}

function menus(state = menuData, action) {
    // if (_.isEqual(action.type, UPDATE_MENUS_DATA) && switchMap[action.type]) {
    //     return switchMap[action.type](state, action);
    // } else {

        return state;
    // }
}

export { collapsed, menus };
