/**
 * webSocket 客户端
 *
 * 调用方式：var ws = new WS(wsServer,options);
 * @param [string] wsServer:webSocket服务器地址
 * @param [object] options:webSocket客户端配置
 * {is_log:是否记录日志(默认：true),
 *  auto_connect:'是否断线自动重连(默认：true)',
 *  auto_connect_times:'断线重连次数(默认：10)',
 *  is_heart_check: '是否启用心跳检测(默认：true)',
 *  heartbeat_check_interval:'心跳频率(默认：5s)',
 *  heartbeat_data:'心跳包(默认：{cmd:ping})',
 * 	onOpen:'连接成功回调函数(应用初始化：非必传)',
 *  onMessage:'收到服务器消息回调函数(应用逻辑处理：非必传)',
 *  onClose:'客户端主动断开服务器回调函数(非必传)'，
 *  onError：'服务器异常回调函数(非必传)'
 * }
 *
 * zengzhifei
 * 2018.3.5
 */

var WS = function (wsServer, options) {
    try {
        if (false === "WebSocket" in window) {
            throw '当前浏览器不支持WebSocket';
        }
        if (wsServer == null || wsServer == undefined || wsServer == '' || typeof wsServer !== 'string') {
            throw '缺少WebSocket地址，或地址格式错误[wsServer]';
        }

        var _options = {
            is_log: true,
            auto_connect: true,
            auto_connect_times: 10,
            is_heart_check: true,
            heartbeat_check_interval: 5,
            heartbeat_data: JSON.stringify({cmd: 'ping'}),
            onOpen: function () {
            },
            onMessage: function () {
            },
            onClose: function () {
            },
            onError: function () {
            }
        };
        Object.assign(_options, options);

        var _log = function (log) {
            if (_options.is_log) {
                console.log('[' + _getTime() + '] ' + log);
            }
        };

        var _getTime = function () {
            var date = new Date();
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        var _init = function () {
            var webSocket = new WebSocket(wsServer);

            webSocket.onopen = function () {
                if (webSocket.readyState == 1) {
                    _log('WebSocket 连接成功');
                    _options.onOpen(webSocket);
                }
            };

            webSocket.onmessage = function (evt) {
                _options.onMessage(webSocket, evt.data);
            };

            webSocket.onclose = function (evt) {
                _log('WebSocket 连接关闭');
                _options.onClose(webSocket, evt);
                if (_options.auto_connect) {
                    if (_options.auto_connect_times < 0) {
                        _init();
                    } else if (_options.auto_connect_times-- > 0) {
                        _init();
                    }
                }
            };

            webSocket.onerror = function (evt, e) {
                _log('WebSocket 通信异常');
                _options.onError(webSocket, e);
            };

            var heartCheck = function () {
                if (_options.is_heart_check) {
                    setInterval(function () {
                        webSocket.readyState == 1 && webSocket.send(_options.heartbeat_data);
                    }, 1000 * _options.heartbeat_check_interval);
                }
            }();

            return webSocket;
        };

        return _init();

    } catch (e) {
        throw new Error(e);
    }
}