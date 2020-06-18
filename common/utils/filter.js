import Vue from 'vue';

// 格式化手机号码 将 1322222222 转化为 13****2222
Vue.filter('FormatPhoneNumbere', function (value) {
  // 将 value 转化为 字符串
  value = value + '';
  // 如果为空 则返回空
  if (!value) {
    return '';
  }
  value = value.substr(0, 3) + '****' + value.substr(7, 11);
  return value;
});

export default Vue;
