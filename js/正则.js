

 : rules = "[ { required: true, message: '请填写加班时长', trigger: 'blur' } ,
{ pattern: /^\+?[1-9][0-9]*$/, message: '必须为正整数' } ]"

{ pattern: /^(([1-9])|(1\d)|(2[0-4]))$/, message: '须为小于24的正整数' }
{ pattern: /^\+?[1-8]$/, message: '须为小于8的正整数' }

{ pattern: /^(\d{1}|10)$/, message: '只能输入 0 ~ 10 的数字', trigger: 'blur' }

{ pattern: /^\d+\.{0,1}\d{0,1}$/, message: '须为整数或1位小数', trigger: 'blur' }
{ pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' }

let reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{6,}$/; callback(new Error("密码须包含数字、大小写字母和特殊字符"));