var Over = {};

//描写処理
Over.Render = function () {
  // 描画処理
  ctx.clearRect(0, 0, screen.width, screen.height);
  ctx.drawImage(Asset.images['screen'], 0, 0);
  ctx.fillText(score,600,100);
  ctx.drawImage(Asset.images['gameover'], 650, 36);
  ctx.drawImage(Asset.images['player'], playerX[playerPos], playerY);
  rabbits.forEach(function(rabbit, index) {
    if (index == missRabbit) {
      switch (rabbit.type) {
        case 'tippy':
          ctx.drawImage(Asset.images['tippyTurned'], rabbitX[rabbit.pos - 1], 460);
          break;
        default:
          ctx.drawImage(Asset.images[rabbit.type], rabbitX[rabbit.pos - 1], 460);
      }
      return;
    }
    if (_mobi.Mobile) {
      ctx.drawImage(Asset.images[rabbit.type], rabbitX[rabbit.pos], rabbitY[rabbit.pos]);
      return;
    }
    var rad = rabbit.pos/10 * Math.PI; // 回転角
    var back = ctx.getImageData(rabbitX[rabbit.pos], rabbitY[rabbit.pos], 80, 80);
    imgCvs.width = 80;
    imgCvs.height = 80;
    imgCtx.clearRect(0, 0, imgCvs.width, imgCvs.height);
    imgCtx.translate(imgCvs.width * 0.5, imgCvs.height * 0.5);
    imgCtx.rotate(rad);
    imgCtx.putImageData(back, 0, 0);
    imgCtx.drawImage(Asset.images[rabbit.type], -imgCvs.width * 0.5, -imgCvs.height * 0.5);
    var rotated = imgCtx.getImageData(0, 0, 80, 80);
    ctx.putImageData(rotated, rabbitX[rabbit.pos], rabbitY[rabbit.pos]);
  });
  imgCtx.translate(imgCvs.width * -0.5, imgCvs.height * -0.5);
  imgCtx.clearRect(0, 0, imgCvs.width, imgCvs.height);
}

Over.reset = function () {
  score = 0;
  speed = 1.2;
  scene = 'game';
  rabbits = []; // Rabbitを保存する配列
  rabbitTimer = new Timer(0,1.2 + Math.random()*3); // Rabbit作成用タイマー
  clearInterval(loop);
  loop = window.setInterval(GameLoop, 1000/fps);
}
