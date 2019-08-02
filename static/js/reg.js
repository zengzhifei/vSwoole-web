new Vue({
    el: '#vSwoole-reg-root',
    data: {
        User: {
            user_email: '',
            user_code: '',
            user_password: '',
            user_repassword: '',
        },
        reg_enabled: false,
        reg_code_text: '获取邮箱验证码',
        reg_code_countdown: 60,
    },
    methods: {
        checkReg: function () {
            this.reg_enabled = this.User.user_email && this.User.user_code && this.User.user_password && this.User.user_repassword && (this.User.user_password === this.User.user_repassword);
        },
        getEmailCode: function () {
            if (this.timer) {
                return false;
            }

            if (this.User.user_email === '') {
                alert('请先输入邮箱');
                return false;
            }

            this.timer = setInterval(() => {
                if (!this.reg_code_countdown--) {
                    this.reg_code_text = '获取邮箱验证码';
                    clearInterval(this.timer);
                } else {
                    this.reg_code_text = '请您等待' + this.reg_code_countdown + '秒';
                }
            }, 1000);

            $.ajax({
                url: 'https://api.vswoole.com/SignUp/sendEmailCode',
                type: 'post',
                data: {email: this.User.user_email},
                dataType: 'json',
            });
        }
        ,
        submitReg: function () {
            $.ajax({
                url: 'https://api.vswoole.com/signUp/submit',
                type: 'post',
                data: {
                    email: this.User.user_email,
                    emailCode: this.User.user_code,
                    password: this.User.user_password,
                    repassword: this.User.user_repassword
                },
                dataType: 'json',
                success: function (res) {
                    if (res.status === 0) {

                    }
                }
            });
        }
    }
});