// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// 'use strict';
feather.replace(); // SELECT ITEMS

var dotContainer = document.querySelector('.dots--container');
var slides = document.querySelectorAll('.slide');
var buttonLeft = document.querySelector('.button--chevron__left');
var buttonRight = document.querySelector('.button--chevron__right');
var header = document.querySelector('.main--header');
var slider = document.querySelector('.slider');
var parentCartContainer = document.querySelector('.product--container');
var navContainer = document.querySelector('.nav');
var footerLogo = document.querySelector('.footer--logo');
var body = document.querySelector('body');
var hero = document.querySelector('.hero--section');
var mobileContainer = document.querySelector('.mobile--nav--button--container');
var cartNumber = document.querySelector('.cart--number');
var pageLink = document.querySelector('.page--link');
var categoryHeader = document.querySelector('.category--header'); //
//
//
//
//
// MOBILE NAV

if (mobileContainer) {
  mobileContainer.addEventListener('click', function (e) {
    var clicked = e.target.closest('.mobile--nav--button');

    if (clicked) {
      e.preventDefault();

      if (clicked.classList.contains('mobile--menu')) {
        console.log(clicked);
        header.classList.add('open');
      } else if (clicked.classList.contains('mobile--close')) header.classList.remove('open');
    }
  });
} // CART BUTTON
//
//
//


var increaseCart = function increaseCart(e) {
  var clicked = e.target.closest('.button-plus-minus');

  if (clicked) {
    var cartNum;
    e.preventDefault();

    if (clicked.firstElementChild.classList.contains('feather-plus')) {
      cartNum = clicked.previousElementSibling.value * 1;
      cartNum++;
      console.log(cartNum);
      clicked.previousElementSibling.value = cartNum;
    } else if (clicked.firstElementChild.classList.contains('feather-minus')) {
      cartNum = clicked.nextElementSibling.value * 1;
      if (cartNum !== 1) cartNum--;
      clicked.nextElementSibling.value = cartNum;
    }
  }
};

parentCartContainer && addEventListener('click', increaseCart); // // add to cart

var loadNewbookmarked = function loadNewbookmarked(par) {
  var html = "<div class=\"add-to-cart-container\"><p class=\"added--to--cart\">Added to cart</p>\n  <button class=\"button button--remove--cart\">\nremove\n</button></div>\n  ";
  par.insertAdjacentHTML('beforeend', html);
};

var allState = {
  cartCount: 0,
  bookmarkItems: []
}; // let cartCount = 0;

var assignCartNumber = function assignCartNumber() {
  cartNumber.textContent = allState.cartCount;
}; // HANDLER FUNCTION


var addtoCart = function addtoCart(e) {
  var clicked = e.target.closest('.button--cart');

  if (clicked) {
    // mark bookmark true
    var productParent = clicked.closest('.product');
    productParent.setAttribute('data-page', true); // get the bookmark item and bookmark

    var parentOuter = clicked.closest('.product--description--container');
    var bookmarkItem = parentOuter.children[1].textContent;
    allState.bookmarkItems.push(bookmarkItem); // hide book markbutton and show bookmarled

    var parentInner = clicked.parentElement;
    parentInner.classList.add('hide--again'); // show already bookmarked button

    loadNewbookmarked(parentOuter); // increase counter

    allState.cartCount++;
    assignCartNumber();
    window.localStorage.setItem('state', JSON.stringify(allState));
  }
};

parentCartContainer && addEventListener('click', addtoCart);
var localState = JSON.parse(window.localStorage.getItem('state'));

if (localState) {
  allState = localState;
  allState.cartCount = allState.bookmarkItems.length;
  assignCartNumber();
}

var reloadButtons = function reloadButtons(state) {
  // persist cart
  // get all products
  var allProducts = _toConsumableArray(document.querySelectorAll('.product')); // check for the text content of each card


  var iniP = allProducts.map(function (el) {
    return el.children[1].children[1].textContent;
  }); // confirm which in bookmark

  allProducts.forEach(function (el) {
    // check for true or false if items in bookmark match with product card names
    var f = state.bookmarkItems.some(function (eli) {
      return eli === el.children[1].children[1].textContent;
    }); // set to true if it does

    if (state.bookmarkItems.some(function (eli) {
      return eli === el.children[1].children[1].textContent;
    })) {
      el.setAttribute('data-page', true);
    } // persist if dataset.page is true


    if (el.dataset.page == 'true') {
      var parent = el.children[1].children[4];
      parent.classList.add('hide--again');
      loadNewbookmarked(el.children[1]);
    } // if (el.dataset.page == 'true') {
    //   const parent = el.children[1].children[4];
    //   parent.classList.add('hide--again');
    //   loadNewbookmarked(el.children[1]);
    // }

  });
};

reloadButtons(allState); // REMOVE FROM CART

var removeCart = function removeCart(e) {
  // console.log(e.target);
  var clicked = e.target.classList.contains('button--remove--cart');

  if (clicked) {
    // remove item from cart
    var productParent = e.target.closest('.product');
    productParent.setAttribute('data-page', false);
    allState.bookmarkItems = allState.bookmarkItems.filter(function (el) {
      return el !== productParent.children[1].children[1].textContent;
    }); // return the cart btton

    allState.cartCount--;
    assignCartNumber();
    window.localStorage.setItem('state', JSON.stringify(allState)); // reloadButtons(allState)

    productParent.children[1].children[4].classList.remove('hide--again');
    var parentPull = productParent.children[1];
    var childPull = parentPull.children[5];
    parentPull.removeChild(childPull); // persist crt
  }
};

parentCartContainer && parentCartContainer.addEventListener('click', removeCart); /// SET HERO HEIGHT
//
//
//

var ChangeHeroSize = function ChangeHeroSize() {
  // I could hae also used getBoundingclient rect and get the nubers in number  type withput hving to parse int and now calculate it inside a iteral string , but it is god that i also know the get computed style.
  // get headerheight
  var headerHeight = slider && parseInt(window.getComputedStyle(header).height); // getslidereigt

  var sliderHeight = slider && parseInt(window.getComputedStyle(slider).height); // console.log(sliderHeight);
  // compute new height

  var herowidth = (hero === null || hero === void 0 ? void 0 : hero.getBoundingClientRect().width) * 1;
  if (herowidth && herowidth > 390) slider.style.maxHeight = "".concat(sliderHeight - headerHeight, "px");
};

ChangeHeroSize(); // SET HERO SLIDER
//
//

var count = 0;
var checkTimeout; // CREATE DOT

var createDot = function createDot() {
  slides.forEach(function (_, i) {
    var html = "<button class=\"dot\" data-slide=\"".concat(i, "\"></button>");
    dotContainer.insertAdjacentHTML('beforeend', html);
  });
}; // let dots;
// SLIDE POSITION


var pos = function pos(count) {
  slides.forEach(function (s, i) {
    var newP = (i - count) * 100;
    s.style.transform = "translateX(".concat(newP, "%)");
  });

  var fg = function fg(c) {
    dots.forEach(function (dot, i, arr) {
      // add active class for the present dot
      arr[c].classList.add('dot--active'); // remove active class from dot that is not active

      if (dot.dataset.slide !== c && dot !== arr[c]) {
        dot.classList.remove('dot--active');
      }
    });
  };

  fg(count);
}; // AUTOMATIC FUNCTION


function setAutomatedTimeout() {
  checkTimeout = setInterval(function () {
    if (count === slides.length - 1) {
      // if count is equal to index max, return it to zero
      count = 0;
    } else {
      count++;
    }

    pos(count);
  }, 10000);
  return checkTimeout;
} // IMMEDIATELY INVOKED INIT FUNCTION


var dots;

(function () {
  createDot();
  dots = document.querySelectorAll('.dot');
  pos(0);
  setAutomatedTimeout();
})(); // MOVE RIGHT FUNCTION


var moveRight = function moveRight() {
  if (checkTimeout) {
    // console.log(chck);
    clearInterval(checkTimeout);
  } // if the count is equal to the nuber of array index or array length minus one , return count to zero, because count minus the item in the same number should alwas return xero, so if there is no item in the same index number or array length minus one with count return count to zero.


  if (count === slides.length - 1) {
    count = 0; // pos(count);
  } else {
    count++;
  }

  pos(count);
  setAutomatedTimeout();
}; // MOVE LEFT FUNCTION


var moveLeft = function moveLeft() {
  if (checkTimeout) {
    // if timeout is there clear timeout
    clearInterval(checkTimeout);
  } // second if


  if (count == 0) {
    count = slides.length - 1;
  } else {
    count--;
  }

  pos(count);
  setAutomatedTimeout();
};

var moveWithDots = function moveWithDots(e) {
  if (checkTimeout) {
    // if timeout is there clear timeout
    clearInterval(checkTimeout);
  }

  var clicked = e.target.classList.contains('dot');

  if (clicked) {
    var slide = e.target.dataset.slide;
    slide = slide * 1; // pick the sibs by referencing the parent which is dotcontainer

    var sib = e.target.closest('.dots--container').querySelectorAll('.dot'); // assign slide

    if (slide < slides.length) {
      count = slide;
    } else {
      count = count;
    }

    pos(slide); // my dot logic

    e.target.classList.add('dot--active');
    sib.forEach(function (s) {
      if (s !== e.target) {
        s.classList.remove('dot--active');
      }
    });
  }
};

buttonLeft && buttonLeft.addEventListener('click', moveLeft);
buttonRight && buttonRight.addEventListener('click', moveRight);
dotContainer && dotContainer.addEventListener('click', moveWithDots); // SMOOTH SCROLL WITH EVENT DELEGATION
//
//

navContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('nav--link')) {
    e.preventDefault();
    var idShowninHref = e.target.getAttribute('href');
    var elementOfEquivalentId = document.querySelector(idShowninHref);
    elementOfEquivalentId === null || elementOfEquivalentId === void 0 ? void 0 : elementOfEquivalentId.scrollIntoView({
      behavior: 'smooth'
    });
  }
}); // SMOOTH SCROLL TO TOP PAGE
//
//
//

document.addEventListener('click', function (e) {
  var clicked = e.target.closest('.image--link');

  if (clicked) {
    // e.preventDefault();
    var headerSectionCord = header.getBoundingClientRect();
    window.scrollTo({
      left: headerSectionCord.left + window.pageXOffset,
      top: headerSectionCord.top + window.pageXOffset,
      behavior: 'smooth'
    });
  }
}); // ADD STICKY NAV
//
//
//
// the nav is fixed incase the user doesnt enable script, but then it is removed as soon as the sript starts running in this next line of code

header.classList.remove('fixed');
var headerHeight = header.getBoundingClientRect().height;
var headerwidth = header.getBoundingClientRect().width;
var width = window.getComputedStyle(header).width;

var headerObserverCallback = function headerObserverCallback(entries, observer) {
  var _entries = _slicedToArray(entries, 1),
      entry = _entries[0];

  if (!entry.isIntersecting) {
    header.classList.add('fixed'); // observer.unobserve(header);
  } else {
    header.classList.remove('fixed'); // observer.observe(header);
  } // the second argument is the same observer objet u can use to call the unobserve option and oass in the element u want to unobserve

};

var headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: "-".concat(headerHeight, "px")
};
var observer = new IntersectionObserver(headerObserverCallback, headerObserverOptions);
hero && observer.observe(hero); //
//
// PAGINATION SCROLL
// const scrollOnPage = function () {
//   const rectangle = { pageClicked: false };
//   const pageContainer = document.querySelector('.page--container');
//   if (!pageContainer) return;
//   pageContainer && pageContainer.addEventListener('click', (e) => {
//     const pageButton = e.target.closest('.page--link');
//     if (pageButton) {
//       rectangle.pageClicked = true;
//       const b = pageContainer.getBoundingClientRect();
//       rectangle.top = b.top;
//       rectangle.left = b.left;
//       window.localStorage.setItem('rectangle', JSON.stringify(rectangle));
//     }
//   });
//   const useRect = JSON.parse(window.localStorage.getItem('rectangle'));
//   if (useRect && useRect.pageClicked) {
//     // console.log(useRect.pageClicked);
//     window.scrollTo({
//       left: useRect.left + window.pageXOffset,
//       top: useRect.top + window.pageXOffset,
//       behavior: 'smooth',
//     });
//   }
// };
// scrollOnPage();
//   ADDING ACTIVE BUTTON TO RHE CATEGORIES

var addActive = function addActive(e) {
  // e.preventDefault()
  var clicked = e.target.closest('.tertiary--header');
  if (!clicked) return;
  var allChildren = clicked.parentElement.children;

  var siblings = _toConsumableArray(allChildren).filter(function (el) {
    return el !== clicked;
  });

  siblings.forEach(function (e) {
    var targetEl = e.firstChild;
    targetEl.classList.remove('active');
  });
  clicked.firstChild.classList.add('active');
  window.localStorage.setItem('isClicked', JSON.stringify(clicked.firstChild.textContent));
};

var lit = JSON.parse(window.localStorage.getItem('isClicked'));

var linkCategories = _toConsumableArray(document.querySelectorAll('.link--category')); // using window.location.search to confirm home page


if (lit && window.location.search.length !== 0) {
  var linkPreserveActive = linkCategories.filter(function (el) {
    if (el.textContent === lit) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }

    return el.textContent === lit;
  });
  console.log(linkPreserveActive);
}

categoryHeader.addEventListener('click', addActive);
parentCartContainer.addEventListener('click', function (e) {
  var clicked = e.target.closest('.category');
  if (clicked) window.localStorage.setItem('isClicked', JSON.stringify(clicked.firstChild.textContent));
});

https: //www.facebook.com/
console.log("".concat(window.location.protocol, "//").concat(window.location.host));
},{}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58748" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/bundle.js.map