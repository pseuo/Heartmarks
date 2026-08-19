/**
 * 计时器,每次重新计算效率有待优化
 * @param  {[type]} target [description]
 * @param {string} d Element ID for days
 * @param {string} h Element ID for hours
 * @param {string} m Element ID for minutes
 * @param {string} s Element ID for seconds
 * @param {Function} onTick Receives the current time parts after each update
 * @return {number} Interval ID
 */
var countTime = function (target, d, h, m, s, onTick) {
    var targetTime = new Date(target).getTime();
    var elements = [d, h, m, s].map(function (id) {
        return document.getElementById(id);
    });

    function update() {
        var diff = calcDifference(Date.now() - targetTime);
        elements.forEach(function (element, index) {
            element.textContent = diff[index];
        });
        if (onTick) {
            onTick(diff);
        }
    }

    update();
    return window.setInterval(update, 1000);
};


/**
 * 计算差距的具体时间
 * @param  {[type]} day [description]
 * @return {[type]}     [description]
 */
var calcDifference = function (day) {
    day = Math.max(0, day);
    var days = Math.floor(day / (24 * 3600 * 1000));
    var leave1 = day % (24 * 3600 * 1000);
    var hours = Math.floor(leave1 / (3600 * 1000));
    var leave2 = leave1 % (3600 * 1000);
    var minutes = Math.floor(leave2 / (60 * 1000));
    var leave3 = leave2 % (60 * 1000);
    var seconds = Math.floor(leave3 / 1000);
    return [days, hours, minutes, seconds];
};
