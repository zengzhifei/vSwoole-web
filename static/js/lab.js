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
                //url: './static/video/DA3501626B1EFC2FFF2C7F23AD483BDB.mp4',
                url: 'http://hc.yinyuetai.com/uploads/videos/common/DA3501626B1EFC2FFF2C7F23AD483BDB.mp4',
            }
        };
    },
    mounted: function () {
        this.$nextTick(function () {
            this.initMPlayer();
            this.operateWebSocket();
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

                        let get_online_data = {
                            'cmd': 'online',
                        };
                        ws.send(JSON.stringify(get_online_data));
                        setInterval(() => {
                            ws.send(JSON.stringify(get_online_data));
                        }, 60000);
                    },
                    onMessage: (ws, res) => {
                        res = JSON.parse(res);
                        console.log(res);
                        if (res.type === 'message') {
                            let data = res.data;
			    if (typeof data !== 'object') {
			   	data = {chat_user: '系统消息', chat_content: data};
			    }
                            this.WebSocketChatList.push(data);
                            this.$nextTick(function () {
                                this.$refs['WebSocket-chat-box'].scrollTop = this.$refs['WebSocket-chat-box'].scrollHeight;
                            });
                        } else if (res.type === 'online') {
                            let data = res.data;
                            let online_data = {chat_user: '在线小助手', chat_content: '当前有' + data + '人和你同时在线哦，快和他们聊聊吧～'};
                            this.WebSocketChatList.push(online_data);
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
                    //poster: './static/img/1.jpg',
                    preload: true,
                    loop: true
                },
                controls: {
                    defaultDanmakuSwitch: false
                }
            });
            setInterval(() => {
                this.$options.mPlayer.getDanmakuStatus() && this.$options.mPlayer.addDanmaku(this.getDanmakuList());
            }, 1000);
        },
        getDanmakuList: function () {
            let danmakuText = [
                    '闻说双溪春尚好，也拟泛轻舟。只恐双溪舴艋舟，载不动许多愁。',
                    '梧桐更兼细雨，到黄昏、点点滴滴。这次第，怎一个愁字了得！',
                    '花自飘零水自流。一种相思，两处闲愁。此情无计可消除，才下眉头，却上心头。',
                    '红藕香残玉簟秋。轻解罗裳，独上兰舟。云中谁寄锦书来，雁字回时，月满西楼。',
                    '今年海角天涯，萧萧两鬓生华。看取晚来风势，故应难看梅花。',
                    '天上星河转，人间帘幕垂。凉生枕簟泪痕滋。起解罗衣聊问、夜何其。',
                    '更好明光宫殿，几枝先近日边匀。金尊倒，拚了尽烛，不管黄昏。',
                    '记取楼前绿水，应念我、终日凝眸。凝眸处，从今更数，几段新愁。',
                    '草际鸣蛩。惊落梧桐。正人间、天上愁浓。云阶月地，关锁千重。纵浮槎来，浮槎去，不相逢。',
                ],
                danmakuName = ['李清照'],
                danmakuList = [];

            for (let i = 0, max = Math.floor(Math.random() * 10); i <= max; i++) {
                let j = Math.floor(Math.random() * danmakuText.length);
                danmakuList.push({
                    img: './static/img/1.jpg',
                    name: danmakuName[0],
                    text: danmakuText[j]
                });
            }
            return danmakuList;
        }
    }
});
