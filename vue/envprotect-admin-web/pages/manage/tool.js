


//企业信息列表
export const companyCol = [
    { dataIndex: "NAME", title: "企业名称", selected: true, },
    { dataIndex: "CREDITCODE", title: "社会统一信用代码", selected: true },
    { dataIndex: "LEGAL", title: "法人代表", selected: true },
    { dataIndex: "SETUPTIME", title: "成立时间", selected: true },
    { dataIndex: "PROPERTY", title: "企业性质", selected: false },
    { dataIndex: "ADDRESS", title: "地址", selected: false },
    { dataIndex: "INVESTMENT", title: "投资情况", selected: false },
    { dataIndex: "EMPLOYEENUM", title: "职工数", selected: false },
    { dataIndex: "TYPE", title: "行业类别", selected: false },
    { dataIndex: "CODE", title: "行业代码", selected: false },
    { dataIndex: "LONGITUDE", title: "经度", selected: false },
    { dataIndex: "LATITUDE", title: "纬度", selected: false },
    { dataIndex: "CONTACTPERSON", title: "环保联系人", selected: false },
    { dataIndex: "CONTACRNUMBER", title: "联系电话", selected: false },
    { dataIndex: "PARKSITUATION", title: "所在园区情况", selected: false },
    { dataIndex: "REALESTATE", title: "不动产情况", selected: false }
];


// 环境测评table
export const envTestCol = [
    { dataIndex: "project", title: "立项信息" },
    { dataIndex: "approval", title: "审批情况" },
    { dataIndex: "accept", title: "验收批复" },
    { dataIndex: "product", title: "产品信息" },
    { dataIndex: "process", title: "生产工艺信息" },
    { dataIndex: "permit", title: "排污许可证信息" }
];

//环境测评 - 立项信息table
export const projectCol = [
    { dataIndex: "CREATETIME", title: "立项时间", width: '150' },
    { dataIndex: "NAME", title: "项目名称", width: '300' },
    { dataIndex: "CONTETN", title: "项目内容", width: '300' }
];

// 环境测评 - 立项的新增 编辑 查看抽屉字段
export const projectDrawerCol = [
    { propName: "CREATETIME", title: "立项时间", type: 'date', required: true, placeholder: '请输入立项时间' },
    { propName: "NAME", title: "项目名称", type: 'input', required: true, placeholder: '请输入项目名称' },
    { propName: "CONTETN", title: "项目内容", type: 'textarea', required: false, placeholder: '请输入项目内容,最多200字' },
    { propName: "FILEID", title: "立项文件", type: 'upload', required: false, placeholder: '' },
];

// 环境测评 - 审批情况table
export const approvedCol = [
    { dataIndex: "APPROVETIME", title: "获批时间", width: '150' },
    { dataIndex: "NAME", title: "项目名称", width: '300' },
    { dataIndex: "UNIT", title: "编制单位", width: '200' },
    { dataIndex: "APPROVENUM", title: "审批文号", width: '200' }
];

// 环境测评 -  审批情况Drawer
export const approvedDrawerCol = [
    { propName: "APPROVETIME", title: "获批时间", type: 'date', required: true, placeholder: '请输入获批时间' },
    { propName: "NAME", title: "项目名称", type: 'input', required: true, placeholder: '请输入项目名称' },
    { propName: "UNIT", title: "编制单位", type: 'input', required: false, placeholder: '请输入编制单位' },
    { propName: "APPROVENUM", title: "审批文号", type: 'input', required: true, placeholder: '请输入审批文号' },
    { propName: "FILEID", title: "环评批复", type: 'upload', required: false, placeholder: '' },
];


// 环境测评 -  验收批复table
export const acceptCol = [
    { dataIndex: "ACCEPTTIME", title: "验收时间", width: '150' },
    { dataIndex: "NAME", title: "项目名称", width: '400' },
    { dataIndex: "CONTENT", title: "验收内容", width: '300' },
];

// 环境测评 -  验收批复Drawer
export const acceptDrawerCol = [
    { propName: "ACCEPTTIME", title: "验收时间", type: 'date', required: true, placeholder: '请输入验收时间' },
    { propName: "NAME", title: "项目名称", type: 'input', required: true, placeholder: '请输入项目名称' },
    { propName: "CONTENT", title: "验收内容", type: 'textarea', required: false, placeholder: '请输入验收内容, 最多200字' },
    { propName: "FILEID", title: "批复意见", type: 'upload', required: false, placeholder: '' },
];


//环境测评 -  产品信息table
export const productCol = [
    { dataIndex: "NAME", title: "产品名称", width: '500' },
    { dataIndex: "CAPACITY", title: "年产能", width: '400' },
];

// 环境测评 -  产品信息Drawer
export const productDrawerCol = [
    { propName: "NAME", title: "产品名称", type: 'input', required: true, placeholder: '请输入产品名称' },
    { propName: "CAPACITY", title: "年产能", type: 'input', required: true, placeholder: '请输入年产能, 如10台' },

];

// 环境测评 -  生产工艺信息Drawer
export const processDrawerCol = [
    { propName: "NAME", title: "工艺名称", type: 'input', required: true, placeholder: '请输入工艺名称' },
    { propName: "FILEID", title: "工艺图", type: 'uploadImg', required: true, placeholder: '' },
    { propName: "DES", title: "工艺描述", type: 'textarea', required: false, placeholder: '请输入工艺描述, 不超过200字' },
];
