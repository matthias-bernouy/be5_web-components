/**
 * 
 * This is used to create a basic isolated web component.
 * Never replace the "W13C__CSS" and "W13C__HTML" placeholders below,
 * they will be replaced during the component creation process.
 * Never attachshadow in another way, always use the method shown below.
 * Do not remove customElements.define at the end of the file.
 * 
 * Apart from that, feel free to modify this file as you wish.
 */

class Component extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${{ W13C__CSS }}</style>
      ${{ W13C__HTML }}
    `;
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  render() {
  }
}

customElements.define('component', Component);