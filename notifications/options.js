// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
 Grays out or [whatever the opposite of graying out is called] the option
 field.
 */
function ghost(isDeactivated) {
    options.style.color = isDeactivated ? 'graytext' : 'black';
    // The label color.
    options.frequency.disabled = isDeactivated; // The control manipulability.
}

window.addEventListener('load', function () {
    // Initialize the option controls.
    options.isActivated.checked = JSON.parse(localStorage.isActivated);
    options.frequency.value = localStorage.frequency;
    options.beginAm.value = localStorage.beginAmTime;
    options.beginPm.value = localStorage.beginPmTime;
    options.notificationWords.value = localStorage.notificationWords;

    if (!options.isActivated.checked) {
        ghost(true);
    }

    // Set the display activation and frequency.
    options.isActivated.onchange = function () {
        localStorage.isActivated = options.isActivated.checked;
        ghost(!options.isActivated.checked);
    };

    options.frequency.onchange = function () {
        localStorage.frequency = options.frequency.value;
    };

    options.beginAm.onchange = function () {
        localStorage.beginAmTime = options.beginAm.value;
    };

    options.beginPm.onchange = function () {
        localStorage.beginPmTime = options.beginPm.value;
    };

    options.notificationWordsSubmit.onclick = function() {
        localStorage.notificationWords = options.notificationWords.value;
    };
});
