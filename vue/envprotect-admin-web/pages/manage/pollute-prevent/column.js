
// 污染防治table
export const pollutePreventCol = [
    { dataIndex: "water", title: "废水收集及污染防治" },
    { dataIndex: "gas", title: "废气收集及污染防治" },
    { dataIndex: "solid", title: "一般固废及污染防治" },
    { dataIndex: "danger", title: "危险废物及污染防治" },
];

// 废水 - 排放口
export const waterVentCol = [
    { dataIndex: "NUM", title: "排放口编号", },
    { dataIndex: "NAME", title: "排放口名称" },
    { dataIndex: "POSITION", title: "排放口位置" },
    { dataIndex: "REGULAR", title: "排放规律", },
    { dataIndex: "factor", title: "污染物因子" },
    { dataIndex: "YIELD", title: "产生量（t/a）" }
];

// 废水 - 排放口新增 编辑 抽屉字段
export const waterVentDrawerCol = [
    { propName: "NUM", title: "排放口编号", type: 'input', required: false, placeholder: '' },
    { propName: "NAME", title: "排放口名称", type: 'input', required: true, placeholder: '请输入排放口名称' },
    { propName: "POSITION", title: "排放口位置", type: 'input', required: true, placeholder: '请输入排放口位置' },
    { propName: "REGULAR", title: "排放规律", type: 'select', required: true, placeholder: '', options: ['稳定连续排放', '周期性连续排放', '不规律连续排放', '有规律间断排放', '不规律间断排放'] },
    { propName: "YIELD", title: "产生量", type: 'number', required: true, placeholder: '', suffix: "t/a" },
    { propName: "ENV_WWPOLLFACTOR#HOLEID", title: "污染物因子", type: 'factor', required: false, placeholder: '' },
];

// 废水 - 治理设施
export const waterGovernCol = [
    { dataIndex: "NUM", title: "治理设施编号", },
    { dataIndex: "NAME", title: "治理设施名称" },
    { dataIndex: "CRAFTS", title: "治理设施工艺" },
    { dataIndex: "INFO", title: "其他信息", },
];

// 废水 - 治理设施新增 编辑 抽屉字段
export const waterGovernDrawerCol = [
    { propName: "NUM", title: "治理设施编号", type: 'input', required: false, placeholder: '', labelWidth: '150px' },
    { propName: "NAME", title: "治理设施名称", type: 'input', required: true, placeholder: '请输入治理设施名称', labelWidth: '150px' },
    { propName: "CRAFTS", title: "治理设施工艺", type: 'input', required: true, placeholder: '请输入治理设施工艺', labelWidth: '150px' },
    { propName: "INFO", title: "其他信息", type: 'textarea', required: false, placeholder: '请输入其他信息, 最多200字', labelWidth: '150px' },
];

// 废水 - 排放信息
export const waterEmissInfoCol = [
    { dataIndex: "NAME", title: "污染物名称" },
    { dataIndex: "DENSITY", title: "排放浓度（mg/L）", },
    { dataIndex: "ANNUAL", title: "年排放量（t/a）" },
    { dataIndex: "DENSITYLIMIT", title: "申请排放浓度限值（mg/L）", },
    { dataIndex: "ANNUALLIMIT", title: "申请年排放量限值（t/a）" },
];

// 废水 -  排放信息 新增 编辑 抽屉字段
export const waterEmissInfoDrawerCol = [
    { propName: "NAME", title: "污染物名称", type: 'input', required: true, placeholder: '', labelWidth: '150px' },
    { propName: "DENSITY", title: "排放浓度", type: 'number', required: false, placeholder: '', suffix: "mg/L", labelWidth: '150px' },
    { propName: "ANNUAL", title: "年排放量", type: 'number', required: false, placeholder: '', suffix: "t/a", labelWidth: '150px' },
    { propName: "DENSITYLIMIT", title: "申请排放浓度限值", type: 'number', required: false, placeholder: '', suffix: "mg/L", labelWidth: '150px' },
    { propName: "ANNUALLIMIT", title: "申请年排放量限值", type: 'number', required: false, placeholder: '', suffix: "t/a", labelWidth: '150px' },
];

// 废气 - 排放口
export const gasVentCol = [
    { dataIndex: "NUM", title: "排放口编号", },
    { dataIndex: "NAME", title: "排放口名称" },
    { dataIndex: "POSITION", title: "排放口位置" },
    { dataIndex: "REGULAR", title: "排放规律", },
    { dataIndex: "factor", title: "污染物因子" },
    { dataIndex: "YIELD", title: "产生量（t/a）" }
];

// 废气 - 排放口新增 编辑 抽屉字段
export const gasVentDrawerCol = [
    { propName: "NUM", title: "排放口编号", type: 'input', required: false, placeholder: '' },
    { propName: "NAME", title: "排放口名称", type: 'input', required: true, placeholder: '请输入排放口名称' },
    { propName: "POSITION", title: "排放口位置", type: 'input', required: true, placeholder: '请输入排放口位置' },
    { propName: "REGULAR", title: "排放规律", type: 'select', required: true, placeholder: '', options: ['稳定连续排放', '周期性连续排放', '不规律连续排放', '有规律间断排放', '不规律间断排放'] },
    { propName: "YIELD", title: "产生量", type: 'number', required: true, placeholder: '', suffix: "t/a" },
    { propName: "ENV_EGPOLLFACTOR#HOLEID", title: "污染物因子", type: 'factor', required: false, placeholder: '' },
];
// 废气 - 排放口 无组织
export const ventNoGroupCol = [
    { dataIndex: "POLLNAME", title: "污染物名称" },
    { dataIndex: "POLLPOSITION", title: "污染物产生位置" },
    { dataIndex: "REGULAR", title: "排放规律", },
    { dataIndex: "factor", title: "污染物因子" },
    { dataIndex: "YIELD", title: "产生量（t/a）" }
];

// 废气 - 排放口新增 编辑 抽屉字段 无组织
export const ventDrawerNoGroupCol = [
    { propName: "POLLNAME", title: "污染物名称", type: 'input', required: true, placeholder: '请输入污染物名称', labelWidth: '150px' },
    { propName: "POLLPOSITION", title: "污染物产生位置", type: 'input', required: true, placeholder: '请输入污染物产生位置', labelWidth: '150px' },
    { propName: "REGULAR", title: "排放规律", type: 'select', required: true, placeholder: '', options: ['稳定连续排放', '周期性连续排放', '不规律连续排放', '有规律间断排放', '不规律间断排放'], labelWidth: '150px' },
    { propName: "YIELD", title: "产生量", type: 'number', required: true, placeholder: '', suffix: "t/a", labelWidth: '150px' },
    { propName: "ENV_EGPOLLFACTOR#HOLEID", title: "污染物因子", type: 'factor', required: false, placeholder: '', labelWidth: '150px' },
];

// 废气 - 有组织 排放信息
export const orgEmissInfoCol = [
    { dataIndex: "NAME", title: "污染物名称" },
    { dataIndex: "DENSITY", title: "排放浓度（mg/m³）", },
    { dataIndex: "ANNUAL", title: "年排放量（t/a）" },
    { dataIndex: "RATE", title: "排放速率（kg/h）", },
    { dataIndex: "MAXDENSITY", title: "最高允许排放浓度（mg/m³）", },
    { dataIndex: "MAXRATE", title: "最高允许排放速率（kg/h）" },
];

// 废气 - 有组织 排放信息 新增 编辑 抽屉字段
export const orgEmissInfoDrawerCol = [
    { propName: "NAME", title: "污染物名称", type: 'input', required: true, placeholder: '', labelWidth: '150px' },
    { propName: "DENSITY", title: "排放浓度", type: 'number', required: false, placeholder: '', suffix: "mg/m³", labelWidth: '150px' },
    { propName: "ANNUAL", title: "年排放量", type: 'number', required: false, placeholder: '', suffix: "t/a", labelWidth: '150px' },
    { propName: "RATE", title: "排放速率", type: 'number', required: false, placeholder: '', suffix: "kg/h", labelWidth: '150px' },
    { propName: "MAXDENSITY", title: "最高允许排放浓度", type: 'number', required: false, placeholder: '', suffix: "mg/m³", labelWidth: '150px' },
    { propName: "MAXRATE", title: "最高允许排放速率", type: 'number', required: false, placeholder: '', suffix: "kg/h", labelWidth: '150px' },
];

// 废气 - 无组织 排放信息
export const unorgEmissInfoCol = [
    { dataIndex: "NAME", title: "污染物名称" },
    { dataIndex: "FACTORYVALUE", title: "厂界浓度监测值（mg/m³）", },
    { dataIndex: "MAXOUTSIDE", title: "外浓度最高点限值（mg/m³）" },

];

// 废气 - 无组织 排放信息 新增 编辑 抽屉字段
export const unorgEmissInfoDrawerCol = [
    { propName: "NAME", title: "污染物名称", type: 'input', required: true, placeholder: '', labelWidth: '180px' },
    { propName: "FACTORYVALUE", title: "厂界浓度监测值", type: 'number', required: false, placeholder: '', suffix: "mg/m³", labelWidth: '180px' },
    { propName: "MAXOUTSIDE", title: "周界外浓度最高点限值", type: 'number', required: false, placeholder: '', suffix: "mg/m³", labelWidth: '180px' },
];


// 固废 -  废物信息
export const solidWasteCol = [
    { dataIndex: "CATEGORY", title: "废物类别" },
    { dataIndex: "NAME", title: "废物名称" },
    { dataIndex: "SOURCE", title: "产废来源" },
    { dataIndex: "SHAPE", title: "废物形态" },
    { dataIndex: "factor", title: "污染物因子" },
    { dataIndex: "YIELD", title: "产生量（t/a）" },
    { dataIndex: "file", title: "产废去向" },

];

// 固废 -  废物信息 新增 编辑 抽屉字段
export const solidWasteDrawerCol = [
    { propName: "CATEGORY", title: "废物类别", type: 'select-remote', required: true, placeholder: '', DICTID: "d21098cd2128421eaa9e29cac501c1a0" },
    { propName: "NAME", title: "废物名称", type: 'input', required: true, placeholder: '', },
    { propName: "SOURCE", title: "产废来源", type: 'input', required: true, placeholder: '', },
    { propName: "SHAPE", title: "废物形态", type: 'select', required: true, placeholder: '', options: ['固态', '半固态', '液态', '气态'] },
    { propName: "YIELD", title: "产生量", type: 'number', required: true, placeholder: '', suffix: "t/a" },
    { propName: "ENV_SWPOLLFACTOR#INFOID", title: "污染物因子", type: 'factor', required: false, placeholder: '' },
    { propName: "file", title: "产废去向", type: 'upload', required: false, placeholder: '', },

];

// 危险 -  废物信息
export const dangerWasteCol = [
    { dataIndex: "CATEGORY", title: "废物类别" },
    { dataIndex: "NAME", title: "废物名称" },
    { dataIndex: "EDCODE", title: "八位码" },
    { dataIndex: "SOURCE", title: "产废来源" },
    { dataIndex: "SHAPE", title: "废物形态" },
    { dataIndex: "factor", title: "污染物因子" },
    { dataIndex: "YIELD", title: "产生量（t/a）" },
    { dataIndex: "file", title: "产废去向" },

];

// 危险 -  废物信息 新增 编辑 抽屉字段
export const dangerWasteDrawerCol = [
    { propName: "CATEGORY", title: "废物类别", type: 'select-remote', required: true, placeholder: '', DICTID: "d21098cd2128421eaa9e29cac501c1a0" },
    { propName: "NAME", title: "废物名称", type: 'input', required: true, placeholder: '', },
    { propName: "EDCODE", title: "八位码", type: 'input', required: true, placeholder: '', },
    { propName: "SOURCE", title: "产废来源", type: 'input', required: true, placeholder: '', },
    { propName: "SHAPE", title: "废物形态", type: 'select', required: true, placeholder: '', options: ['固态', '半固态', '液态', '气态'] },
    { propName: "YIELD", title: "产生量", type: 'number', required: true, placeholder: '', suffix: "t/a" },
    { propName: "ENV_DPPOLLFACTOR#INFOID", title: "污染物因子", type: 'factor', required: false, placeholder: '' },
    { propName: "file", title: "产废去向", type: 'upload', required: false, placeholder: '', },

];
// 放置点 信息
export const placePointCol = [
    { dataIndex: "NUM", title: "放置站点编号" },
    { dataIndex: "NAME", title: "放置站点名称" },
    { dataIndex: "POSITION", title: "放置站点位置" },
    { dataIndex: "FOOTPRINT", title: "占地面积（m³）" },
    { dataIndex: "STORAGEMETHOD", title: "贮存方式" },
    { dataIndex: "STORAGECAPACITY", title: "贮存能力（t）" },
    { dataIndex: "STORAGECYCLE", title: "贮存周期" },

];

// 放置点 信息 新增 编辑 抽屉字段
export const placePointDrawerCol = [
    { propName: "NUM", title: "放置站点编号", type: 'input', required: false, placeholder: '', labelWidth: '150px' },
    { propName: "NAME", title: "放置站点名称", type: 'input', required: true, placeholder: '', labelWidth: '150px' },
    { propName: "POSITION", title: "放置站点位置", type: 'input', required: true, placeholder: '', labelWidth: '150px' },
    { propName: "FOOTPRINT", title: "占地面积", type: 'number', required: true, placeholder: '', suffix: "m³", labelWidth: '150px' },
    { propName: "STORAGEMETHOD", title: "贮存方式", type: 'input', required: false, placeholder: '', labelWidth: '150px' },
    { propName: "STORAGECAPACITY", title: "贮存能力", type: 'number', required: false, placeholder: '', suffix: "t", labelWidth: '150px' },
    { propName: "STORAGECYCLE", title: "贮存周期", type: 'input', required: false, placeholder: '', labelWidth: '150px' },
];
