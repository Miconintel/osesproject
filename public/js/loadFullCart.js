const loadFullcart = function (state, parentCont) {
  console.log(state.bookmarkPro.map((el) => el[0].price));
  const ids = [];
  const loadedCarts = state.bookmarkPro
    .map((el) => {
      // ids.push(el[0].id)
      return `<figure class="cart--list__element flex" id=${el[0].id}>
      <div class="cart--list__image"><img src="/img/product-images/${
        el[0].image
      }" alt="${el[0].slug}" class="image image--cart__list" /></div>
      <a class="link link--product--name" href="/productname/${
        el[0].slug
      }?page=1"><figcaption class="cart--options"><p class="paragraph product-name">${
        el[0].productName
      }</p></figcaption></a>
      <figcaption class="cart--options"><p class="paragraph price">$<span class="price--effect">${el[0].price.toFixed(
        1
      )}</span></p></figcaption>
      <div class="input--container">
        <button
          class="button button--icon button-plus-minus button--minus"
        >
          <svg class="feather">
            ${feather.icons.minus.toSvg({
              class: 'icon icon--minus icon-plus-minus',
            })}
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
            ${feather.icons.plus.toSvg({
              class: 'icon icon--minus icon-plus-minus',
            })}
          </svg>
        </button>
      </div>
      <figcaption class="cart--options"><p class="paragraph price">$<span class="price--effect sub--totals" data-src="totals">${
        el[1] * el[0].price.toFixed(1)
      }</span></p></figcaption>
      <button class="button button--close  mobile--nav--button">
        <svg class="feather">
          ${feather.icons.x.toSvg({
            class: 'icon icon--minus icon-plus-minus',
          })}
        </svg>
      </button>
    </figure>`;
    })
    .join('');
  // console.log(loadedCarts)

  const headerSide = `  
    <div class="category--header">
        <h2 class="secondary--header">Our Products</h2>

        <div class="category--list-container">
        <h3 class="tertiary--header">
            <a href="/?product=all-products&page=1" class="link link--category active"
            >Products</a
            >
        </h3>
        <h3 class="tertiary--header">
            <a href="/?category=Provisions&page=1" class="link link--category">Provisions</a>
        </h3>
        <h3 class="tertiary--header">
            <a href="/?category=Grains&page=1" class="link link--category">Grains</a>
        </h3>
        <h3 class="tertiary--header">
            <a href="/?category=Flour&page=1" class="link link--category">Flours</a>
        </h3>
        <h3 class="tertiary--header">
            <a href="/?category=Spices&page=1" class="link link--category">Spices</a>
        </h3>
        <h3 class="tertiary--header">
            <a href="/?category=Animal Protein&page=1" class="link link--category">Meat</a>
        </h3>
        <h3 class="tertiary--header">
            <a href="/?category=Oil&page=1" class="link link--category">Oil</a>
        </h3>
        <h3 class="tertiary--header">
            <a href="/?category=Others&page=1" class="link link--category">Others</a>
        </h3>
        </div>
    </div>`;

  const html = `<section class="cart--section">
      <div class="content">
          <div class="grid grid--2--columns--cart cart--list--container container">
            ${headerSide}
            <div class="cart--lists">
              <div class="cart--list__header cart--list__element flex">
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
                  <p class="paragraph price">$<span class="price--effect grand--total">6</span></p>
                  <p class="paragraph ">Discount</p>
                  <p class="paragraph price">$<span class="price--effect" data-total="totals">0</span></p>
                  <p class="paragraph ">shipping</p>
                  <p class="paragraph price">$<span class="price--effect" data-total="totals">0</span></p>
                </div>
    
                <div class="total">
                 <h3 class="tertiary--header paragraph">Total:</h3>
                 <p class="paragraph price">$<span class="price--effect final--total">6</span></p>
                </div> 
    
               </div>
               <button class="button checkout--button paragraph" >
                  <strong>CHECKOUT</strong>
              </button>
            </div>
              
          </div>
      </div>
    </section>`;

  parentCont.insertAdjacentHTML('afterbegin', html);
};

export default loadFullcart;
