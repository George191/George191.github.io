var home_Path = document.location.protocol + '//' + window.document.location.hostname + '/';

var userAgent = window.navigator.userAgent.toLowerCase();
console.log(userAgent);
var norunAI = ["android", "iphone", "ipod", "ipad", "windows phone", "mqqbrowser", "msie", "trident/7.0"];
var norunFlag = false;


for (var i = 0; i < norunAI.length; i++) {
    if (userAgent.indexOf(norunAI[i]) > -1) {
        norunFlag = true;
        break;
    }
}

if (!window.WebGLRenderingContext) {
    norunFlag = true;
}

if (!norunFlag){
    var hitFlag = false;
    var AIFadeFlag = false;
    var liveTlakTimer = null;
    var sleepTimer_ = null;
    var AITalkFlag = false;
    var talkNum = 0;
    $(function () {
        function renderTip(template, context) {
            var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
            return template.replace(tokenReg, function (word, slash1, token, slash2) {
                if (slash1 || slash2) {
                    return word.replace('\\', '');
                }
                var variables = token.replace(/\s/g, '').split('.');
                var currentObject = context;
                var i, length, variable;
                for (i = 0, length = variables.length; i < length; ++i) {
                    variable = variables[i];
                    currentObject = currentObject[variable];
                    if (currentObject === undefined || currentObject === null) return '';
                }
                return currentObject;
            });
        }

        String.prototype.renderTip = function (context) {
            return renderTip(this, context);
        };

        var re = /x/;
        re.toString = function () {
            showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000);
            return '';
        };

        $(document).on('copy', function () {
            showMessage('你都复制了些什么呀，转载要记得加上出处哦~~', 5000);
        });

        function initTips() {
            $.ajax({
                cache: true,
                url: message_Path + 'message.json',
                dataType: "json",
                success: function (result) {
                    $.each(result.mouseover, function (index, tips) {
                        $(tips.selector).mouseover(function () {
                            var text = tips.text;
                            if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                            text = text.renderTip({text: $(this).text()});
                            showMessage(text, 3000);
                            talkValTimer();
                            clearInterval(liveTlakTimer);
                            liveTlakTimer = null;
                        });
                        $(tips.selector).mouseout(function () {
                            showHitokoto();
                            if (liveTlakTimer == null) {
                                liveTlakTimer = window.setInterval(function () {
                                    showHitokoto();
                                }, 15000);
                            }
                            ;
                        });
                    });
                    $.each(result.click, function (index, tips) {
                        $(tips.selector).click(function () {
                            if (hitFlag) {
                                return false
                            }
                            hitFlag = true;
                            setTimeout(function () {
                                hitFlag = false;
                            }, 8000);
                            var text = tips.text;
                            if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                            text = text.renderTip({text: $(this).text()});
                            showMessage(text, 3000);
                        });
                        clearInterval(liveTlakTimer);
                        liveTlakTimer = null;
                        if (liveTlakTimer == null) {
                            liveTlakTimer = window.setInterval(function () {
                                showHitokoto();
                            }, 15000);
                        }
                        ;
                    });
                }
            });
        }

        initTips();

        var text;
        if (document.referrer !== '') {
            var referrer = document.createElement('a');
            referrer.href = document.referrer;
            text = '嗨！来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友！';
            var domain = referrer.hostname.split('.')[1];
            if (domain == 'baidu') {
                text = '嗨！ 来自 百度搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
            } else if (domain == 'so') {
                text = '嗨！ 来自 360搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
            } else if (domain == 'google') {
                text = '嗨！ 来自 谷歌搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
            }
        } else {
            if (window.location.href == ${home_Path}) { //主页URL判断，需要斜杠结尾
                var now = (new Date()).getHours();
                if (now > 23 || now <= 5) {
                    text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？';
                } else if (now > 5 && now <= 7) {
                    text = '早上好！一日之计在于晨，美好的一天就要开始了！';
                } else if (now > 7 && now <= 11) {
                    text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
                } else if (now > 11 && now <= 14) {
                    text = '中午了，工作了一个上午，现在是午餐时间！';
                } else if (now > 14 && now <= 17) {
                    text = '午后很容易犯困呢，今天的运动目标完成了吗？';
                } else if (now > 17 && now <= 19) {
                    text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~~';
                } else if (now > 19 && now <= 21) {
                    text = '晚上好，今天过得怎么样？';
                } else if (now > 21 && now <= 23) {
                    text = '已经这么晚了呀，早点休息吧，晚安~~';
                } else {
                    text = '嗨~ 快来逗我玩吧！';
                }
            } else {
                text = '欢迎阅读<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
            }
        }
        showMessage(text, 12000);
    })();

    liveTlakTimer = setInterval(function () {
        showHitokoto();
    }, 15000);

    function showHitokoto() {
        if (sessionStorage.getItem("Sleepy") !== "1") {
            if (!AITalkFlag) {
                $.getJSON('https://v1.hitokoto.cn/', function (result) {
                    talkValTimer();
                    showMessage(result.hitokoto, 0);
                });
            }
        } else {
            hideMessage(0);
            if (sleepTimer_ == null) {
                sleepTimer_ = setInterval(function () {
                    checkSleep();
                }, 200);
            }
            console.log(sleepTimer_);
        }
    }

    function checkSleep() {
        var sleepStatu = sessionStorage.getItem("Sleepy");
        if (sleepStatu !== '1') {
            talkValTimer();
            showMessage('你回来啦~', 0);
            clearInterval(sleepTimer_);
            sleepTimer_ = null;
        }
    }

    function showMessage(text, timeout) {
        if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1];
        //console.log('showMessage', text);
        $('.message').stop();
        $('.message').html(text).fadeTo(200, 1);
        if (timeout === null) timeout = 5000;
        hideMessage(timeout);
    }

    function talkValTimer() {
        $('#live_talk').val('1');
    }

    function hideMessage(timeout) {
        $('.message').stop().css('opacity', 1);
        if (timeout === null) timeout = 5000;
        $('.message').delay(timeout).fadeTo(200, 0);
    }

    function initLive2d() {
        $('#hideButton').on('click', function () {
            if (AIFadeFlag) {
                return false;
            } else {
                AIFadeFlag = true;
                localStorage.setItem("live2dhidden", "0");
                $('#landlord').fadeOut(200);
                $('#open_live2d').delay(200).fadeIn(200);
                setTimeout(function () {
                    AIFadeFlag = false;
                }, 300);
            }
        });
        $('#open_live2d').on('click', function () {
            if (AIFadeFlag) {
                return false;
            } else {
                AIFadeFlag = true;
                localStorage.setItem("live2dhidden", "1");
                $('#open_live2d').fadeOut(200);
                $('#landlord').delay(200).fadeIn(200);
                setTimeout(function () {
                    AIFadeFlag = false;
                }, 300);
            }
        });
        $('#youduButton').on('click', function () {
            if ($('#youduButton').hasClass('doudong')) {
                var typeIs = $('#youduButton').attr('data-type');
                $('#youduButton').removeClass('doudong');
                $('body').removeClass(typeIs);
                $('#youduButton').attr('data-type', '');
            } else {
                var duType = $('#duType').val();
                var duArr = duType.split(",");
                var dataType = duArr[Math.floor(Math.random() * duArr.length)];

                $('#youduButton').addClass('doudong');
                $('#youduButton').attr('data-type', dataType);
                $('body').addClass(dataType);
            }
        });

        var talkAPI = 'https://api.ownthink.com/bot?spoken='
        if (talkAPI !== '') {
            $('#showInfoBtn').on('click', function () {
                var live_statu = $('#live_statu_val').val();
                if (live_statu == "0") {
                    return
                } else {
                    $('#live_statu_val').val("0");
                    $('.live_talk_input_body').fadeOut(500);
                    AITalkFlag = false;
                    showHitokoto();
                    $('#showTalkBtn').show();
                    $('#showInfoBtn').hide();
                }
            });
            $('#showTalkBtn').on('click', function () {
                var live_statu = $('#live_statu_val').val();
                if (live_statu == "1") {
                    return
                } else {
                    $('#live_statu_val').val("1");
                    $('.live_talk_input_body').fadeIn(500);
                    AITalkFlag = true;
                    $('#showTalkBtn').hide();
                    $('#showInfoBtn').show();

                }
            });
            $('#talk_send').on('click', function () {
                var info_ = $('#AIuserText').val()
                if (info_ == "") {
                    showMessage('写点什么吧！', 0)
                    return
                }
                ;
                showMessage('思考中~', 0)
                $.ajax({
                    type: 'POST',
                    url: talkAPI + info_,
                    success: function (res) {
                        if (res.data.type !== 5000) {
                            talkValTimer();
                            showMessage('似乎有什么错误，请和站长联系！', 0);
                        } else {
                            talkValTimer();
                            showMessage(res.data.info.text, 0);
                        }
                        console.log(res);
                        $('#AIuserText').val("");
                        sessionStorage.setItem("live2duser", userid_);
                    }
                });
            });
        } else {
            $('#showInfoBtn').hide();
            $('#showTalkBtn').hide();
        }
    }
}
