window.addEventListener('load', init);

var SCREEN_WIDTH = 880;
var SCREEN_HEIGHT = 580;

var screen, ctx;
var imgCvs, imgCtx;

var loop; // ゲームループ
var score = 0; // スコア
var playerPos = 0; // プレイヤー位置
var speed; //ゲームスピード
var scene = 'game'; // シーン
var fps = 20; //fps
var missRabbit; //ミスをした時のRabbit
var rabbits = []; // Rabbitを保存する配列
var rabbitTimer = new Timer(0,1.2 + Math.random()*3); // Rabbit作成用タイマー

var resetButton = document.getElementById("resetButton");
var tweetButton = document.getElementById("tweetButton");

resetButton.onclick = function() { Over.reset(); }
tweetButton.onclick = function() {
  var text, url;
  text = "X๑╹Δ╹๑X ＜ スコアは" + score + "点でした…(CV:水瀬いのり) - ウオッチうさ？？ ぴょん'sとらんぽりん";
  url = "https://twitter.com/share?hashtags=gochiusa" + "&text=" + text + "&url=http://yaplus.jp/watchusa/&via=yaplus";
  window.open(url,"_blank","width=640,height=320");
}

var leftScreen = document.getElementById("leftScreen");
var rightScreen = document.getElementById("rightScreen");

var leftButton = document.getElementById("leftButton");
var rightButton = document.getElementById("rightButton");


// プレイヤーの座標
var playerX = [60, 270, 450];
var playerY = 380;
// うさぎの座標
var rabbitX = [72, 100, 120, 140, 160, 180, 205, 220, 265, 310, 325, 350, 370, 395, 410, 460, 500, 530, 550, 590, 640, 680];
var rabbitY = [140, 195, 250, 310, 380, 300, 240, 180, 135, 180, 240, 300, 380, 310, 260, 200, 260, 320, 380, 290, 230, 300];

function init() {  // 初期化処理
  // ゲーム画面
  screen = document.getElementById('screen');
  ctx = screen.getContext('2d');
  screen.width = SCREEN_WIDTH;
  screen.height = SCREEN_HEIGHT;

  // ダミーのcanvas
  imgCvs = document.getElementById('rabbit'); // 回転した画像を書き出すためのcanvas
  imgCtx = imgCvs.getContext('2d');

  ctx.font="64px DSEG7";
  ctx.textAlign = "right";

  rabbits.push(new Rabbit('tippy'))
  // キー入力の受付け
  addEventListener('keydown', whatKey, false);
  leftButton.addEventListener('touchstart', touchLeft, false);
  rightButton.addEventListener('touchstart', touchRight, false);
  leftScreen.addEventListener('touchstart', touchLeft, false);
  rightScreen.addEventListener('touchstart', touchRight, false);

  Asset.loadAssets();

  loop = window.setInterval(GameLoop, 1000/fps);
}

// 描写ループ
function GameLoop() {
  scene = 'game';
  Game.Process(1/fps);
  Game.Render();
}

// 描写ループ
function OverLoop() {
  scene ='gameover';
  Over.Render();
}

// 何のキーが押されたか判定
function whatKey(evt) {
  switch (evt.keyCode) {
    // 左ボタンを押した時
    case 37:
      if (playerPos > 0) {
        playerPos--;
      }
      break;
    // 右ボタンを押した時
    case 39:
      if (playerPos < 2) {
        playerPos++;
      }
      break;
    // スペースキーを押した時
    case 32:
      Over.reset();
      break;
  }
}

function touchLeft() {
  if (playerPos > 0) {
    playerPos--;
  }
}

function touchRight() {
  if (playerPos < 2) {
    playerPos++;
  }
}

var _mobi = (function(u){
  return {
    Mobile:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1)
      || u.indexOf("ipad") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
      || u.indexOf("kindle") != -1
      || u.indexOf("silk") != -1
      || u.indexOf("playbook") != -1
      || (u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
      || u.indexOf("iphone") != -1
      || u.indexOf("ipod") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
      || u.indexOf("blackberry") != -1
  }
})(window.navigator.userAgent.toLowerCase());
