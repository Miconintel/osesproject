// 'use strict';
import 'regenerator-runtime'
import '@babel/polyfill'
import {searchFood} from './search'
import {getCartItem} from './carts'





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
const categoryHeader = document.querySelector('.category--header')
const searchInput = document.querySelector('.search--input')
const ButtonSearch = document.querySelector('.button--search')



// SEARCH BAR
searchFood('Provisions')
let allCat= document.querySelectorAll('.link--category')
allCat=[...allCat]
const catName = allCat.map(e=>e.textContent)

const speak = catName.some(e=>e==='Provisions')


const n = 'g'.slice(0,1).toUpperCase().concat('grai'.slice(1,)).startsWith('Grains'.slice(0,2))
const cif = catName.filter(el=>'gr'.slice(0,1).toUpperCase().concat('gr'.slice(1)).startsWith(el.slice(0,2)))


let queryHead;
const searchFunction= e=>{
  // e.preventDefault()
  
  let productCategory = searchInput.value 
  const cif = catName.filter(el=>productCategory.slice(0,1).toUpperCase().concat(productCategory.slice(1)).startsWith(el.slice(0,2)))
  productCategory = cif.join('') || productCategory.slice(0,1).toUpperCase().concat(productCategory.slice(1))
  if(catName.some(e=>e===productCategory)){
    queryHead='category'
  }else{
    queryHead='productName'
  }

window.localStorage.setItem('qhead', queryHead);
  if(!productCategory)return console.log('please input something')
   ButtonSearch.setAttribute('href',`/?${queryHead}=${productCategory}&page=1`)
   window.localStorage.setItem('isClicked', JSON.stringify(productCategory));
  
 }
ButtonSearch.addEventListener('click',searchFunction)
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

const loadNewbookmarked = function (par,itemNo,itemName) {
  const html = `<div class="add-to-cart-container"><p class="added--to--cart">Added ${itemNo?itemNo:''} ${itemName?itemName:''} to cart</p>
  <button class="button button--remove--cart">
remove
</button></div>
  `;
  par.insertAdjacentHTML('beforeend', html);
};
let allState = {
  proCount:0,
  cartCount: 0,
  bookmarkItems: [],
  bookmarkPro :[]
};



// let cartCount = 0;
const assignCartNumber = function (state) {
  cartNumber.textContent = state.cartCount;
};

// HANDLER FUNCTION


const addToCartPro = async function(clickedProduct,noOfItems){

  const bookmarkPro = await getCartItem(clickedProduct.id)
  const {data} = bookmarkPro
  const allData = [data, noOfItems ]
  allState.bookmarkPro.push(allData);
  window.localStorage.setItem('state', JSON.stringify(allState));
  allState.proCount++
 

}


const addtoCart =  function (e) {
  const clicked = e.target.closest('.button--cart');
  if (clicked) {
    // mark bookmark true
    console.log('clicked')
    const numberofProducts = clicked.previousElementSibling.children[1].value
    addToCartPro(clicked,numberofProducts*1)
  
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
    loadNewbookmarked(parentOuter,numberofProducts,bookmarkItem);

    // increase counter
    allState.cartCount++;
    assignCartNumber(allState);
    window.localStorage.setItem('state', JSON.stringify(allState));
  }
};

parentCartContainer&&parentCartContainer.addEventListener('click', addtoCart);

// REMOVE FROM CART

const removeCartPro = function(parentEl){
  allState.bookmarkPro=allState.bookmarkPro.filter(el=>{
    return el[0].productName !== parentEl.children[1].children[1].textContent
   })

   allState.proCount--
}

const removeCart = function (e) { 
  // console.log(e.target);
  const clicked = e.target.classList.contains('button--remove--cart');
  if (clicked) {
    console.log('clicked')
    // remove item from cart
    const productParent = e.target.closest('.product');
    productParent.setAttribute('data-page', false);
    allState.bookmarkItems= allState.bookmarkItems.filter(el=>{

    return el !==productParent.children[1].children[1].textContent
   })

   removeCartPro(productParent)
    // return the cart btton
   
   allState.cartCount-- 
   assignCartNumber(allState);
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


// GET LOCAL STATE

const localState = JSON.parse(window.localStorage.getItem('state'));
if (localState) {
 
  console.log(localState.bookmarkPro)
  // allState = localState;
  // allState.cartCount = localState.cartCount
  // should havebeen allState.cartcount = localState.bookmarkItems.length
  localState.cartCount=localState.proCount=localState.bookmarkItems.length
  allState.cartCount=localState.bookmarkItems.length
  allState = localState
  assignCartNumber(allState);

}


// RELOAD BUTTONS 

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
reloadButtons(localState)


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
  const logoForProduct = e.target.closest('.header--logo__container')
  if (logoForProduct) window.localStorage.setItem('isClicked', JSON.stringify('All Products'));
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
const addActive= e=>{
  
  const clicked = e.target.closest('.tertiary--header')
 
  if (!clicked) return
 const allChildren = clicked.parentElement.children
 const siblings = [...allChildren].filter(el=>{
  return el!==clicked
 })
   
  siblings.forEach(e=>{ 
    const targetEl = e.firstChild
    targetEl.classList.remove('active')
    
})

   clicked.firstChild.classList.add('active')
   window.localStorage.setItem('isClicked', JSON.stringify(clicked.firstChild.textContent));

}


const lit = JSON.parse(window.localStorage.getItem('isClicked'))
const linkCategories = [...document.querySelectorAll('.link--category')]


// using window.location.search to confirm home page (window.location.search.length!==0)


if(lit && window.location.search.length!==0){
  const linkPreserveActive= linkCategories.filter(el=>{
    if(el.textContent===lit) {el.classList.add('active')}else{
      el.classList.remove('active')
    }
   return el.textContent===lit
    
  })
}

categoryHeader && categoryHeader.addEventListener('click',addActive)


// CATEGORIES FROM THE CARDS

parentCartContainer && parentCartContainer.addEventListener('click',e=>{
  const clicked = e.target.closest('.category')
  if (clicked)
  window.localStorage.setItem('isClicked', JSON.stringify(clicked.firstChild.textContent));
  
})

// CATEGORIES FROM PRODUCT DETAILS
const productInnerContainer = document.querySelector('.inner--container__product')

productInnerContainer && productInnerContainer.addEventListener('click',e=>{
  const clicked =e.target.closest('.category')
  if(clicked){
    window.localStorage.setItem('isClicked', JSON.stringify(clicked.firstChild.textContent));
  }
})

// parentCartContainer && parentCartContainer.addEventListener('click',e=>{
//   const clicked = e.target.closest('.category')
//   if (clicked)
//   window.localStorage.setItem('isClicked', JSON.stringify(clicked.firstChild.textContent));
  
// })


const fullDescription = document.querySelector('.full--product--description')

const addToCartProduct = e=>{
  const clicked = e.target.closest('.button--cart');
  if(!clicked)return
      const parentOuter = clicked.closest(
      '.inner--container__product'
    )
    const bookmarkItem = parentOuter.children[3].textContent;
    allState.bookmarkItems.push(bookmarkItem);

    const parentInner = clicked.parentElement;
    parentInner.classList.add('hide--again');
      loadNewbookmarked(parentOuter);

    allState.cartCount++;
    assignCartNumber(allState);
        window.localStorage.setItem('state', JSON.stringify(allState));

}

fullDescription && fullDescription.addEventListener('click',addToCartProduct)

// AUTOMATED RELOAD FOR PRODUCT PAGE
const reloadButton = function(state){
  if(!window.location.pathname.includes('product')) return

  const product = document.querySelector('.product-name');
  const parent = product.parentElement
  const cartButton = parent.children[parent.children.length-1]
  
  if (
    state.bookmarkItems.some((eli) => {
      return eli === product.textContent;
    })
  ) {
    cartButton.classList.add('hide--again');
    loadNewbookmarked(parent)
  }

  }
  reloadButton(localState)


  const removeCartProduct = function (e) {
    // console.log(e.target);
    const clicked = e.target.classList.contains('button--remove--cart');
    if (clicked) {
     
      // remove item from cart
      const productParent = e.target.closest('.inner--container__product'); 
     allState.bookmarkItems= allState.bookmarkItems.filter(el=>{
  
      return el !==productParent.children[3].textContent
     })
      // return the cart btton
    allState.cartCount--
    assignCartNumber(allState);
    window.localStorage.setItem('state', JSON.stringify(allState));
    const cartB =   productParent.children[productParent.children.length-2]
    cartB.classList.remove('hide--again')
    const childPull =  productParent.children[productParent.children.length-1]
    productParent.removeChild(childPull)
      // persist crt
    }
  };

  fullDescription && fullDescription.addEventListener('click',removeCartProduct)

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

  productInnerContainer && productInnerContainer.addEventListener('click',increaseCartProductDetails)


  // DISPLAY CART
  const cartDisplay = document.querySelector('#cart--display')
  const main = document.querySelector('main')  
  const headerH = document.querySelector('.header--nav')
  const mainMain = body.children[1]
  const sections = [...document.querySelectorAll('section')]
  const closeCart = document.querySelector('.close--cart')
  const closeContainer = document.querySelector('.close--cart--container')
  console.log(closeContainer)

  // handlerfunction

const loadEmptyCart = function(){
  const html = `<div class="close--cart--container"><p class="paragraph cart--is--empty">your cart is empty, kindly add an item to view cart <p> <p class="close--cart button">close<p><div>`
  cartDisplay.insertAdjacentHTML('beforeend', html)
}

  const showCarts = e=>{
    const clicked = e.target.closest('.button--cart')
    if(clicked){
      if(allState.bookmarkPro.length === 0)return loadEmptyCart()
      
      sections.forEach(el=>main.removeChild(el))
      console.log(sections)

    }
  }

headerH.addEventListener('click',showCarts)

cartDisplay.addEventListener('click', e=>{
  
 const clicked= e.target.closest('.close--cart--container')
 if (!clicked)return
 const toClose = clicked.closest('.close--cart--container')
 cartDisplay.removeChild(toClose)

})
 