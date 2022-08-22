export const hideAlert = () => {
    const el = document.querySelector('.alert');
    //   this is a trick to remove an element in javascript. u nedd it very well
    if (el) el.parentElement.removeChild(el);
  };
  
  export const showAlert = (type, message, time = 10) => {
    hideAlert();
    const markUp = `<div class="alert alert--${type}">${message}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
    window.setTimeout(hideAlert, time * 1000);
    // to set a time out on a dom element u need to use the dom object.set timeout
  };
  