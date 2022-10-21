import axios from 'axios';
import { showAlert } from './alert';
// import stripe from 'stripe'

// the stripe doesnt have any refrerence because its scriptmis onthe page and make the global variable stripe availaable

const stripe = Stripe(
  `pk_test_51Kqu9NHVqQpkAuMelrOd8IPdiiFI80yCyJj0GQ6Z9XUng3SlyhrGbljFjKUwfyTRx5s8wXxeMqANZXMV3CChjzw500svbt4gYc`
);

// export const buyFoods = async (foodId) => {
//   try {
//     // get checkout ession
//     // const session = await axios(
//     //   `/api/v1/bookings/checkout-session/${foodId}`
//     // );
//     // console.log(session);
//     // console.log(stripes)

//     const res = await axios({
//       method: 'POST',
//       url: `/api/v1/bookings/checkout-session/${foodId}`,
//       data:'sucess'
//     });

//     console.log(res)
//     if(res.statusText=='OK')console.log('cool')
//     // use stripe to

//   } catch (error) {
//     console.log(error);
//     showAlert('error', 'sorry try again there was an error');
//     throw error
//   }
// };
export const buyFood = async (foodId) => {
  try {
    // get checkout ession
    const session = await axios(`/api/v1/checkout-session/${foodId}`);
    console.log(session);
    // console.log(stripe)
    // use stripe to

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', 'sorry try again there was an error');
    throw error;
  }
};
