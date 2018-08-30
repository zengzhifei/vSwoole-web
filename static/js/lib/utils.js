//图片预览
Vue.prototype.previewPicture = function ($event) {
    interact.previewPicture($event.target.currentSrc);
};
//对象排序
Vue.prototype.objectToSort = function (sortArray, prop, order = 1) {
    sortArray.sort(function (a, b) {
        return order * (Number(a[prop]) - Number(b[prop]));
    });
};