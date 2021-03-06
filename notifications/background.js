// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
 Displays a notification with the current time. Requires "notifications"
 permission in the manifest file (or calling
 "webkitNotifications.requestPermission" beforehand).
 */
function show() {
    var currentTime = new Date();
    var time = /(..)(:..)/.exec(currentTime);     // The prettyprinted time.
    var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    var notifyWords = localStorage.notificationWords;
    var notification = window.webkitNotifications.createNotification(
        '48.png',                      // The image.
        hour + time[2] + ' ' + period, // The title.
        notifyWords      // The body.
    )
    var judgeResult = judge();
    if (judgeResult.active && !JSON.parse(localStorage.alreadyDisplayed)) {
        if (JSON.parse(localStorage.isAmActive) && judgeResult.period == 1) {
            notification.show();
            localStorage.alreadyDisplayed = true;
            notification.onclick = function () {
                localStorage.isAmActive = false;//设置上午not Active
                localStorage.isPmActive = true; //设置下午Active
            }
        } else if (JSON.parse(localStorage.isPmActive) && judgeResult.period == 2) {
            notification.show();
            localStorage.alreadyDisplayed = true;
            notification.onclick = function () {
                localStorage.isPmActive = false;//设置下午not active
                localStorage.isAmActive = true;//设置上午active
            }
        }
    }
    notification.onclose = function(){
        localStorage.alreadyDisplayed = false;
    }
}

function judge() {
    var beginAm = parseInt(localStorage.beginAmTime);
    var endAm = parseInt(localStorage.beginAmTime) + parseInt(localStorage.durationTime);
    var beginPm = parseInt(localStorage.beginPmTime) + 12;
    var endPm = parseInt(localStorage.beginPmTime) + parseInt(localStorage.durationTime) + 12;
    var now = new Date().getHours();
    var isAm = now >= beginAm && now <= endAm;
    var isPm = now >= beginPm && now <= endPm;
    return {active: isAm || isPm, period: isAm ? 1 : isPm ? 2 : 0}; //period 0--都不是  1-－上午  2-－下午
}


// Conditionally initialize the options.
localStorage.isActivated = true;   // 全局定义插件是否生效
localStorage.isAmActive = true; // 定义上午是否显示
localStorage.isPmActive = true; //定义下午时段是否显示
localStorage.frequency = 10;   // 显示频率
localStorage.beginAmTime = 9; //初始化上午开始时间
localStorage.beginPmTime = 6;  //初始化下午开始时间
localStorage.durationTime = 1; //持续时间
localStorage.notificationWords = '上下班打卡了么？';
localStorage.alreadyDisplayed = false;


// 运行
if (window.webkitNotifications) {
    // While activated, show notifications at the display frequency.
    if (JSON.parse(localStorage.isActivated)) {
        show();
    }
    var interval = 0; // The display interval, in minutes.
    setInterval(function () {
        interval++;
        if (JSON.parse(localStorage.isActivated) && localStorage.frequency <= interval) {
            show();
            interval = 0;
        }
    }, 60000);
}
