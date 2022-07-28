const loadFullcart = function(state,parentCont){
    const loadedCarts = state.bookmarkPro.map(el=> {
      return `<figure class="cart--list__element flex">
      <div class="cart--list__image"><img src="/img/product-images/${el[0].image}" alt="${el[0].slug}" class="image image--cart__list" /></div>
      <figcaption class="cart--options"><p class="paragraph product-name">${el[0].productName}</p></figcaption>
      <figcaption class="cart--options"><p class="paragraph price">$<span class="price--effect">${el[0].price}</span></p></figcaption>
      <div class="input--container">
        <button
          class="button button--icon button-plus-minus button--minus"
        >
          <svg class="feather">
            ${feather.icons.minus.toSvg({class: "icon icon--minus icon-plus-minus"})}
          </svg>
        </button>
        <input
          type="text"
          class="input product--unit--quantity"
          name="product-unit"
          value="${el[1]}"
        />
        <button
          class="button button--icon button-plus-minus button--plus"
        >
          <svg class="feather">
            ${feather.icons.plus.toSvg({class: "icon icon--minus icon-plus-minus"})}
          </svg>
        </button>
      </div>
      <figcaption class="cart--options"><p class="paragraph price">$<span class="price--effect">${el[1]*el[0].price}</span></p></figcaption>
      <button class="button button--close  mobile--nav--button">
        <svg class="feather">
          ${feather.icons.x.toSvg({class: "icon icon--minus icon-plus-minus"})}
        </svg>
      </button>
    </figure>`
    }).join('')
    console.log(loadedCarts)
    
    
      const html = `<section class="cart--section">
      <div class="content">
          <div class="grid grid--2--columns container">
            <div class="cart--lists">
              <div class="cart--list__header cart--list__element flex">
                  <h3 class="tertiary--header">Item</h3>
                  <h3 class="tertiary--header">Product Name</h3>
                  <h3 class="tertiary--header">Product price</h3>
                  <h3 class="tertiary--header">quantity</h3>
                  <h3 class="tertiary--header">subtotal</h3>
              </div>
              ${loadedCarts}
            </div>
    
            <div class="checkout--side">
    
               <div class="checkout--side__element">
    
                <h3 class="tertiary--header summary--header">Summary</h3>
    
                <div class="summary--container grid grid--2--columns">
                  <p class="paragraph">order total</p>
                  <p class="paragraph">$<span class="price--effect">6</span></p>
                  <p class="paragraph">Discount</p>
                  <p class="paragraph">$<span class="price--effect">6</span></p>
                  <p class="paragraph">shipping</p>
                  <p class="paragraph">$<span class="price--effect">6</span></p>
                </div>
    
                <div class="total">
                 <h3 class="tertiary--header paragraph">Total:</h3>
                 <p class="paragraph">$<span class="price--effect">6</span></p>
                </div> 
    
               </div>
            </div>
              
          </div>
      </div>
    </section>`
    
    parentCont.insertAdjacentHTML('afterbegin',html)
    }

    export default loadFullcart