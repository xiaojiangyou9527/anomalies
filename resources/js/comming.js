//提示信息
var _toast;
var _toastTrue;
$.showError = function (text) {
  $('body').append('<div id="toast"><div class="toast_box"><p class="toast_close"><img src="/resources/img/close.png" /></p><p class="toast_img"><img src="/resources/img/unsusscss_icon.png" /></p><p class="toast_word">' + text + '</p></div></div><div class="mark"></div>');
  _toast = $('#toast');
  _toast.show();
  $('.toast_close img').on('click', function () {
    $(this).parents("#toast").next(".mark").remove();
    $(this).parents("#toast").remove();
  });
  // $('.mark').on('click', function () {
  //   $(this).prev("#toast").remove();
  //   $(this).remove();
  // });
};
$.showTrue = function (text) {
  var timers;
  $('body').append('<div id="toast"><div class="toast_box"><p class="toast_close"><img src="/resources/img/close.png" /></p><p class="toast_img"><img src="/resources/img/susscss.png" /></p><p class="toast_word">' + text + '</p></div></div><div class="mark"></div>');
  _toastTrue = $('#toast');
  if(timers) clearTimeout(timers);
  _toastTrue.show();
  timers = setTimeout(hide, 2000);
};
//提示信息，重新加载页面
var _toast_reload;
$.showErrorReload = function (text) {
  $('body').append('<div id="toast">' + '<div class="toast_box">' + '<p class="toast_close">' + '<img src="/resources/img/close.png" /></p>' + '<p class="toast_img"><img src="/resources/img/warn_circle.png" /></p>' + '<p class="toast_word">' + text + '</p></div></div>' + '<div class="mark"></div>');
  _toast_reload = $('#toast');
  _toast_reload.show();
  $('.mark,.toast_close img').on('click', function () {
    $(this).parents("#toast").remove();
    $('.mark').remove();
    document.location.reload();
  });
};
/*
* 加载中
* loading.show()展示
* loading.hide()隐藏
*/
var Loading = function Loading() {
  this.show = function () {
  $('body').append($('<div class="loadingImg">').append(
    $('<div id="vue-loading" style="position: fixed;top: 0;right: 0;bottom:0;left: 0;z-index: 1000;display: flex;justify-content: center;align-items: center;padding-bottom: 120px;background: rgba(0,0,0,.08);"><img src="/resources/img/loading.gif" style="height: 50px"></div>'))).append('<div class="pop_layer_transpernt"></div>');
  }, 
  this.hide = function () {
    $('.loadingImg, .pop_layer_transpernt').remove();
  };
};
var loading = new Loading();
//获取sessionStorage中的token信息
var getToken = function getToken() {
  return getProp('token');
};
//设置sessionStorage中的token信息
var setToken = function setToken(token) {
  if (!token) return
  var token = token.replace(/(\n)/g, "");
  setProp('token', token);
};
//检查sessionStorage中是否有token信息
var checkToken = function checkToken() {
  var token = getToken();
  if(!token){
    return false;
  }else{
    return true;
  }
};
//清除sessionStorage
var removeProp = function removeProp(name) {
  if(window.sessionStorage){
    window.sessionStorage.removeItem(name);
  }else{
    Cookies.remove(name);
  }
};

//获取sessionStorage
var getProp = function getProp(name) {
  var value;
  if(window.sessionStorage){
    value = window.sessionStorage.getItem(name);
  }else{
    value = Cookies.get(name);
  }
  return value;
};
var timestampFormat = function timestampFormat (timestamp, format)  {
  var result = ''
  timestamp = window.parseInt(timestamp, 10)
  if (!timestamp) {
    result = '-'
  } else if (format === 'interval') {
    var diff = (now - timestamp) / 1000
    if (diff < 60) {
      // 一分钟内
      result = '刚刚'
    } else if ((diff < 60 * 60) && (diff >= 60)) {
      // 超过十分钟少于1小时
      result = Math.floor(diff / 60) + '分钟前'
    } else if ((diff < 60 * 60 * 24) && (diff >= 60 * 60)) {
      // 超过1小时少于24小时
      result = Math.floor(diff / 60 / 60) + '小时前'
    } else if ((diff < 60 * 60 * 24 * 3) && (diff >= 60 * 60 * 24)) {
      // 超过1天少于3天内
      return Math.floor(diff / 60 / 60 / 24) + '天前'
    } else {
      // 超过3天
      result = moment(timestamp).format('YYYY.MM.DD HH:mm')
    }
  } else if (format) {
    result = moment(timestamp).format(format)
  } else {
    result = moment(timestamp).format('YYYY.MM.DD HH:mm:ss')
  }
  return result
}
//设置sessionStorage
var setProp = function setProp(name, value) {
  if(window.sessionStorage){
      window.sessionStorage.setItem(name, value);
  }else{
      Cookies.set(name, value);
  }
};

/*
  * 验证字符串是否是整数串
  * sText String
  * return Boolen
*/
var isNumeric = function isNumeric(sText) {
  var ValidChars = "0123456789";
  var IsNumber = true;
  var Char;
  if (isNaN(sText)) {
    IsNumber = false;
  } else {
    for (var i = 0; i < sText.length && IsNumber == true; i++) {
      Char = sText.charAt(i);
      if (ValidChars.indexOf(Char) == -1) {
        IsNumber = false;
      }
    }
    if (String(parseInt(sText)).length < String(sText).length) {
      IsNumber = false;
    }
  }
  return IsNumber;
};
// 请求出理
var interUrl = 'https://fsp.yillionbank.com:16630/api/';
$.ajaxSetup({
  timeout: 300000,
  processData: false,
  crossDomain: true,
  formDate: 'b',
  beforeSend: function beforeSend() {
    if (this.formDate == 'a') {
        this.contentType = 'multipart/form-data; charset=UTF-8;';
    } else if (this.formDate == 'b') {
        this.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    if (this.formatUrl != false) {
      this.url = interUrl + this.url;
      var TRANS_CODE = this.url.split("api/")[1];
      var headerData = {
        "TRANS_CODE": TRANS_CODE,
        "SDKType": "H5",
        "tokenType": "Once",
        "appAccessToken": ""
      };
      if(getToken() == null){
        headerData.appAccessToken = getProp("appAccessToken");
      }else{
        headerData.appAccessToken = getToken();
      }
      var formdata = this.data;
      this.data = headerData;
      this.data.data = formdata;
      console.log(this.data);
    } else {
      if (this.url.indexOf('face') != -1) {
        this.url = this.url;
      }
      this.url = interUrl + this.url;
    }
    if (this.encryptData != false && this.data) {
      var json = JSON.stringify(this.data);
      var params = {};
      var K1 = btoa(dx.encrypt(json));
      var K2 = md5(K1 + K1.slice(0, 2) + K1.charAt(K1.length / 2) + K1.slice(-2));
      params.K1 = K1;
      params.K2 = K2;
      this.data = JSON.stringify(params);
    }
  },
  dataFilter: function dataFilter(data) {
    if (this.encryptData != false) {
      data = $.isPlainObject(data) ? data : $.parseJSON(data);
      
      if (!data.status && data.K1) {
        var K1 = data.K1;
        var K2 = data.K2;
        var sign = md5(K1 + K1.slice(0, 2) + K1.charAt(K1.length / 2) + K1.slice(-2));
        if (K2 == sign) {
          data = dx.decrypt(atob(K1));
          console.log(JSON.parse(data));
          setToken(JSON.parse(data).data.appAccessToken);
          return data;
        }
        return null
      } else {
        console.log(data)
      }
    }
    return data;
  },
  error: function error(xhr, status, _error) {
    loading.hide();
    $.showError('系统繁忙，请稍候重试');
  }
});

var ajax = {
  post: function (url, data, callback, complete) {
    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      dataType: 'json',
      success: function (res) {
        callback && callback(res);
      }
    })
  },
  get: function (url, callback) {
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: function (res) {
        callback && callback(res);
      }
    })
  }
};
