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
    var notification = window.webkitNotifications.createNotification(
        '48.png',                      // The image.
        hour + time[2] + ' ' + period, // The title.
        'Time to click your working card.'      // The body.
    )
    var beginAm = localStorage.beginAmTime;
    var endAm = localStorage.beginAmTime + localStorage.durationTime;
    var beginPm = localStorage.beginPmTime;
    var endPm = localStorage.beginPmTime + localStorage.durationTime;

    if ((hour >= beginAm && hour <= endAm) || (hour >= beginPm && hour <= endPm)) {
        notification.show();
        notification.onclick = function () {
            localStorage.isActivated = false;
        }
    }
}

// Conditionally initialize the options.
if (localStorage.isInitialized) {
    localStorage.isActivated = true;   // The display activation.
    localStorage.frequency = 10;        // The display frequency, in minutes.
    localStorage.isInitialized = true; // The option initialization.
    localStorage.beginAmTime = 9; //初始化上午开始时间
    localStorage.beginPmTime = 6;  //初始化下午开始时间
    localStorage.durationTime = 2; //持续时间
}

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