import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Input, Divider, Tree, message, Icon, Checkbox  } from 'antd';
// import { getPermissionOfRole, configPermissionOfRole } from '../../actions/auth-manage/role/actions';

// import '@styles/auth.less';
import styles from './permission.less';
const { TreeNode } = Tree;

const inittreeData =   [ {
  "id" : "4438",
  "key" : "4438",
  "path" : "4438",
  "pid" : "-1",
  "name" : "根节点",
  "seqId" : "1",
  "children" : [ {
    "id" : "4440",
    "key" : "4440",
    "path" : "4440",
    "pid" : "4438",
    "name" : "子节点",
    "seqId" : "1",
    "children" : [ {
      "id" : "4442",
      "key" : "4442",
      "path" : "4442",
      "pid" : "4440",
      "name" : "孙子节点",
      "seqId" : "1",
      "children" : [ ],
      "permission" : [ {
        "checked" : true,
        "menuId" : "4442",
        "permissionId" : "4443",
        "permissionName" : "添加"
      }, {
        "checked" : true,
        "menuId" : "4442",
        "permissionId" : "4444",
        "permissionName" : "编辑"
      }, {
        "checked" : false,
        "menuId" : "4442",
        "permissionId" : "4445",
        "permissionName" : "删除"
      } ]
    } , {
      "id" : "44450",
      "key" : "44450",
      "path" : "44450",
      "pid" : "4438",
      "name" : "子节点2",
      "seqId" : "1",
      "children" : [ {
        "id" : "44452",
        "key" : "44452",
        "path" : "44452",
        "pid" : "44450",
        "name" : "孙子节点",
        "seqId" : "1",
        "children" : [ ],
        "permission" : [ {
          "checked" : true,
          "menuId" : "44452",
          "permissionId" : "44443",
          "permissionName" : "添加"
        }, {
          "checked" : true,
          "menuId" : "44452",
          "permissionId" : "44444",
          "permissionName" : "编辑"
        }, {
          "checked" : false,
          "menuId" : "44452",
          "permissionId" : "44445",
          "permissionName" : "删除"
        } ]
      }]}] }]
}, {
  "id" : "4496",
  "key" : "4496",
  "path" : "4496",
  "pid" : "-1",
  "name" : "IT资源首页",
  "seqId" : "1",
  "children" : [ {
    "id" : "4498",
    "key" : "4498",
    "path" : "4498",
    "pid" : "4496",
    "name" : "项目管理页面",
    "seqId" : "1",
    "children" : [ ],
    "permission" : [ {
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4499",
      "permissionName" : "查看"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4450",
      "permissionName" : "删除"
    },{
      "checked" : true,
      "menuId" : "4498",
      "permissionId" : "4451",
      "permissionName" : "编辑"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4452",
      "permissionName" : "管理员权限"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4453",
      "permissionName" : "导出"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4454",
      "permissionName" : "导入"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4455",
      "permissionName" : "上传"
    },{
      "checked" : true,
      "menuId" : "4498",
      "permissionId" : "4456",
      "permissionName" : "权限管理"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4457",
      "permissionName" : "关联标签"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4458",
      "permissionName" : "新增"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4459",
      "permissionName" : "查询"
    },{
      "checked" : false,
      "menuId" : "4498",
      "permissionId" : "4460",
      "permissionName" : "详情"
    } ]
  } ],
} ];

const plainOptions = [
  { label: '查看', value: 'Apple' },
  { label: '删除', value: 'Pear' },
  { label: '修改', value: 'Orange' },
];
const FormItem = Form.Item;
let permissionIds = [], defaultCheckedIds = [], authDefaultIds = [],authAllCheckedIds= [];

class Permission extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      authexpandedKeys: [],
      authcheckedKeys: [],
      authselectedKeys: [],
      authtreeData: [],
      checkAll:false,
      
    }
  }

  componentDidMount() {
    const { dispatch, adminId, resourceId, roleId } = this.props;   //取通过路由跳转 addTab传来的值
    let params = {
      adminId: adminId,
      moduleId: resourceId,
      roleId: roleId
    };

    // dispatch(getPermissionOfRole(params, (res) => {
      let data = [];
      // if(res.data.length) {
        data = this.getTreeLists(inittreeData);
        permissionIds = [],
        defaultCheckedIds = [];
        authDefaultIds = [];
        // let initIds = this.getCheckIds(inittreeData);
        let initIds = this.getCheckAuthIds(inittreeData);
         this.getCheckAllIds(inittreeData);
        
        this.setState({
          treeData: data,
          checkedKeys: initIds,
          expandedKeys: initIds
        });
      // }
    // }));
  }

  //转成tree的格式字段
  getTreeLists = (result) => {
    let item = [];
    result.map((list) => {
      let newData = {};
      newData.key = list.id;
      newData.permission = list.permission;
      newData.id = list.id;
      newData.pid = list.pid;
      newData.title = list.name;
      newData.children = list.children ? this.getTreeLists(list.children) : [];
      item.push(newData);
    });
    return item;
  }

  //递归过滤树 后台返回的权限，返回子节点id； 只有一个查看权限时
  getCheckIds = (treeDatalist) => {
    treeDatalist.map((list) => {
      if (list.permission && list.permission.length > 0 && list.permission[0].checked) {
        defaultCheckedIds.push(list.id);
      }
      if (list.children && list.children.length > 0) {
        this.getCheckIds(list.children)
      }
    });
    // console.log('defaultCheckedIds', defaultCheckedIds)
    return defaultCheckedIds;
  }

  //递归过滤树 后台返回的权限，返回子节点id  有未知的多个权限时
  getCheckAuthIds = (treeDatalist) => {
    treeDatalist.map((list) => {
      if (list.permission && list.permission.length > 0 ) {
        list.permission.map( (auth) => {
          if(auth.checked){
            authDefaultIds.push(auth.permissionId);
          }
        })
      }
      if (list.children && list.children.length > 0) {
        this.getCheckAuthIds(list.children)
      }
    });
    // console.log('defaultCheckedIds', defaultCheckedIds)
    return authDefaultIds;
  }

  
  //点击全选按钮时，递归树下所有的权限id，设置为true字段
  getCheckAllIds = (treeDatalist) => {
    treeDatalist.map((list) => {
      if (list.permission && list.permission.length > 0 ) {
        list.permission.map( (auth) => {
          // if(auth.checked){
            authAllCheckedIds.push(auth.permissionId);
          // }
        })
      }
      if (list.children && list.children.length > 0) {
        this.getCheckAllIds(list.children)
      }
    });
    // console.log('authAllCheckedIds', authAllCheckedIds)
    return authAllCheckedIds;
  }


  //递归过滤树 点击checked为true的节点下对应的权限id
  getPermissionIds = (alltreeData, allcheckedKeys) => {
    alltreeData.map((list) => {
      if (list.permission && list.permission.length > 0 && allcheckedKeys && allcheckedKeys.includes(list.id)) {
        permissionIds.push(list.permission[0].permissionId);
      }
      if (list.children && list.children.length > 0) {
        this.getPermissionIds(list.children, allcheckedKeys)
      }
    });
    return permissionIds;
  }

  // 保存时，从全部树种 过滤出， 选择的checkedkeys是权限的 id 
  handleSave() {
    let alltreeData = treeData;
    let allcheckedKeys = this.state.checkedKeys;
    let permissionIds = this.getPermissionIds(alltreeData, allcheckedKeys);
    const { dispatch, adminId, resourceId, roleId } = this.props;
    let params = {
      adminId: adminId,
      moduleId: resourceId,
      roleId: roleId,
      permissionIds: [...new Set(permissionIds)]
    };
    // dispatch(configPermissionOfRole(params, (res) => {
    //   if (res.success) {
        message.success('保存成功');
    //   }
    // }));
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  

   //判断是否选中全部  父节点，即选中了 全部字节点 所有节点;当前选中的节点中 包含了所有的父节点，即选中了全部
   isCheckAllNodes = (alltreeData, allcheckedKeys) => {
     let flag = true;
    alltreeData.map((list) => {
      if (list.pid ==='-1' && allcheckedKeys && !allcheckedKeys.includes(list.id)) {
        flag = false;
      }
    
    });
    console.log('flag',flag)
    return flag;
  }


  onCheck = (checkedKeys, info) => {
    let alltreeData = this.state.treeData;
    // console.log('checkedKeys = ', checkedKeys);
    this.setState({ checkedKeys });
    // console.log('authDefaultIds = ', authDefaultIds);
    // console.log('authAllCheckedIds = ', authAllCheckedIds);
    this.setState({
      checkAll: this.isCheckAllNodes(alltreeData, checkedKeys) ? true : false
    })
  };

  onSelect = (selectedKeys, info) => {
    console.log('selectedKeys = ', selectedKeys);
    this.setState({ selectedKeys });
  };

  onCheckbox = (item, checkedValues)=> {
    console.log('checked = ', checkedValues);
    console.log('cccccitem = ', item);
    let initcheckeds = this.state.checkedKeys;
    initcheckeds.push(item.key);
    this.setState({
      checkedKeys: ['4498'],
    });
  }

  onCheckAllChange = (e) => {
    this.setState({
      checkAll:e.target.checked,
      checkedKeys: !e.target.checked ? [] : authAllCheckedIds
    });
  }

  renderAuthTree = data =>
    data.map(item => {
        return (
          <TreeNode  className='span_title' title={item.permissionName} key={item.permissionId} dataRef={item}>
          </TreeNode>
        );
    });
  

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            className={item.pid == '-1' ? 'gray_block_title' : 'white_block_title'}
            title={
              <span>
              {item.title}000ss
            
              </span>
            }
            key={item.key}
            dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode
            className={item.pid == '-1' ? 'gray_block_title' : 'white_block_title'}
            title={item.title} 
            key={item.key}>
            {this.renderAuthTree(item.permission)}

            </TreeNode>
    });

  render() {
    const { form: { getFieldDecorator }, roleName } = this.props;
    const { treeData } = this.state;
    // console.log('treeData',treeData)
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    return (
      <Form style={{ backgroundColor: '#fff', padding: '20px' }}>
        <Row>
          <Col span={20}><p>系统授权111</p> </Col>
          <Col span={4}>
            <Button type='primary' icon='check' size='small' onClick={this.handleSave.bind(this, {})} >保存</Button>
          </Col>
          <Divider />
        </Row>
        <Row>
          <Col span={6}>
            <FormItem {...formLayout} label='角色名称' >
              {
                <Input placeholder='请输入角色名称' autoComplete='off' defaultValue={roleName} readOnly disabled />
              }
            </FormItem>
          </Col>
        
        </Row>
        <Row>
          <Col>
          请选择权限：
            <Checkbox
            style={{marginLeft:'20px'}}
            checked = {this.state.checkAll}
            onChange={this.onCheckAllChange}
            >
            选择所有权限
            </Checkbox>
          </Col>
        
          <Col>
            <Row>
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                switcherIcon={<Icon type="down" />}
                // blockNode = {true}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    adminId: '00'
  }
}

Permission = Form.create()(Permission);
export default connect(mapStateToProps)(Permission);
