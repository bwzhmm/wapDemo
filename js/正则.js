

 : rules = "[ { required: true, message: '请填写加班时长', trigger: 'blur' } ,
{ pattern: /^\+?[1-9][0-9]*$/, message: '必须为正整数' } ]"

{ pattern: /^(-[\d]{0,})$|^([\d]|[1][\d]|[2][0-4])$/, message: '须为小于24的正整数' }

{ pattern: /^(\d{1}|10)$/, message: '只能输入 0 ~ 10 的数字', trigger: 'blur' }

{ pattern: /^\d+\.{0,1}\d{0,1}$/, message: '须为整数或1位小数', trigger: 'blur' }