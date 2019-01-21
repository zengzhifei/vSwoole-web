//20190121
new Vue({
    el: '#vSwoole-lab-root',
    data: {
        WebSocket: {
            user_id: 0
        },
        WebSocketConnectStatus: 0,
        WebSocketChatList: [
            {chat_user: '系统提示', chat_content: '建立连接后，可以和在线小伙伴聊天哦，系统不会记录聊天数据。'},
        ]
    },
    created: function () {
        this.$options.configs = {
            WebSocket: {
                url: 'wss://server.vswoole.com/ws',
                range_id: 'vswoole-web-lab-test',
            },
            MPlayer: {
                //url: 'http://223.110.245.147/ott.js.chinamobile.com/PLTV/3/224/3221226799/index.m3u8'
                url: './static/mp4/1.mp4',
            }
        };
    },
    mounted: function () {
        this.$nextTick(function () {
            this.initMPlayer();
        });
    },
    computed: {},
    methods: {
        operateWebSocket: function () {
            if (this.WebSocketConnectStatus) {
                this.$options.WebSocketHandler.close();
            } else {
                this.$options.WebSocketHandler = new WS(this.$options.configs.WebSocket.url, {
                    auto_connect: false,
                    onOpen: (ws) => {
                        this.WebSocketConnectStatus = 1;
                        this.WebSocket.user_id = (new Date()).getTime();
                        let range_data = {
                            'cmd': 'range',
                            'data': {
                                'range_id': this.$options.configs.WebSocket.range_id,
                                'user_id': this.WebSocket.user_id
                            }
                        };
                        ws.send(JSON.stringify(range_data));
                    },
                    onMessage: (ws, res) => {
                        res = JSON.parse(res);
                        console.log(res);
                        if (res.type === 'message') {
                            let data = res.data;
                            this.WebSocketChatList.push(data);
                            this.$nextTick(function () {
                                this.$refs['WebSocket-chat-box'].scrollTop = this.$refs['WebSocket-chat-box'].scrollHeight;
                            });
                        }
                    },
                    onClose: (ws) => {
                        this.WebSocketConnectStatus = 0;
                    }
                });
            }
        },
        sendWebSocketChat: function () {
            if (this.WebSocketConnectStatus) {
                if (!this.WebSocket.user_name) {
                    alert('昵称不能为空');
                    return false;
                }
                if (!this.WebSocket.user_chat) {
                    alert('内容不能为空');
                    return false;
                }
                let message_data = {
                    'cmd': 'message',
                    'data': {
                        range_id: this.$options.configs.WebSocket.range_id,
                        message: {
                            user_id: this.WebSocket.user_id,
                            chat_user: this.WebSocket.user_name,
                            chat_content: this.WebSocket.user_chat
                        }
                    }
                };
                this.$options.WebSocketHandler.send(JSON.stringify(message_data));
                this.WebSocket.user_chat = '';
            }
        },
        initMPlayer: function () {
            this.$options.mPlayer = new MPlayer({
                el: '.mPlayer-box',
                video: {
                    src: this.$options.configs.MPlayer.url,
                    poster: './static/img/1.jpg',
                    preload: true,
                    loop: true
                },
            });
            setInterval(() => {
                this.$options.mPlayer.getDanmakuStatus() && this.$options.mPlayer.addDanmaku(this.getDanmakuList());
            }, 1000);
        },
        getDanmakuList: function () {
            let danmakuText = [
                    '你好,陌生人',
                    '你喜欢周杰伦吗',
                    '想听一首周杰伦的歌吗',
                    '这里为你准备了一首周杰伦的MV，点击播放就可以观看了',
                    '怎么样，喜欢吗',
                    '再见，陌生人'
                ],
                danmakuName = ['青花瓷', '半岛铁盒', '夜曲', '印第安老斑鸠', '一点点', '下沙'],
                danmakuList = [];

            for (let i = 0, max = Math.floor(Math.random() * 10); i <= max; i++) {
                let j = Math.floor(Math.random() * danmakuText.length);
                danmakuList.push({
                    img: './static/img/1.jpg',
                    name: danmakuName[j],
                    text: danmakuText[j]
                });
            }
            return danmakuList;
        }
    }
});
