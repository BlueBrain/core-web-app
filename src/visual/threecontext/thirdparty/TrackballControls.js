/*
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin   / http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga   / http://lantiga.github.io
 */

import * as THREE from 'three';

/* eslint no-use-before-define: "off" */
/* eslint no-shadow: "off" */
/* eslint prefer-destructuring: "off" */
/* eslint no-var: "off" */
/* eslint vars-on-top: "off" */
/* eslint no-restricted-properties: "off" */
/* eslint object-shorthand: "off" */
/* eslint prefer-exponentiation-operator: "off" */
/* eslint no-unused-vars: "off" */

/*
 * ES6 adapted source from the example folder of THREEJS (because there is no proper repo for it)
 * Enables mouse control (pan, zoom, rotation)
 */
const TrackballControls = function (object, domElement) {
  const _this = this;
  const STATE = {
    NONE: -1,
    ROTATE: 0,
    ZOOM: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_ZOOM_PAN: 4,
  };

  this.object = object;
  this.domElement = domElement !== undefined ? domElement : document;

  // API

  this.enabled = true;

  this.screen = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  this.rotateSpeed = 1.0;
  this.zoomSpeed = 1.5;
  this.panSpeed = 1;

  this.noRotate = false;
  this.noZoom = false;
  this.noPan = false;

  this.minDistance = 0;
  this.maxDistance = Infinity;

  this.keys = [65 /* A */, 83 /* S */, 68];

  // internals

  this.target = new THREE.Vector3();

  const EPS = 0.000001;

  const lastPosition = new THREE.Vector3();

  let _state = STATE.NONE;

  let _prevState = STATE.NONE;

  const _eye = new THREE.Vector3();

  const _movePrev = new THREE.Vector2();

  const _moveCurr = new THREE.Vector2();

  const _lastAxis = new THREE.Vector3();

  let _lastAngle = 0;

  const _zoomStart = new THREE.Vector2();

  const _zoomEnd = new THREE.Vector2();

  let _touchZoomDistanceStart = 0;

  let _touchZoomDistanceEnd = 0;

  const _panStart = new THREE.Vector2();

  const _panEnd = new THREE.Vector2();

  // for reset

  this.target0 = this.target.clone();
  this.position0 = this.object.position.clone();
  this.up0 = this.object.up.clone();

  // events

  const changeEvent = { type: 'change' };
  const startEvent = { type: 'start' };
  const endEvent = { type: 'end' };

  // methods

  this.handleResize = function () {
    if (this.domElement === document) {
      this.screen.left = 0;
      this.screen.top = 0;
      this.screen.width = window.innerWidth;
      this.screen.height = window.innerHeight;
    } else {
      const box = this.domElement.getBoundingClientRect();
      // adjustments come from similar code in the jquery offset() function
      const d = this.domElement.ownerDocument.documentElement;
      this.screen.left = box.left + window.pageXOffset - d.clientLeft;
      this.screen.top = box.top + window.pageYOffset - d.clientTop;
      this.screen.width = box.width;
      this.screen.height = box.height;
    }
  };

  const getMouseOnScreen = (function () {
    const vector = new THREE.Vector2();

    return function getMouseOnScreen(pageX, pageY) {
      vector.set(
        (pageX - _this.screen.left) / _this.screen.width,
        (pageY - _this.screen.top) / _this.screen.height
      );

      return vector;
    };
  })();

  const getMouseOnCircle = (function () {
    const vector = new THREE.Vector2();

    return function getMouseOnCircle(pageX, pageY) {
      vector.set(
        (pageX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * 0.5),
        (_this.screen.height + 2 * (_this.screen.top - pageY)) / _this.screen.width // screen.width intentional
      );

      return vector;
    };
  })();

  this.rotateCamera = (function () {
    const axis = new THREE.Vector3();

    const quaternion = new THREE.Quaternion();

    const eyeDirection = new THREE.Vector3();

    const objectUpDirection = new THREE.Vector3();

    const objectSidewaysDirection = new THREE.Vector3();

    const moveDirection = new THREE.Vector3();

    let angle;

    return function rotateCamera() {
      moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
      angle = moveDirection.length();

      if (angle) {
        // _eye.copy(_this.object.position).sub(_this.target)
        _eye.x = _this.object.position.x - _this.target.x;
        _eye.y = _this.object.position.y - _this.target.y;
        _eye.z = _this.object.position.z - _this.target.z;

        // eyeDirection.copy(_eye).normalize()
        eyeDirection.x = _eye.x;
        eyeDirection.y = _eye.y;
        eyeDirection.z = _eye.z;
        eyeDirection.normalize();

        // objectUpDirection.copy(_this.object.up).normalize()
        objectUpDirection.x = _this.object.up.x;
        objectUpDirection.y = _this.object.up.y;
        objectUpDirection.z = _this.object.up.z;
        objectUpDirection.normalize();

        objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();

        objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
        objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);

        // moveDirection.copy(objectUpDirection.add(objectSidewaysDirection))
        moveDirection.x = objectUpDirection.x + objectSidewaysDirection.x;
        moveDirection.y = objectUpDirection.y + objectSidewaysDirection.y;
        moveDirection.z = objectUpDirection.z + objectSidewaysDirection.z;

        axis.crossVectors(moveDirection, _eye).normalize();

        angle *= _this.rotateSpeed;
        quaternion.setFromAxisAngle(axis, angle);

        _eye.applyQuaternion(quaternion);
        _this.object.up.applyQuaternion(quaternion);

        // _lastAxis.copy(axis)
        _lastAxis.x = axis.x;
        _lastAxis.y = axis.y;
        _lastAxis.z = axis.z;

        _lastAngle = angle;
      }

      _movePrev.copy(_moveCurr);
    };
  })();

  this.zoomCamera = function () {
    let factor;

    if (_state === STATE.TOUCH_ZOOM_PAN) {
      factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
      _touchZoomDistanceStart = _touchZoomDistanceEnd;
      _eye.multiplyScalar(factor);
    } else {
      factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

      if (factor !== 1.0 && factor > 0.0) {
        _eye.multiplyScalar(factor);
      }

      _zoomStart.copy(_zoomEnd);
    }
  };

  this.panCamera = (function () {
    const mouseChange = new THREE.Vector2();

    const objectUp = new THREE.Vector3();

    const pan = new THREE.Vector3();

    return function panCamera() {
      mouseChange.copy(_panEnd).sub(_panStart);

      if (mouseChange.lengthSq()) {
        mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

        pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
        pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));

        _this.object.position.add(pan);
        _this.target.add(pan);
        _panStart.copy(_panEnd);
      }
    };
  })();

  this.checkDistances = function () {
    if (!_this.noZoom || !_this.noPan) {
      if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
        _this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
        _zoomStart.copy(_zoomEnd);
      }

      if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
        _this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
        _zoomStart.copy(_zoomEnd);
      }
    }
  };

  this.update = function () {
    _eye.subVectors(_this.object.position, _this.target);

    if (!_this.noRotate) {
      _this.rotateCamera();
    }

    if (!_this.noZoom) {
      _this.zoomCamera();
    }

    if (!_this.noPan) {
      _this.panCamera();
    }

    _this.object.position.addVectors(_this.target, _eye);

    _this.checkDistances();

    _this.object.lookAt(_this.target);

    if (lastPosition.distanceToSquared(_this.object.position) > EPS) {
      _this.dispatchEvent(changeEvent);

      lastPosition.copy(_this.object.position);
    }
  };

  this.reset = function () {
    _state = STATE.NONE;
    _prevState = STATE.NONE;

    _this.target.copy(_this.target0);
    _this.object.position.copy(_this.position0);
    _this.object.up.copy(_this.up0);

    _eye.subVectors(_this.object.position, _this.target);

    _this.object.lookAt(_this.target);

    _this.dispatchEvent(changeEvent);

    lastPosition.copy(_this.object.position);
  };

  // listeners

  function keydown(event) {
    if (_this.enabled === false) return;

    window.removeEventListener('keydown', keydown);

    _prevState = _state;

    if (_state !== STATE.NONE) {
      return;
    }
    if (event.keyCode === _this.keys[STATE.ROTATE] && !_this.noRotate) {
      _state = STATE.ROTATE;
    } else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) {
      _state = STATE.ZOOM;
    } else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) {
      _state = STATE.PAN;
    }
  }

  function keyup(event) {
    if (_this.enabled === false) return;

    _state = _prevState;

    window.addEventListener('keydown', keydown, false);
  }

  function mousedown(event) {
    if (_this.enabled === false) return;

    event.preventDefault();
    event.stopPropagation();

    if (_state === STATE.NONE) {
      _state = event.button;
    }

    if (_state === STATE.ROTATE && !_this.noRotate) {
      _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
      _movePrev.copy(_moveCurr);
    } else if (_state === STATE.ZOOM && !_this.noZoom) {
      _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
      _zoomEnd.copy(_zoomStart);
    } else if (_state === STATE.PAN && !_this.noPan) {
      _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
      _panEnd.copy(_panStart);
    }

    document.addEventListener('mousemove', mousemove, false);
    document.addEventListener('mouseup', mouseup, false);

    _this.dispatchEvent(startEvent);
  }

  function mousemove(event) {
    if (_this.enabled === false) return;

    event.preventDefault();
    event.stopPropagation();

    if (_state === STATE.ROTATE && !_this.noRotate) {
      _movePrev.copy(_moveCurr);
      _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
    } else if (_state === STATE.ZOOM && !_this.noZoom) {
      _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
    } else if (_state === STATE.PAN && !_this.noPan) {
      _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
    }
  }

  function mouseup(event) {
    if (_this.enabled === false) return;

    event.preventDefault();
    event.stopPropagation();

    _state = STATE.NONE;

    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
    _this.dispatchEvent(endEvent);
  }

  function mousewheel(event) {
    if (_this.enabled === false) return;

    if (_this.noZoom === true) return;

    event.preventDefault();
    // event.stopPropagation()

    switch (event.deltaMode) {
      case 2:
        // Zoom in pages
        _zoomStart.y -= event.deltaY * 0.025;
        break;

      case 1:
        // Zoom in lines
        _zoomStart.y -= event.deltaY * 0.01;
        break;

      default:
        // undefined, 0, assume pixels
        _zoomStart.y -= event.deltaY * 0.00025;
        break;
    }

    _this.dispatchEvent(startEvent);
    _this.dispatchEvent(endEvent);
  }

  function touchstart(event) {
    if (_this.enabled === false) return;

    event.preventDefault();

    switch (event.touches.length) {
      case 1:
        _state = STATE.TOUCH_ROTATE;
        _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
        _movePrev.copy(_moveCurr);
        break;

      default: // 2 or more
        _state = STATE.TOUCH_ZOOM_PAN;
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

        var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
        var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
        _panStart.copy(getMouseOnScreen(x, y));
        _panEnd.copy(_panStart);
        break;
    }

    _this.dispatchEvent(startEvent);
  }

  function touchmove(event) {
    if (_this.enabled === false) return;

    event.preventDefault();
    event.stopPropagation();

    switch (event.touches.length) {
      case 1:
        _movePrev.copy(_moveCurr);
        _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
        break;

      default: // 2 or more
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

        var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
        var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
        _panEnd.copy(getMouseOnScreen(x, y));
        break;
    }
  }

  function touchend(event) {
    if (_this.enabled === false) return;

    switch (event.touches.length) {
      case 0:
        _state = STATE.NONE;
        break;

      case 1:
        _state = STATE.TOUCH_ROTATE;
        _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
        _movePrev.copy(_moveCurr);
        break;

      default:
    }

    _this.dispatchEvent(endEvent);
  }

  function contextmenu(event) {
    if (_this.enabled === false) return;

    event.preventDefault();
  }

  this.dispose = function () {
    this.domElement.removeEventListener('contextmenu', contextmenu, false);
    this.domElement.removeEventListener('mousedown', mousedown, false);
    this.domElement.removeEventListener('wheel', mousewheel, false);

    this.domElement.removeEventListener('touchstart', touchstart, false);
    this.domElement.removeEventListener('touchend', touchend, false);
    this.domElement.removeEventListener('touchmove', touchmove, false);

    document.removeEventListener('mousemove', mousemove, false);
    document.removeEventListener('mouseup', mouseup, false);

    window.removeEventListener('keydown', keydown, false);
    window.removeEventListener('keyup', keyup, false);
  };

  this.domElement.addEventListener('contextmenu', contextmenu, false);
  this.domElement.addEventListener('mousedown', mousedown, false);
  this.domElement.addEventListener('wheel', mousewheel, false);

  this.domElement.addEventListener('touchstart', touchstart, false);
  this.domElement.addEventListener('touchend', touchend, false);
  this.domElement.addEventListener('touchmove', touchmove, false);

  window.addEventListener('keydown', keydown, false);
  window.addEventListener('keyup', keyup, false);

  this.handleResize();

  // force an update at start
  this.update();
};

TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
// TrackballControls.prototype.constructor = THREE.TrackballControls;

export default TrackballControls;
