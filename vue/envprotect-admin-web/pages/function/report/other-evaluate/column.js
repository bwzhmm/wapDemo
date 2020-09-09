
// 其他测评table
export const otherTestCol = [
    { dataIndex: "emergency", title: "环境应急" },
    { dataIndex: "clear", title: "清洁生产" },
    { dataIndex: "info", title: "信息公开" },
    { dataIndex: "devops", title: "第三方运维" },
];

// 环境应急
export const emergCol = [
    { dataIndex: "CREATETIME", title: "突发环境事件应急预案编制时间", align: 'left', },
    { dataIndex: "DEPT", title: "备案部门", align: 'left' },
    { dataIndex: "EXPIRATIONDATE", title: "有效期至", align: 'left' },
    { dataIndex: "ISExpire", title: "是否有效期内", align: 'center', headerAlign: 'center' },
];

// 环境应急 - 新增 编辑 抽屉字段
export const emergDrawerCol = [
    { propName: "CREATETIME", title: "突发环境事件应急预案编制时间", type: 'date', required: true, placeholder: '', labelWidth: '235px', labelPosition: "top" },
    { propName: "DEPT", title: "备案部门", type: 'input', required: false, placeholder: '请输入备案部门', labelWidth: '235px', labelPosition: "top" },
    { propName: "EXPIRATIONDATE", title: "有效期至", type: 'date', required: true, placeholder: '请选择有效期', labelWidth: '235px', labelPosition: "top" },
];

//清洁生产 编辑的table
export const cleanCol = [
    { dataIndex: "ISCLEAN", title: "纳入强制清洁生产企业名单", type: 'select', options: ['是', '否'], align: 'center', headerAlign: 'center' },
    { dataIndex: "ISPASS", title: "通过清洁生产审核", type: 'select', options: ['是', '否'], align: 'center', headerAlign: 'center' },
    { dataIndex: "EXPIRATIONDATE", title: "有效期至", type: 'date', align: 'left' },
    { dataIndex: "ISExpire", title: "是否有效期内", type: 'string', align: 'center', headerAlign: 'center' },
];

//信息公开 编辑的table
export const infoCol = [
    { dataIndex: "PUBLIC", title: "公开项", type: 'string', align: 'left' },
    { dataIndex: "ISIMPL", title: "是否落实信息公开要求", type: 'select', options: ['是', '否'], align: 'center', headerAlign: 'center' },
    { dataIndex: "INFOPLATFORM", title: "信息公开平台", type: 'input', align: 'left' },
    { dataIndex: "PUBLICTIME", title: "公开时间", type: 'date', align: 'left' },
];

// 第三方运维
export const thirdCol = [
    { dataIndex: "NAME", title: "运维方名称", align: 'left' },
    { dataIndex: "file", title: "资质", align: 'left' },
    { dataIndex: "CONTENT", title: "服务内容", align: 'left' },
    { dataIndex: "rangeTime", title: "服务周期", align: 'left' },
];

// 第三方运维 - 新增 编辑 抽屉字段
export const thirdDrawerCol = [
    { propName: "NAME", title: "运维方名称", type: 'input', required: true, placeholder: '请输入运维方名称', },
    { propName: "CONTENT", title: "服务内容", type: 'input', required: true, placeholder: '请输入服务内容', },
    { propName: "RANGETIME", title: "服务周期", type: 'daterange', required: true, placeholder: '', },
    { propName: "file", title: "资质", type: 'uploadImg', required: false, placeholder: '', },

];


