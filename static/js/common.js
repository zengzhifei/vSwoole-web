(function visitorRecord() {
    if (!$.cookie('record_visitor')) {
        $.ajax({
            url: 'https://api.vswoole.com/record/visit',
            type: 'post',
            dataType: 'json',
            success: ($res) => {
                if ($res['status'] === 0) {
                    $.cookie('record_visitor', $res['data']['visitTime']);
                }
            }
        });
    }
})();
