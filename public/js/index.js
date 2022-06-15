// 'use strict';
import "regenerator-runtime"
feather.replace();


// SELECT ITEMS
const dotContainer = document.querySelector('.dots--container');
const slides = document.querySelectorAll('.slide');
const buttonLeft = document.querySelector('.button--chevron__left');
const buttonRight = document.querySelector('.button--chevron__right');
const header = document.querySelector('.main--header');
const slider = document.querySelector('.slider');
const parentCartContainer = document.querySelector('.product--container');
const navContainer = document.querySelector('.nav');
const footerLogo = document.querySelector('.footer--logo');
const body = document.querySelector('body');
const hero = document.querySelector('.hero--section');
const mobileContainer = document.querySelector(
  '.mobile--nav--button--container'
);
const cartNumber = document.querySelector('.cart--number');
const pageLink = document.querySelector('.page--link');

//
//
//
//
//

// MOBILE NAV

if (mobileContainer) {
  mobileContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.mobile--nav--button');

    if (clicked) {
      e.preventDefault();
      if (clicked.classList.contains('mobile--menu')) {
        console.log(clicked);
        header.classList.add('open');
      } else if (clicked.classList.contains('mobile--close'))
        header.classList.remove('open');
    }
  });
}

// CART BUTTON
//
//
//


const increaseCart = (e) => {
  const clicked = e.target.closest('.button-plus-minus');
  if (clicked) {
    let cartNum;
    e.preventDefault();

    if (clicked.firstElementChild.classList.contains('feather-plus')) {
      cartNum = clicked.previousElementSibling.value * 1;
      cartNum++;
      console.log(cartNum);
      clicked.previousElementSibling.value = cartNum;
    } else if (
      clicked.firstElementChild.classList.contains('feather-minus')
    ) {
      cartNum = clicked.nextElementSibling.value * 1;
      if (cartNum !== 1) cartNum--;

      clicked.nextElementSibling.value = cartNum;
    }
  }
};

 parentCartContainer&&addEventListener('click', increaseCart);

// // add to cart

const loadNewbookmarked = function (par) {
  const html = `<div class="add-to-cart-container"><p class="added--to--cart">Added to cart</p>
  <button class="button button--remove--cart">
remove
</button></div>
  `;
  par.insertAdjacentHTML('beforeend', html);
};
let allState = {
  cartCount: 0,
  bookmarkItems: [],
};



// let cartCount = 0;
const assignCartNumber = function () {
  cartNumber.textContent = allState.cartCount;
};

// HANDLER FUNCTION

const addtoCart = function (e) {
  const clicked = e.target.closest('.button--cart');
  if (clicked) {
    // mark bookmark true
    const productParent = clicked.closest('.product');
    productParent.setAttribute('data-page', true);

    // get the bookmark item and bookmark
    const parentOuter = clicked.closest(
      '.product--description--container'
    );
    const bookmarkItem = parentOuter.children[1].textContent;
    allState.bookmarkItems.push(bookmarkItem);

    // hide book markbutton and show bookmarled

    const parentInner = clicked.parentElement;
    parentInner.classList.add('hide--again');

    // show already bookmarked button
    loadNewbookmarked(parentOuter);

    // increase counter

    allState.cartCount++;
    assignCartNumber();
    window.localStorage.setItem('state', JSON.stringify(allState));
  }
};

parentCartContainer&&addEventListener('click', addtoCart);

const localState = JSON.parse(window.localStorage.getItem('state'));
if (localState) {
  allState = localState;
  allState.cartCount=allState.bookmarkItems.length
  assignCartNumber();
}

const reloadButtons = function(state){
// persist cart
// get all products
const allProducts = [...document.querySelectorAll('.product')];
// check for the text content of each card
const iniP = allProducts.map(
  (el) => el.children[1].children[1].textContent
);
// confirm which in bookmark
allProducts.forEach((el) => {
  // check for true or false if items in bookmark match with product card names
  const f = state.bookmarkItems.some((eli) => {
    return eli === el.children[1].children[1].textContent;
  });

  // set to true if it does

  if (
    state.bookmarkItems.some((eli) => {
      return eli === el.children[1].children[1].textContent;
    })
  ) {
    el.setAttribute('data-page', true);
  }

  // persist if dataset.page is true

  if (el.dataset.page == 'true') {
    const parent = el.children[1].children[4];
    parent.classList.add('hide--again');
    loadNewbookmarked(el.children[1]);}
  // if (el.dataset.page == 'true') {
  //   const parent = el.children[1].children[4];

  //   parent.classList.add('hide--again');
  //   loadNewbookmarked(el.children[1]);
  // }
});
}
reloadButtons(allState)

// REMOVE FROM CART

const removeCart = function (e) {
  // console.log(e.target);
  const clicked = e.target.classList.contains('button--remove--cart');
  if (clicked) {
   
    // remove item from cart
    const productParent = e.target.closest('.product');
    productParent.setAttribute('data-page', false);
   allState.bookmarkItems= allState.bookmarkItems.filter(el=>{

    return el !==productParent.children[1].children[1].textContent
   })
    // return the cart btton
   allState.cartCount--
   
   assignCartNumber();
    window.localStorage.setItem('state', JSON.stringify(allState));
    // reloadButtons(allState)
    productParent.children[1].children[4].classList.remove('hide--again')
    const parentPull = productParent.children[1]
    const childPull = parentPull.children[5]
    parentPull.removeChild(childPull)
    
    // persist crt
   
  }
};

parentCartContainer && parentCartContainer.addEventListener('click', removeCart);


/// SET HERO HEIGHT
//
//
//

const ChangeHeroSize = function () {

  // I could hae also used getBoundingclient rect and get the nubers in number  type withput hving to parse int and now calculate it inside a iteral string , but it is god that i also know the get computed style.
  // get headerheight
  let headerHeight = slider&&parseInt(window.getComputedStyle(header).height);
  // getslidereigt
  let sliderHeight =slider&& parseInt(window.getComputedStyle(slider).height);
  // console.log(sliderHeight);
  // compute new height
  const herowidth = hero?.getBoundingClientRect().width * 1;
 
  if (herowidth && herowidth > 390)
    slider.style.maxHeight = `${sliderHeight - headerHeight}px`;
};
ChangeHeroSize();

// SET HERO SLIDER
//
//

let count = 0;
let checkTimeout;

// CREATE DOT
const createDot = function () {
  slides.forEach(function (_, i) {
    const html = `<button class="dot" data-slide="${i}"></button>`;

    dotContainer.insertAdjacentHTML('beforeend', html);
  });
};

// let dots;

// SLIDE POSITION

const pos = function (count) {
  slides.forEach((s, i) => {
    const newP = (i - count) * 100;

    s.style.transform = `translateX(${newP}%)`;
  });

  const fg = function (c) {
    dots.forEach(function (dot, i, arr) {
      // add active class for the present dot
      arr[c].classList.add('dot--active');

      // remove active class from dot that is not active
      if (dot.dataset.slide !== c && dot !== arr[c]) {
        dot.classList.remove('dot--active');
      }
    });
  };
  fg(count);
};

// AUTOMATIC FUNCTION
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
}

// IMMEDIATELY INVOKED INIT FUNCTION
let dots;
(() => {
  createDot();
  dots = document.querySelectorAll('.dot');
  pos(0);
  setAutomatedTimeout();
})();

// MOVE RIGHT FUNCTION
const moveRight = function () {
  if (checkTimeout) {
    // console.log(chck);
    clearInterval(checkTimeout);
  }
  // if the count is equal to the nuber of array index or array length minus one , return count to zero, because count minus the item in the same number should alwas return xero, so if there is no item in the same index number or array length minus one with count return count to zero.
  if (count === slides.length - 1) {
    count = 0;

    // pos(count);
  } else {
    count++;
  }

  pos(count);

  setAutomatedTimeout();
};

// MOVE LEFT FUNCTION

const moveLeft = function () {
  if (checkTimeout) {
    // if timeout is there clear timeout
    clearInterval(checkTimeout);
  }

  // second if
  if (count == 0) {
    count = slides.length - 1;
  } else {
    count--;
  }
  pos(count);

  setAutomatedTimeout();
};

const moveWithDots = function (e) {
  if (checkTimeout) {
    // if timeout is there clear timeout
    clearInterval(checkTimeout);
  }
  const clicked = e.target.classList.contains('dot');

  if (clicked) {
    let { slide } = e.target.dataset;
    slide = slide * 1;

    // pick the sibs by referencing the parent which is dotcontainer
    const sib = e.target
      .closest('.dots--container')
      .querySelectorAll('.dot');

    // assign slide
    if (slide < slides.length) {
      count = slide;
    } else {
      count = count;
    }
    pos(slide);

    // my dot logic
    e.target.classList.add('dot--active');
    sib.forEach((s) => {
      if (s !== e.target) {
        s.classList.remove('dot--active');
      }
    });
  }
};
buttonLeft && buttonLeft.addEventListener('click', moveLeft);
buttonRight && buttonRight.addEventListener('click', moveRight);
buttonRight && dotContainer.addEventListener('click', moveWithDots);

// SMOOTH SCROLL WITH EVENT DELEGATION
//
//

 navContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('nav--link')) {
    e.preventDefault();
    const idShowninHref = e.target.getAttribute('href');
    const elementOfEquivalentId = document.querySelector(idShowninHref);
    elementOfEquivalentId?.scrollIntoView({ behavior: 'smooth' });
  }
});

// SMOOTH SCROLL TO TOP PAGE
//
//
//
document.addEventListener('click', (e) => {
  const clicked = e.target.closest('.image--link');
  if (clicked) {
    // e.preventDefault();
    const headerSectionCord = header.getBoundingClientRect();

    window.scrollTo({
      left: headerSectionCord.left + window.pageXOffset,
      top: headerSectionCord.top + window.pageXOffset,
      behavior: 'smooth',
    });
  }
});

// ADD STICKY NAV
//
//
//
// the nav is fixed incase the user doesnt enable script, but then it is removed as soon as the sript starts running in this next line of code
header.classList.remove('fixed');
const headerHeight = header.getBoundingClientRect().height;
const headerwidth = header.getBoundingClientRect().width;
const width = window.getComputedStyle(header).width;

const headerObserverCallback = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    header.classList.add('fixed');
    // observer.unobserve(header);
  } else {
    header.classList.remove('fixed');
    // observer.observe(header);
  }

  // the second argument is the same observer objet u can use to call the unobserve option and oass in the element u want to unobserve
};

const headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
};

const observer = new IntersectionObserver(
  headerObserverCallback,
  headerObserverOptions
);
hero && observer.observe(hero);

//

//
// PAGINATION SCROLL
const scrollOnPage = function () {
  const rectangle = { pageClicked: false };
  const pageContainer = document.querySelector('.page--container');

  if (!pageContainer) return;

  pageContainer && pageContainer.addEventListener('click', (e) => {
    const pageButton = e.target.closest('.page--link');
    if (pageButton) {
      rectangle.pageClicked = true;
      const b = pageContainer.getBoundingClientRect();
      rectangle.top = b.top;
      rectangle.left = b.left;
      window.localStorage.setItem('rectangle', JSON.stringify(rectangle));
    }
  });

  const useRect = JSON.parse(window.localStorage.getItem('rectangle'));
  if (useRect && useRect.pageClicked) {
    // console.log(useRect.pageClicked);
    window.scrollTo({
      left: useRect.left + window.pageXOffset,
      top: useRect.top + window.pageXOffset,
      behavior: 'smooth',
    });
  }
};
scrollOnPage();

// const b = [1, 5, 8, 9];

// const l = b.some((el) => {
//   return el === 5;
// });

// console.log(l);
