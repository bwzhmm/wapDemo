

//兼容 IE下的placeholder的显示问题
placeholderTip: function (obj, colorTip, colorTxt, tips) {
  colorTip = colorTip || '#aaaaaa';
  colorTxt = colorTxt || '#666666';
  obj.each(function () {
    var _this = $(this);

    if (tips) _this.attr("placeholder", tips);
    _this.css({ "color": colorTip });
    if ($.trim(_this.val()) == "") {
      _this.val(_this.attr("placeholder"));
    } else if (_this.val() != _this.attr("placeholder")) {
      _this.css({ "color": colorTxt });
    }
  });
  obj.on("focus", function () {
    var _this = $(this);
    var value = _this.val();
    if (value == _this.attr("placeholder")) {
      _this.val("");
    }
    _this.css({ "color": colorTxt });

  });
  obj.on("blur", function () {
    var _this = $(this);
    var value = _this.val();
    if ($.trim(value) == "") {
      _this.val($(this).attr("placeholder")).css({ "color": colorTip });
    }
  });
  obj.parents("form").on("submit", function () {
    obj.each(function () {
      var _this = $(this);
      if (_this.val() == _this.attr("placeholder")) {
        _this.val("");
      }
    });
  });
}

//年 月日时分秒
formartTime：function(time, format) {
  if (!time) return '';
  var currentT = new Date(time);
  var timetranfer = function (i) { return (i < 10 ? '0' : '') + i };
  return formartTime.replace(/YYYY|MM|DD|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'YYYY':
        return timetranfer(currentT.getFullYear());
        break;
      case 'MM':
        return timetranfer(currentT.getMonth() + 1);
        break;
      case 'DD':
        return timetranfer(currentT.getDate());
        break;
      case 'HH':
        return timetranfer(currentT.getHours());
        break;
      case 'mm':
        return timetranfer(currentT.getMinutes());
        break;
      case 'ss':
        return timetranfer(currentT.getSeconds());
        break;
    }
  })
}