var Game = {};

// ゲーム内での処理
Game.Process = function(delta){
  // タイマーのカウント
  rabbitTimer.count(delta);
  // secTimerによるカウントがsecLimit(初期状態は1.5秒)を超えたときの処理
  rabbits.forEach(function(rabbit,index) {
    rabbit.gameTimer.count(delta);
    rabbit.missTimer.count(delta);
    // ミス判定
    rabbit.misscheck(playerPos,index);
    if (rabbit.gameTimer.reset()) {
      rabbit.gameTimer.now = 0;
      // rabbitsのすべてのRabbitを1つ進める
      rabbit.goes();
      // 22以上の場所にあった場合rabbitsからRabbitを削除
      if (rabbit.pos > 21) {
        delete rabbits[index];
        rabbitTimer.now = 0;
      }
    }
  });
  // rabbitsにおいて削除されたRabbitの部分を空ける
  rabbits = rabbits.filter(Boolean);

  // ゲームの難易度調整
  var rabbitMax = 1; // うさぎの最大数
  var difficulty = score % 100;
  var level = Math.floor(score / 100);
  rabbits.forEach(function(rabbit) {
    if (score > 200) {
      rabbitMax = 5;
      speed = 0.45;
    } else {
      if (difficulty >= 0 && difficulty <= 4) {
        speed = 1.0;
      } else if (difficulty > 4 && difficulty <= 15) {
        rabbitMax = 2;
        speed = 0.8;
      } else if (difficulty > 15 && difficulty <= 42) {
        rabbitMax = 3;
        speed = 0.7;
      } else if (difficulty > 42 && difficulty <= 72) {
        rabbitMax = 4;
        speed = 0.6;
      } else {
        rabbitMax = 5;
        speed = 0.5;
      }
    }
    speed = speed * Math.pow(0.95,level)
    if (speed < 0.4) { speed = 0.4; }
    rabbit.gameTimer.complicate(speed)
    rabbit.missTimer.complicate(speed)
  });
  // 画面のRabbitが3以下の時rabbitTimerごとにランダムで新しいRabbitをrabbitsに追加
  var rand = (1.5 + Math.random()*2.5)*speed;
  var rabbitType = 'tippy';
  if (rabbits.length <= rabbitMax && rabbitTimer.reset()) {
    var randomRabbit = Math.floor(Math.random()*3);
    switch (randomRabbit) {
      case 1:
        rabbitType = 'anko'
        break;
      case 2:
        rabbitType = 'wildGeese'
        break;
      default:
        rabbitType = 'tippy'
      break;
    }
    rabbitTimer.now = 0;
    rabbits.push(new Rabbit(rabbitType));
    rabbitTimer.complicate(rand);
  }
};

//描写処理
Game.Render = function () {
  // 描画処理
  ctx.clearRect(0, 0, screen.width, screen.height);
  ctx.drawImage(Asset.images['screen'], 0, 0);
  ctx.fillText(score,600,100);
  ctx.drawImage(Asset.images['player'], playerX[playerPos], playerY);
  rabbits.forEach(function(rabbit) {
    if (_mobi.Mobile) {
      ctx.drawImage(Asset.images[rabbit.type], rabbitX[rabbit.pos], rabbitY[rabbit.pos]);
      return;
    }
    var rad = rabbit.pos/10 * Math.PI; // 回転角
    var back = ctx.getImageData(rabbitX[rabbit.pos], rabbitY[rabbit.pos], 80, 70);
    imgCvs.width = 80;
    imgCvs.height = 70;
    imgCtx.clearRect(0, 0, imgCvs.width, imgCvs.height);
    imgCtx.translate(imgCvs.width * 0.5, imgCvs.height * 0.5);
    imgCtx.rotate(rad);
    imgCtx.putImageData(back, 0, 0);
    imgCtx.drawImage(Asset.images[rabbit.type], -imgCvs.width * 0.5, -imgCvs.height * 0.5);
    var rotated = imgCtx.getImageData(0, 0, 80, 70);
    ctx.putImageData(rotated, rabbitX[rabbit.pos], rabbitY[rabbit.pos]);
  });
  imgCtx.translate(imgCvs.width * -0.5, imgCvs.height * -0.5);
  imgCtx.clearRect(0, 0, imgCvs.width, imgCvs.height);

}

// Rabbit関数(クラス)
// goes関数でRabbitの位置を一つ進める
function Rabbit(type) {
  this.pos = 0;
  this.type = type;
  this.pass = false;
  // 1.5秒のゲーム進行用タイマー作成
  this.gameTimer = new Timer(0,1.2);
  // 0.7秒のミス判定用タイマー作成
  this.missTimer = new Timer(0,1.2);
};

Rabbit.prototype.goes = function() {
  this.pos++;
  Asset.audios['go'].play();
  Asset.audios['go'].currentTime = 0 ;
};

Rabbit.prototype.misscheck = function(playerPos,index) {
  if ((this.pos == 4 && playerPos == 0)
  || (this.pos == 12 && playerPos == 1)
  || (this.pos == 18 && playerPos == 2)) {
    if (!this.pass) {
      this.pass = true;
      if (score < 1999) { score++ };
      Asset.audios['point'].play();
      Asset.audios['point'].currentTime = 0 ;
    }
  } else if ((this.pos == 4 && playerPos != 0)
  || (this.pos == 12 && playerPos != 1)
  || (this.pos == 18 && playerPos != 2)) {
    if (!this.pass && this.missTimer.reset()) {
      scene ='gameover';
      missRabbit = index;
      clearInterval(loop);
      Asset.audios['miss'].play();
      Asset.audios['miss'].currentTime = 0 ;
      loop = window.setInterval(OverLoop, 1000/fps);
    }
  } else {
    this.pass = false;
  }
  if (this.missTimer.reset()) {
    this.missTimer.now =0;
  }
};
