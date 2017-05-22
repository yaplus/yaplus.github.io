// タイマー
function Timer(now,limit) {
  this.now = now;
  this.limit = limit;
};
// 制限時間をカウント
Timer.prototype.count = function(delta) {
  this.now += delta;
};

Timer.prototype.complicate = function(limit) {
  this.limit = limit;
};

// 時間を超えたときに制限時間のリセット
Timer.prototype.reset = function() {
  if (this.now >= this.limit) {
    return true;
  }
};
