document.documentElement.classList.remove('no-js');

/*
  3.1 - Component
-----------------------------------------------------*/
const particle = function () {
  var mouseX = 0,
    mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    SEPARATION = 200,
    AMOUNTX = 10,
    AMOUNTY = 10,
    camera,
    scene,
    renderer;

  init();
  animate();

  function init() {

    var container,
      separation = 100,
      amountX = 50,
      amountY = 50,
      particle;

    container = document.createElement('div');
    container.classList.add('p-hero__canvas');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    renderer = new THREE.CanvasRenderer({ alpha: true }); // gradient; this can be swapped for WebGLRenderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 100;

    // particles
    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial({
      color: 0xffffff,
      opacity: 0.5,
      program: function (context) {
        context.beginPath();
        context.arc(0, 0, 0.3, 0, PI2, true);
        context.fill();
      }
    });

    var geometry = new THREE.Geometry();

    for (var i = 0; i < 100; i++) {
      particle = new THREE.Sprite(material);
      particle.position.x = Math.random() * 2 - 1;
      particle.position.y = Math.random() * 2 - 1;
      particle.position.z = Math.random() * 2 - 1;
      particle.position.normalize();
      particle.position.multiplyScalar(Math.random() * 10 + 450);
      particle.scale.x = particle.scale.y = 10;
      scene.add(particle);
      geometry.vertices.push(particle.position);
    }

    // lines
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.1 }));
    scene.add(line);

    // mousey
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);

  } // end init();

  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

  }

  function onDocumentTouchStart(event) {

    if (event.touches.length > 1) {

      event.preventDefault();

      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;

    }
  }

  function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

      event.preventDefault();

      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;

    }
  }

  function animate() {

    requestAnimationFrame(animate);
    render();

  }

  function render() {

    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (- mouseY + 200 - camera.position.y) * .05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);

  }
};











const scrollIn = function () {
  const boxes = document.querySelectorAll(".c-animate");
  const boxesArray = Array.prototype.slice.call(boxes, 0);

  const options = {
    root: null,
    rootMargin: "0px 0px -150px",
    threshold: 0
  };
  const observer = new IntersectionObserver(doWhenIntersect, options);
  boxesArray.forEach(function (box) {
    observer.observe(box);
  });

  /**
   * 交差したときに呼び出す関数
   * @param entries
   */
  function doWhenIntersect(entries) {
    const entriesArray = Array.prototype.slice.call(entries, 0);
    entriesArray.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-active");
      }
    });
  }

}





/* =====================================================
  Vue
===================================================== */
const app = new Vue({
  el: '#app',
  data: {
    isActive: false,
  },
  mounted: function () {
    document.body.classList.add('is-loaded');
    particle();
    scrollIn();
  },
  methods: {
    drawer: function () {
      this.isActive = !this.isActive
    },
  },
});



// Little Canvas things
// var canvas = document.querySelector("#canvas"),
//   ctx = canvas.getContext('2d');

// // Set Canvas to be window size
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// // Configuration, Play with these
// var config = {
//   particleNumber: 800,
//   maxParticleSize: 10,
//   maxSpeed: 40,
//   colorVariation: 50
// };

// // Colors
// var colorPalette = {
//   bg: { r: 48, g: 55, b: 63 },
//   matter: [
//     { r: 36, g: 18, b: 42 }, // darkPRPL
//     { r: 78, g: 36, b: 42 }, // rockDust
//     { r: 252, g: 178, b: 96 }, // solorFlare
//     { r: 253, g: 238, b: 152 } // totesASun
//   ]
// };

// // Some Variables hanging out
// var particles = [],
//   centerX = canvas.width / 2,
//   centerY = canvas.height / 2,
//   drawBg,

//   // Draws the background for the canvas, because space
//   drawBg = function (ctx, color) {
//     ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };

// // Particle Constructor
// var Particle = function (x, y) {
//   // X Coordinate
//   this.x = x || Math.round(Math.random() * canvas.width);
//   // Y Coordinate
//   this.y = y || Math.round(Math.random() * canvas.height);
//   // Radius of the space dust
//   this.r = Math.ceil(Math.random() * config.maxParticleSize);
//   // Color of the rock, given some randomness
//   this.c = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)], true);
//   // Speed of which the rock travels
//   this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
//   // Direction the Rock flies
//   this.d = Math.round(Math.random() * 360);
// };

// // Provides some nice color variation
// // Accepts an rgba object
// // returns a modified rgba object or a rgba string if true is passed in for argument 2
// var colorVariation = function (color, returnString) {
//   var r, g, b, a, variation;
//   r = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.r);
//   g = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.g);
//   b = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.b);
//   a = Math.random() + .5;
//   if (returnString) {
//     return "rgba(" + r + "," + g + "," + b + "," + a + ")";
//   } else {
//     return { r, g, b, a };
//   }
// };

// // Used to find the rocks next point in space, accounting for speed and direction
// var updateParticleModel = function (p) {
//   var a = 180 - (p.d + 90); // find the 3rd angle
//   p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) : p.x -= p.s * Math.sin(p.d) / Math.sin(p.s);
//   p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p.s);
//   return p;
// };

// // Just the function that physically draws the particles
// // Physically? sure why not, physically.
// var drawParticle = function (x, y, r, c) {
//   ctx.beginPath();
//   ctx.fillStyle = c;
//   ctx.arc(x, y, r, 0, 2 * Math.PI, false);
//   ctx.fill();
//   ctx.closePath();
// };

// // Remove particles that aren't on the canvas
// var cleanUpArray = function () {
//   particles = particles.filter((p) => {
//     return (p.x > -100 && p.y > -100);
//   });
// };


// var initParticles = function (numParticles, x, y) {
//   for (let i = 0; i < numParticles; i++) {
//     particles.push(new Particle(x, y));
//   }
//   particles.forEach((p) => {
//     drawParticle(p.x, p.y, p.r, p.c);
//   });
// };

// // That thing
// window.requestAnimFrame = (function () {
//   return window.requestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     window.mozRequestAnimationFrame ||
//     function (callback) {
//       window.setTimeout(callback, 1000 / 60);
//     };
// })();


// // Our Frame function
// var frame = function () {
//   // Draw background first
//   drawBg(ctx, colorPalette.bg);
//   // Update Particle models to new position
//   particles.map((p) => {
//     return updateParticleModel(p);
//   });
//   // Draw em'
//   particles.forEach((p) => {
//     drawParticle(p.x, p.y, p.r, p.c);
//   });
//   // Play the same song? Ok!
//   window.requestAnimFrame(frame);
// };

// // Click listener
// document.body.addEventListener("click", function (event) {
//   var x = event.clientX,
//     y = event.clientY;
//   cleanUpArray();
//   initParticles(config.particleNumber, x, y);
// });

// // First Frame
// frame();

// // First particle explosion
// initParticles(config.particleNumber);




// 読み込みが終わってから初期化
// window.addEventListener("load", init);
// function init() {
//   document.body.classList.add('is-loaded');
//   // ステージを作成
//   var stage = new createjs.Stage("myCanvas");
//   // 配列でパーティクルを管理します
//   var particles = [];
//   // tick イベントを登録する
//   createjs.Ticker.setFPS(60);
//   createjs.Ticker.addEventListener("tick", handleTick);
//   function handleTick(event) {
//     // パーティクルを発生
//     emitParticles();
//     // パーティクルを更新
//     updateParticles();
//     // 画面を更新する
//     stage.update();
//   }
//   var count = 0; // tick イベントの回数
//   var MAX_LIFE = 40; // 寿命の最大値
//   // パーティクルを発生させます
//   function emitParticles() {
//     // パーティクルの生成
//     for (var i = 0; i < 5; i++) {
//       // カウントの更新
//       count += 1;
//       // オブジェクトの作成
//       var particle = new createjs.Shape();
//       particle.graphics
//         .beginFill(createjs.Graphics.getHSL(255, 255, 255))
//         .drawCircle(0, 0, 10 * Math.random());
//       stage.addChild(particle);

//       particle.compositeOperation = "lighter";

//       particle.alpha = 0.1;

//       // パーティクルの発生場所

//       particle.x = stage.mouseX;
//       particle.y = stage.mouseY;


//       // 動的にプロパティーを追加します。
//       // 速度
//       particle.vx = 50 * (Math.random() - 0.5);
//       particle.vy = 50 * (Math.random() - 0.5);
//       // 寿命
//       particle.life = MAX_LIFE;
//       particles.push(particle);
//     }
//   }
//   // パーティクルを更新します
//   function updateParticles() {
//     // パーティクルの計算を行う
//     for (var i = 0; i < particles.length; i++) {
//       // オブジェクトの作成
//       var particle = particles[i];
//       // 重力
//       particle.vy += 1;
//       // 摩擦
//       particle.vx *= 0.96;
//       particle.vy *= 0.96;
//       // 速度を位置に適用
//       particle.x += particle.vx;
//       particle.y += particle.vy;
//       // 地面
//       if (particle.y > stage.canvas.height) {
//         particle.y = stage.canvas.height; // 行き過ぎ補正
//         particle.vy *= -1; // Y軸の速度を反転
//       }
//       // パーティクルのサイズをライフ依存にする
//       var scale = particle.life / MAX_LIFE;
//       particle.scaleX = particle.scaleY = scale;
//       // 寿命を減らす
//       particle.life -= 1;
//       // 寿命の判定
//       if (particle.life <= 0) {
//         // ステージから削除
//         stage.removeChild(particle);
//         // 配列からも削除
//         particles.splice(i, 1);
//       }
//     }
//   }
//   // 初期値の上書き。
//   // 画面の中央からパーティクルが表示するよう強制的に設定。
//   // 必須ではないオマケの処理です。
//   stage.mouseX = stage.canvas.width / 2;
//   stage.mouseY = stage.canvas.height * 1 / 3;
// }
