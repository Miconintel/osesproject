class View {
  #parentContainer;
  constructor(parentContainer) {
    this.#parentContainer = parentContainer;
  }

  clickHandler() {
    console.log(this.parentContainer);
  }
}

export default View;
