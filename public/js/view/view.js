class View {
  #parentContainer;
  constructor(parentContainer) {
    this.#parentContainer = parentContainer;
  }

  clickHandler(handlerFunction) {
    this.#parentContainer.addEventListener('click', handlerFunction);
  }
}

export default View;
