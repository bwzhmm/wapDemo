

// 数组中按对象某属性排序
let sortRes = res.sort(this.compare("CODE"));
compare(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    };
}

// 监听事件
changeSort(column) {
    console.log(column);
    //获取字段名称和排序类型
    var fieldName = column.prop;
    var sortingType = column.order;
    //如果字段名称为“创建时间”，将“创建时间”转换为时间戳，才能进行大小比较
    //   if(fieldName=="createTime"){
    //     this.tableData.map(item => {
    //          item.createTime = this.$moment(item.createTime).valueOf();
    //     });
    //  }

    //按照降序排序
    if (sortingType == "descending") {
        this.tableData = this.tableData.sort(
            (a, b) => b[fieldName] - a[fieldName]
        );
    }
    //按照升序排序
    else {
        this.tableData = this.tableData.sort(
            (a, b) => a[fieldName] - b[fieldName]
        );
    }
    //如果字段名称为“创建时间”，将时间戳格式的“创建时间”再转换为时间格式
    //   if(fieldName=="createTime"){
    //     this.tableData.map(item => {
    //         item.createTime = this.$moment(item.createTime).format(
    //              "YYYY-MM-DD HH:mm:ss"
    //         );
    //     });
    // }

    console.log(this.tableData);
},