new Vue({
    el: '#vSwoole-download-root',
    data: {
        DownloadList: []
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getDownloadList();
        });
    },
    methods: {
        getDownloadList: function () {
            $.ajax({
                url: 'https://api.vswoole.com/download/getDownloadList',
                type: 'post',
                dataType: 'json',
                success: (res) => {
                    if (res.status === 0) {
                        this.DownloadList = res['data']['downloadList'];
                    }
                }
            });
        },
        downloadRecord: function (index, version) {
            $.ajax({
                url: 'https://api.vswoole.com/download/recordDownload',
                type: 'post',
                data: {downloadVersion: version},
                dataType: 'json',
                success: (res) => {
                    if (res.status === 0) {
                        this.DownloadList[index]['download_count']++;
                    }
                }
            });
        },
    }
});