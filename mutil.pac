// 设置
// config (1: 启用 | 0: 停用)
var config = {
        hosts: 1,
        blackList: 1,
        digitalDomain: 0 // 屏蔽数字域名
};


// 代理主机
var hostsList = [
        {domain:'localhost', ip:'127.0.0.1:80'},
        {domain:'localhost.dev'}
];

// 黑名单
var blackList = [
        {url:'http://12.123.123.12/'},
        {url:'http://bbs.xxxx.com/ad/'},
        {url:'http://www.xxxx.com/guanggao/'},
        {domain:'xxx.cn'},
        {domain:'xxx.net'},
        {domain:'g.163.com'},
];

// 白名单
var whiteList = [
        'xxx.cn',
        '163.com',
        '12306.cn',
];


function FindProxyForURL(url, host){
        var direct = 'DIRECT;';

        var proxy = '127.0.0.1:80';
        var block = '0.0.0.0:80';
        
        if(shExpMatch(host, '10.[0-9]+.[0-9]+.[0-9]+')) return direct;
        if(shExpMatch(host, '172.[0-9]+.[0-9]+.[0-9]+')) return direct;
        if(shExpMatch(host, '192.168.[0-9]+.[0-9]+')) return direct;
        if(shExpMatch(host, '127.0.0.1')) return direct;
        if(shExpMatch(host, 'localhost')) return direct;
        if(shExpMatch(host, 'dl.google.com')) return direct;

        if(config.blackList){
                for(i in blackList){
                        if(blackList[i].url){
                                if(url.indexOf(blackList[i].url) > -1){
                                        return 'PROXY '+ block +';';
                                };
                        };
                        if(blackList[i].domain){
                                if(shExpMatch(host, blackList[i].domain)){
                                        return 'PROXY '+ block +';';
                                };
                        };
                };
        };

        if(config.digitalDomain){
                // 屏蔽数字域名和绕过白名单
                var reg = /^([^.]+\.)*(\d+)(\.[^.]+)$/gi;
                if(reg.exec(host) && whiteList.indexOf(RegExp.$2 + RegExp.$3) < 0){
                        return 'PROXY '+ block +';';
                };
        };

        if(config.hosts){
                // 代理的主机列表
                for(i in hostsList){
                        if(dnsDomainIs(host, hostsList[i].domain)){
                                return 'PROXY '+ (hostsList[i].ip ? hostsList[i].ip : proxy) +';';
                        };
                };
        };

        return direct;
}
