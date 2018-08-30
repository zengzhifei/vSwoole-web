//格式化显示长度
Vue.filter('formatShowLength', function (value, length = 4, replace = '...', defaultShow = '...') {
    return value ? (value.length >= length ? value.substr(0, length) + replace : value) : defaultShow;
});
//格式化显示数字
Vue.filter('formatShowNumber', function (value, size = 10000, hold = 2, unit = '万') {
    return value ? (value >= size ? (value / size).toFixed(hold) + unit : value) : 0;
});
//数字转字母
Vue.filter('numberToLetter', function (value, uppercase = true) {
    value = uppercase ? value + 65 : value + 97;
    return (value >= 65 && value <= 90) || (value >= 97 && value <= 122) ? String.fromCharCode(value) : value;
});
//宫格横线转换
Vue.filter('formatSquareLine', function (value) {
    return value ? value.replace(/_/g, "<em><i></i></em>") : value;
});
//格式化显示毫秒
Vue.filter('formatShowMillisecond', function (value, hold = 3) {
    return value ? (value / 1000).toFixed(hold).toString().replace('.', '″') : value;
});