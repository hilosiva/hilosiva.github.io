document.body.classList.add('is-jsUse');

// 読み込みが終わってから初期化
window.addEventListener("load", init);
function init() {
  document.body.classList.add('is-loaded');
  // ステージを作成
  var stage = new createjs.Stage("myCanvas");
  // 配列でパーティクルを管理します
  var particles = [];
  // tick イベントを登録する
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
    // パーティクルを発生
    emitParticles();
    // パーティクルを更新
    updateParticles();
    // 画面を更新する
    stage.update();
  }
  var count = 0; // tick イベントの回数
  var MAX_LIFE = 40; // 寿命の最大値
  // パーティクルを発生させます
  function emitParticles() {
    // パーティクルの生成
    for (var i = 0; i < 5; i++) {
      // カウントの更新
      count += 1;
      // オブジェクトの作成
      var particle = new createjs.Shape();
      particle.graphics
        .beginFill(createjs.Graphics.getHSL(count, 60, 30))
        .drawCircle(0, 0, 10 * Math.random());
      stage.addChild(particle);

      particle.compositeOperation = "lighter";

      particle.alpha = 0.5;

      // パーティクルの発生場所

      particle.x = stage.mouseX;
      particle.y = stage.mouseY;


      // 動的にプロパティーを追加します。
      // 速度
      particle.vx = 50 * (Math.random() - 0.5);
      particle.vy = 50 * (Math.random() - 0.5);
      // 寿命
      particle.life = MAX_LIFE;
      particles.push(particle);
    }
  }
  // パーティクルを更新します
  function updateParticles() {
    // パーティクルの計算を行う
    for (var i = 0; i < particles.length; i++) {
      // オブジェクトの作成
      var particle = particles[i];
      // 重力
      particle.vy += 1;
      // 摩擦
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      // 速度を位置に適用
      particle.x += particle.vx;
      particle.y += particle.vy;
      // 地面
      if (particle.y > stage.canvas.height) {
        particle.y = stage.canvas.height; // 行き過ぎ補正
        particle.vy *= -1; // Y軸の速度を反転
      }
      // パーティクルのサイズをライフ依存にする
      var scale = particle.life / MAX_LIFE;
      particle.scaleX = particle.scaleY = scale;
      // 寿命を減らす
      particle.life -= 1;
      // 寿命の判定
      if (particle.life <= 0) {
        // ステージから削除
        stage.removeChild(particle);
        // 配列からも削除
        particles.splice(i, 1);
      }
    }
  }
  // 初期値の上書き。
  // 画面の中央からパーティクルが表示するよう強制的に設定。
  // 必須ではないオマケの処理です。
  stage.mouseX = stage.canvas.width / 2;
  stage.mouseY = stage.canvas.height * 1 / 3;
}
