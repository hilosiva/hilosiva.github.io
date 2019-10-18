document.documentElement.classList.remove('no-js');

/*
  3.1 - Component
-----------------------------------------------------*/

/* Copyright (c) 2019 by Billimarie Lubiano Robinson (https://codepen.io/billimarie/pen/mJLeBY)
Released under the MIT license
*/
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
  const boxes = document.querySelectorAll(".js-animate");
  const boxesArray = Array.prototype.slice.call(boxes, 0);

  const options = {
    root: null,
    rootMargin: "0px 0px -160px",
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
        entry.target.classList.add('is-animateActive');
      } else {
        // entry.target.classList.remove('is-animateActive');
      }
    });
  }

}


/* =====================================================
  Scroll
===================================================== */
function handleTouchMove(event) {
  event.preventDefault();
}

/* =====================================================
  Vue
===================================================== */
const app = new Vue({
  el: '#app',
  data: {
    isDrawerActive: false,
  },
  mounted: function () {
    document.body.classList.add('is-loaded');
    particle();
    scrollIn();
  },
  methods: {
    drawer: function () {
      this.isDrawerActive = !this.isDrawerActive;
      if (this.isDrawerActive) {
        document.body.classList.add('is-scrollStop');
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
      } else {
        document.removeEventListener('touchmove', handleTouchMove, { passive: false });
      }
    },
  },
});
