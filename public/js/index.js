// 'use strict';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime';
import '@babel/polyfill';
import { searchFood } from './search';
import { getCartItem } from './carts';
import loadFullcart from './loadFullCart';
import { signUp } from './logins';
import { logout } from './logins';
import { login } from './logins';
import { buyFood } from './stripe';
import { showAlert } from './alert';
import View from './view/view';
import { searchHandlerFunction } from './helper/handler';

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
const categoryHeader = document.querySelector('.category--header');
const searchInput = document.querySelector('.search--input');
const buttonSearch = document.querySelector('.button--search');

const view = new View(buttonSearch);
view.clickHandler(searchHandlerFunction);
console.log(view);

// SEARCH BAR
searchFood('Provisions');
let allCat = document.querySelectorAll('.link--category');
allCat = [...allCat];
const catName = allCat.map((e) => e.textContent);

const speak = catName.some((e) => e === 'Provisions');

const hiu = [2, 4, 5, 7];

// console.log(hiu.filter((e) => 2 === e).join());

const n = 'g'
  .slice(0, 1)
  .toUpperCase()
  .concat('grai'.slice(1))
  .startsWith('Grains'.slice(0, 2));
const cif = catName.filter((el) =>
  'gr'
    .slice(0, 1)
    .toUpperCase()
    .concat('gr'.slice(1))
    .startsWith(el.slice(0, 2))
);

let queryHead;
const searchFunction = (e) => {
  // e.preventDefault()

  let productCategory = searchInput.value;
  const cif = catName.filter((el) =>
    productCategory
      .slice(0, 1)
      .toUpperCase()
      .concat(productCategory.slice(1))
      .startsWith(el.slice(0, 2))
  );
  productCategory =
    cif.join('') ||
    productCategory
      .slice(0, 1)
      .toUpperCase()
      .concat(productCategory.slice(1));
  if (catName.some((e) => e === productCategory)) {
    queryHead = 'category';
  } else {
    queryHead = 'productName';
  }

  window.localStorage.setItem('qhead', queryHead);
  if (!productCategory) return console.log('please input something');
  buttonSearch.setAttribute(
    'href',
    `/?${queryHead}=${productCategory}&page=1`
  );
  window.localStorage.setItem(
    'isClicked',
    JSON.stringify(productCategory)
  );
};
buttonSearch.addEventListener('click', searchFunction);
//
//
//
// MOBILE NAV

if (mobileContainer) {
  mobileContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.mobile--nav--button');

    if (clicked) {
      // e.preventDefault();
      if (clicked.classList.contains('mobile--menu')) {
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
    // e.preventDefault();

    if (clicked.firstElementChild.classList.contains('feather-plus')) {
      cartNum = clicked.previousElementSibling.value * 1;
      cartNum++;

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

parentCartContainer && addEventListener('click', increaseCart);

// // add to cart

const loadNewbookmarked = function (par, itemNo, itemName) {
  const html = `<div class="add-to-cart-container"><p class="added--to--cart">Added ${
    itemNo ? itemNo : ''
  } ${itemName ? itemName : ''} to cart</p>
  <button class="button button--remove--cart">
remove
</button></div>
  `;
  par.insertAdjacentHTML('beforeend', html);
};
let allState = {
  proCount: 0,
  cartCount: 0,
  bookmarkItems: [],
  bookmarkPro: [],
};

// let cartCount = 0;
const assignCartNumber = function (state) {
  cartNumber.textContent = state.cartCount;
};

// HANDLER FUNCTION

const addToCartPro = async function (clickedProduct, noOfItems) {
  const bookmarkPro = await getCartItem(clickedProduct.id);
  const { data } = bookmarkPro;
  const allData = [data, noOfItems];
  const newData = [...allState.bookmarkPro, allData];
  allState.bookmarkPro = newData;
  // allState.bookmarkPro.push(allData);
  window.localStorage.setItem('state', JSON.stringify(allState));
  // allState.proCount++
};

const addtoCart = function (e) {
  const clicked = e.target.closest('.button--cart');
  if (clicked) {
    // mark bookmark true

    const numberofProducts =
      clicked.previousElementSibling.children[1].value;
    addToCartPro(clicked, numberofProducts * 1);

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
    loadNewbookmarked(parentOuter, numberofProducts, bookmarkItem);

    // increase counter
    allState.cartCount++;
    allState.proCount++;
    assignCartNumber(allState);
    window.localStorage.setItem('state', JSON.stringify(allState));
  }
};

parentCartContainer &&
  parentCartContainer.addEventListener('click', addtoCart);

// REMOVE FROM CART

const removeCartPro = function (parentEl) {
  allState.bookmarkPro = allState.bookmarkPro.filter((el) => {
    return (
      el[0].productName !== parentEl.children[1].children[1].textContent
    );
  });
  allState.proCount--;
};

const removeCart = function (e) {
  // console.log(e.target);
  const clicked = e.target.classList.contains('button--remove--cart');
  if (clicked) {
    // remove item from cart
    const productParent = e.target.closest('.product');
    productParent.setAttribute('data-page', false);
    allState.bookmarkItems = allState.bookmarkItems.filter((el) => {
      return el !== productParent.children[1].children[1].textContent;
    });

    removeCartPro(productParent);
    // return the cart btton

    allState.cartCount--;
    assignCartNumber(allState);
    window.localStorage.setItem('state', JSON.stringify(allState));

    productParent.children[1].children[4].classList.remove('hide--again');
    const parentPull = productParent.children[1];
    const childPull = parentPull.children[5];
    parentPull.removeChild(childPull);
    // persist crt
  }
};

parentCartContainer &&
  parentCartContainer.addEventListener('click', removeCart);

// GET LOCAL STATE

const localState = JSON.parse(window.localStorage.getItem('state'));
if (localState) {
  // allState = localState;
  // allState.cartCount = localState.cartCount
  // should havebeen allState.cartcount = localState.bookmarkItems.length
  localState.cartCount = localState.proCount =
    localState.bookmarkItems.length;
  allState.cartCount = localState.bookmarkItems.length;
  allState = localState;
  assignCartNumber(allState);
}

// RELOAD BUTTONS

const reloadButtons = function (state) {
  // persist cart
  // get all products
  const allProducts = [...document.querySelectorAll('.product')];
  // check for the text content of each card not used
  const iniP = allProducts.map(
    (el) => el.children[1].children[1].textContent
  );
  // confirm which in bookmark not used
  allProducts.forEach((el) => {
    // check for true or false if items in bookmark match with product card names
    const f = state.bookmarkItems.some((eli) => {
      return eli === el.children[1].children[1].textContent;
    });
    // set to true if it does
    const itemToCheck = el.children[1].children[1].textContent;
    if (
      state.bookmarkItems.some((eli) => {
        return eli === itemToCheck;
      })
    ) {
      // el.setAttribute('data-page', true); no longer used
      // get the value by filtering bookmark pro to get the item loaded  since bookmarkpro also saves the item number
      const which = state.bookmarkPro.filter(
        (el) => el[0].productName == itemToCheck
      );
      const [noAdded] = which;
      const parent = el.children[1].children[4];
      parent.classList.add('hide--again');
      loadNewbookmarked(el.children[1], noAdded[1], itemToCheck);
    }

    // persist if dataset.page is true

    // if (el.dataset.page == 'true') {
    //   const parent = el.children[1].children[4];
    //   parent.classList.add('hide--again');
    //   loadNewbookmarked(el.children[1]);}
  });
};
reloadButtons(allState);

/// SET HERO HEIGHT
//
//
//

const ChangeHeroSize = function () {
  // I could hae also used getBoundingclient rect and get the nubers in number  type withput hving to parse int and now calculate it inside a iteral string , but it is god that i also know the get computed style.
  // get headerheight
  let headerHeight =
    slider && parseInt(window.getComputedStyle(header).height);
  // getslidereigt
  let sliderHeight =
    slider && parseInt(window.getComputedStyle(slider).height);
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
//  arranging a promise to controltime
// slides.forEach(e=>e.classList.add('none'))
// const b = new Promise((resolve,reject)=>{
//   setTimeout(()=>{
//     resolve('learn')
//   },3000)
// })
// const c = new Promise((resolve,reject)=>{
//   setTimeout(resolve,10000)
// })

// window.addEventListener('load',()=>{
//   b.then(e=>{
//     slides.forEach(e=>e.classList.remove('none'))
//     })
// })

// SLIDER COUNT

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
dotContainer && dotContainer.addEventListener('click', moveWithDots);

// SMOOTH SCROLL WITH EVENT DELEGATION
//
//

navContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('nav--link')) {
    // e.preventDefault();
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
  const logoForProduct = e.target.closest('.header--logo__container');
  if (logoForProduct)
    window.localStorage.setItem('isClicked', JSON.stringify('Products'));
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
  } else {
    header.classList.remove('fixed');
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
// ADD STICKY NAV TO OTHER
const otherPageCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    // observer.unobserve(header);
    header.classList.remove('fixed');
  } else {
    header.classList.add('fixed');
    // observer.observe(header);
  }
};

const otherPageOptions = {
  root: null,
  threshold: 0,
  rootMargin: `${headerHeight * 20}px`,
};

const observerOtherPage = new IntersectionObserver(
  otherPageCallback,
  otherPageOptions
);
parentCartContainer && observerOtherPage.observe(parentCartContainer);

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
const addActive = (e) => {
  const clicked = e.target.closest('.tertiary--header');

  if (!clicked) return;
  const allChildren = clicked.parentElement.children;
  const siblings = [...allChildren].filter((el) => {
    return el !== clicked;
  });

  siblings.forEach((e) => {
    const targetEl = e.firstChild;
    targetEl.classList.remove('active');
  });

  clicked.firstChild.classList.add('active');
  window.localStorage.setItem(
    'isClicked',
    JSON.stringify(clicked.firstChild.textContent)
  );
};

const lit = JSON.parse(window.localStorage.getItem('isClicked'));
const linkCategories = [...document.querySelectorAll('.link--category')];

// using window.location.search to confirm home page (window.location.search.length!==0)

if (
  (lit && window.location.search.length !== 0) ||
  (lit && window.location.pathname.startsWith('/productname'))
) {
  const linkPreserveActive = linkCategories.filter((el) => {
    if (el.textContent === lit) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
    return el.textContent === lit;
  });
}

categoryHeader && categoryHeader.addEventListener('click', addActive);

// CATEGORIES FROM THE CARDS/HOME PAGE

parentCartContainer &&
  parentCartContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.category');
    if (clicked)
      window.localStorage.setItem(
        'isClicked',
        JSON.stringify(clicked.firstChild.textContent)
      );
  });

// CATEGORIES FROM PRODUCT DETAILS
const productInnerContainer = document.querySelector(
  '.inner--container__product'
);

productInnerContainer &&
  productInnerContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.category');
    if (clicked) {
      window.localStorage.setItem(
        'isClicked',
        JSON.stringify(clicked.firstChild.textContent)
      );
    }
  });

// CATEGORIES FROM CARD BY CLICKING THE NAME OF PRODUCT

parentCartContainer &&
  parentCartContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.product-name');
    if (clicked) {
      const clickedParent = clicked.parentElement;
      // console.log(clickedParent)
      const category =
        clickedParent.firstElementChild.firstChild.textContent;
      window.localStorage.setItem('isClicked', JSON.stringify(category));
    }
  });

document.addEventListener('click', (e) => {
  const traceOut =
    e.target.closest('.cart--section')?.children[0].children[0];
  //  console.log(traceOut)
  if (traceOut && e.target.closest('.tertiary--header')) {
    const categoryAdded = e.target.firstChild.textContent;
    window.localStorage.setItem(
      'isClicked',
      JSON.stringify(categoryAdded)
    );
  }
});
// CATEGORIES FROM CART LIST PAGE

// parentCartContainer && parentCartContainer.addEventListener('click',e=>{
//   const clicked = e.target.closest('.category')
//   if (clicked)
//   window.localStorage.setItem('isClicked', JSON.stringify(clicked.firstChild.textContent));

// })

const fullDescription = document.querySelector(
  '.full--product--description'
);

const addToCartProduct = (e) => {
  const clicked = e.target.closest('.button--cart');
  if (!clicked) return;
  const parentOuter = clicked.closest('.inner--container__product');
  const bookmarkItem = parentOuter.children[3].textContent;
  const parentInner = clicked.parentElement;
  const valueAdded = parentInner.children[0].children[1].value;
  allState.bookmarkItems.push(bookmarkItem);
  addToCartPro(clicked, valueAdded);

  parentInner.classList.add('hide--again');
  loadNewbookmarked(parentOuter, valueAdded, bookmarkItem);

  allState.cartCount++;
  assignCartNumber(allState);
  window.localStorage.setItem('state', JSON.stringify(allState));
};

fullDescription &&
  fullDescription.addEventListener('click', addToCartProduct);

// AUTOMATED RELOAD FOR PRODUCT PAGE
const reloadButton = function (state) {
  if (!window.location.pathname.includes('product')) return;
  const product = document.querySelector('.product-name');
  const parent = product.parentElement;
  const cartButton = parent.children[parent.children.length - 1];

  if (
    state.bookmarkItems.some((eli) => {
      return eli === product.textContent;
    })
  ) {
    const which = state.bookmarkPro.filter(
      (el) => el[0].productName == product.textContent
    );
    const [noAdded] = which;
    cartButton.classList.add('hide--again');
    loadNewbookmarked(parent, noAdded[1], product.textContent);
  }
};
reloadButton(localState);

const removeCartProduct = function (e) {
  // console.log(e.target);
  const clicked = e.target.classList.contains('button--remove--cart');
  if (clicked) {
    // remove item from cart
    const productParent = e.target.closest('.inner--container__product');
    const itemToRemove = productParent.children[3].textContent;
    allState.bookmarkItems = allState.bookmarkItems.filter((el) => {
      return el !== itemToRemove;
    });
    // manually doing remove cartpro
    allState.bookmarkPro = allState.bookmarkPro.filter((el) => {
      return el[0].productName !== itemToRemove;
    });
    // return the cart btton
    allState.cartCount--;
    assignCartNumber(allState);
    window.localStorage.setItem('state', JSON.stringify(allState));
    const cartB =
      productParent.children[productParent.children.length - 2];
    cartB.classList.remove('hide--again');
    const childPull =
      productParent.children[productParent.children.length - 1];
    productParent.removeChild(childPull);
    // persist crt
  }
};

fullDescription &&
  fullDescription.addEventListener('click', removeCartProduct);

const increaseCartProductDetails = (e) => {
  const clicked = e.target.closest('.button-plus-minus');
  if (clicked) {
    // e.preventDefault();
    let cartNum;
    if (clicked.firstElementChild.classList.contains('feather-plus')) {
      cartNum = clicked.previousElementSibling.value * 1;
      cartNum++;

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

productInnerContainer &&
  productInnerContainer.addEventListener(
    'click',
    increaseCartProductDetails
  );

// DISPLAY CART
const cartDisplay = document.querySelector('#cart--display');
const main = document.querySelector('main');
const headerH = document.querySelector('.header--container');
const mainMain = body.children[1];
const sections = [...document.querySelectorAll('section')];
const closeCart = document.querySelector('.close--cart');
const closeContainer = document.querySelector('.close--cart--container');

// console.log(sections.some((el) => el.classList.contains('cart--section')));
// handlerfunction
let checkIf;
const loadEmptyCart = function (check) {
  const html = `<div class="close--cart--container"><p class="paragraph cart--is--empty">your cart is empty, kindly add an item to view cart <p> <p class="close--cart button">close<p><div>`;
  if (check) return;
  cartDisplay.insertAdjacentHTML('beforeend', html);

  //
  const timeTake = document.querySelector('.close--cart--container');
  checkIf = setTimeout(() => {
    cartDisplay.removeChild(timeTake);
  }, 5000);
};
const calculateSum = function (c) {
  const y = [...document.querySelectorAll(`${c}`)];
  const total = y.map((el) => {
    return el.textContent;
  });

  const grandTotal = total.reduce((acc, el) => {
    return acc + Number(el);
  }, 0);

  const final = grandTotal.toFixed(0);

  const summaryTotals =
    [...document.querySelectorAll('[data-total]')]
      .map((el) => el.textContent)
      .reduce((acc, el) => {
        return acc + Number(el);
      }, 0) + Number(final);

  return [final, summaryTotals];
};

const showCarts = (e) => {
  const clicked = e.target.closest('.button--cart');
  if (clicked) {
    const alreadyOpenedLoaded = document.querySelector(
      '.close--cart--container'
    );
    if (allState.bookmarkPro.length === 0)
      return loadEmptyCart(alreadyOpenedLoaded);

    const secAvail = document.querySelector('.cart--lists');
    // confirm to make sure u have not opened it before so it doesnt open twice,
    // so check if the cartlist section is already opened when the cart button is clicked on the loaded page
    // so u dont have to open it again

    if (!secAvail) {
      sections.forEach((el) => {
        main.removeChild(el);
      });
      console.log(allState.bookmarkPro);
      loadFullcart(allState, main);

      const totals = calculateSum('.sub--totals');
      document.querySelector('.grand--total').textContent = totals[0];
      // console.log(document.querySelector('.final--total'));
      document.querySelector('.final--total').textContent = totals[1];
      const cartCC = document.querySelector('.cart--lists');
      const cartLength = cartCC.children.length;
      if (cartLength >= 5) {
        cartCC.classList.add('scroll');
      }
    }
  }
};

headerH.addEventListener('click', showCarts);

// closing the display message

cartDisplay.addEventListener('click', (e) => {
  const clicked = e.target.closest('.close--cart--container');
  if (!clicked) return;
  console.log(checkIf);
  //  if checkif is there after diaogue is open clear it so it doesnt continue reading
  checkIf && clearTimeout(checkIf);
  const toClose = clicked.closest('.close--cart--container');
  cartDisplay.removeChild(toClose);
});

// adding the quamtity and price
const setNew = function (clicked, currentValue) {
  const bookProList = [...allState.bookmarkPro];

  // get the product whose value has changed
  const itemIndex = bookProList.findIndex((el) => {
    return el[0].id === clicked.id;
  });

  // get the main item
  const mainItem = bookProList[itemIndex];
  mainItem[1] = currentValue;

  bookProList[itemIndex] = mainItem;
  allState.bookmarkPro = bookProList;
  window.localStorage.setItem('state', JSON.stringify(allState));

  console.log(allState.bookmarkPro);
};
let newPrice;
let newValue;
const addQtyPrice = (e) => {
  const clicked = e.target.closest('.cart--list__element');
  if (!clicked || clicked.classList.contains('cart--list__header')) return;
  const checkButton = e.target.closest('.button-plus-minus');
  const priceElement = clicked.children[2].children[0].firstElementChild;
  const priceSpan = Number(priceElement.textContent);
  const subTotalElement =
    clicked.children[4].children[0].firstElementChild;
  const subPrice = Number(subTotalElement.textContent);
  const qtyIcons = clicked.children[3];
  let currentValue = Number(qtyIcons.children[1].value);

  if (checkButton?.classList.contains('button--plus')) {
    currentValue++;
    newValue = currentValue;
    qtyIcons.children[1].value = currentValue;

    // update quantity here

    setNew(clicked, currentValue);

    // const bookProList = [...allState.bookmarkPro];

    // // get the product whose value has changed
    // const itemIndex = bookProList.findIndex((el) => {
    //   return el[0].id === clicked.id;
    // });

    // // get the main item
    // const mainItem = bookProList[itemIndex];
    // mainItem[1] = currentValue;

    // bookProList[itemIndex] = mainItem;
    // console.log(bookProList);

    newPrice = currentValue * priceSpan;
    loadFullcart(allState, main);
    subTotalElement.textContent = newPrice.toFixed(2);
    const totals = calculateSum('.sub--totals');
    document.querySelector('.grand--total').textContent = totals[0];
    document.querySelector('.final--total').textContent = totals[1];
    // console.log(priceSpan,currentValue,subPrice)
  }
  if (
    checkButton?.classList.contains('button--minus') &&
    qtyIcons.children[1].value - 1 !== 0
  ) {
    // console.log(priceSpan,currentValue,subPrice)
    currentValue--;
    newValue = currentValue;
    qtyIcons.children[1].value = currentValue;
    // check the list
    setNew(clicked, currentValue);
    loadFullcart(allState, main);

    newPrice = currentValue * priceSpan;
    subTotalElement.textContent = newPrice.toFixed(2);
    const totals = calculateSum('.sub--totals');
    document.querySelector('.grand--total').textContent = totals[0];
    document.querySelector('.final--total').textContent = totals[1];
  }
};
document.addEventListener('click', addQtyPrice);

document.addEventListener('change', (e) => {
  const clicked = e.target.closest('.product--unit--quantity');
  if (!clicked) return;
  let value = Number(clicked.value);
  if (value == 0) {
    value = 1;
    clicked.value = value;
  }
  const parentEl = clicked.closest('.cart--list__element');
  // console.log(parentEl,value)
  const price = Number(
    parentEl.children[2].children[0].firstElementChild.textContent
  );
  const subTotalElement =
    parentEl.children[4].children[0].firstElementChild;
  subTotalElement.textContent = value * price;
  setNew(parentEl, value);
  const totals = calculateSum('.sub--totals');
  document.querySelector('.grand--total').textContent = totals[0];
  document.querySelector('.final--total').textContent = totals[1];
});

const removeFromCartPAge = (e) => {
  const clicked = e.target.closest('.button--close');
  if (!clicked) return;
  const parentEl = clicked.closest('.cart--list__element');
  const megaParent = clicked.closest('.cart--lists');
  const itemName = parentEl.children[1].children[0].textContent;
  allState.bookmarkItems = allState.bookmarkItems.filter((el) => {
    return el !== itemName;
  });
  allState.bookmarkPro = allState.bookmarkPro.filter((el) => {
    return el[0].productName !== itemName;
  });

  allState.cartCount--;
  allState.proCount--;
  assignCartNumber(allState);
  megaParent.removeChild(parentEl);
  const totals = calculateSum('.sub--totals');
  document.querySelector('.grand--total').textContent = totals[0];
  document.querySelector('.final--total').textContent = totals[1];

  if (megaParent.children.length <= 5) {
    megaParent.classList.remove('scroll');
  }
  window.localStorage.setItem('state', JSON.stringify(allState));
  if (megaParent.children.length == 1) location.reload();
};

document.addEventListener('click', removeFromCartPAge);

// ON CHANGE

// document.addEventListener('change', (e) => {
//   const theInput = e.target.classList.contains('product--unit--quantity');
//   const theParent = e.target.closest('.cart--list__element');

//   if (theInput && theParent) {
//     if (e.target.value == 0) {
//       console.log('please put a number greater than 0');
//       document.querySelector('.checkout--button').classList.add('blur');
//       e.target.value = 1;
//     }
//   }
// });

// SIGN UP FORM'

const form = document.querySelector('.form');

const signU = async (e) => {
  e.preventDefault();
  const formElements = [...document.querySelectorAll('.form--input')];
  if (formElements.some((el) => el.value == ''))
    return console.log('pls fil in the space');
  const h = formElements.map((el) => [el.getAttribute('name'), el.value]);
  const formObj = h && Object.fromEntries(h);
  if (form.lastElementChild.classList.contains('signup--check')) {
    await signUp(
      formObj.firstname,
      formObj.lastname,
      formObj.email,
      formObj.password,
      formObj.passwordConfirmed
    );
  }

  if (form.lastElementChild.classList.contains('login--check')) {
    await login(formObj.email, formObj.password);
  }
};

form && form.addEventListener('submit', signU);

const allButtons = document.querySelector('.all--buttons');

const logouts = async (e) => {
  const clicked = e.target.closest('.list--cta');
  if (clicked && clicked.firstElementChild.id == 'link--outline')
    await logout();
};

allButtons && allButtons.addEventListener('click', logouts);

// CHECKOUT

const checkoutButton = document.querySelector('.checkout--button');
const buyFoodHandler = async (e) => {
  try {
    // console.log(checkoutButton.dataset)

    const parent = e.target.closest('.full--product--description');
    if (parent && e.target.closest('.checkout--button')) {
      const theValueAmount =
        e.target.closest('.checkout--button').previousElementSibling
          .lastElementChild.children[0].children[1].value * 1;
      console.log(theValueAmount);
      const { id } = checkoutButton.dataset;
      const item = [
        {
          id,
          amount: theValueAmount,
        },
      ];

      console.log(item);
      const str = JSON.stringify(item);
      await buyFood(str);
    }
  } catch (err) {
    console.log(err);
  }
};
const buyFoodHandlerMany = async (e) => {
  try {
    const parent = e.target.closest('.checkout--button');
    if (
      parent &&
      parent.closest('.checkout--side') &&
      e.target.closest('.checkout--button')
    ) {
      const all = [...allState.bookmarkPro];
      console.log(all);

      const id = all.map((el) => {
        const item = {
          id: el[0].id,
          amount: el[1],
        };
        return item;
      });

      const str = JSON.stringify(id);
      console.log(str);
      await buyFood(str);
      // const id = all.map((el) => el[0].id).join(',');
      // console.log(id);
      // await buyFood(id);
      //  const {id} =parent.dataset
      //  const idArray = id.split(',')
    }
  } catch (err) {
    console.log(err);
  }
};

checkoutButton && checkoutButton.addEventListener('click', buyFoodHandler);
document.addEventListener('click', buyFoodHandlerMany);

class grandParent {
  #prop;
  constructor(prop) {
    this.#prop = prop;
  }

  calculateProp(el) {
    return this.#prop * el;
  }
}

class parent extends grandParent {
  #parentProp = 3;
  constructor(prop, age) {
    super(prop);
    this.age = age;
  }
}

const rita = new parent(8, 50);

// let number = 6;

// switch (number) {
//   case 1:
//     console.log('this is smallest');
//   case 2:
//     console.log('this is 2');
//   case 6:
//     console.log('this is the one');
//   default:
//     console.log('not found');
// }

let number = [1, 3, 2, 6];

function nums() {
  number.forEach((e) => {
    switch (e) {
      case 1:
        console.log('this is smallest');
        break;
      case 2:
        console.log('this is 2');
        break;
      case 6:
        console.log('this is the one');
        break;
      default:
        console.log('not found');
    }
  });
}
nums();

const arr = [6, 6, 6, 2, 2, 8];

const yu = arr.reduce((acc, el) => {
  !acc.includes(el) && acc.push(el);
  return acc;
}, []);

console.log(yu);

const products = [{ name: 'milo', price: 20 }];

const cart = {
  total: 0,
  quantity: 0,
  items: [],
};

const addToCart = (product, quantity) => {
  const newCart = { ...cart };
  const addedProduct = { ...product, quantity };

  const updatedCart = {
    ...newCart,
    total: newCart.total + addedProduct * quantity,
  };
};

const hy = [8, 9];
