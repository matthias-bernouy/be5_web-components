
// ---- Import card ---- 
class w13c_card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style></style>
      
    `;
  }

  connectedCallback() {
    this.render();
    const btn = this.shadowRoot.querySelector('#action-btn');
    btn.addEventListener('click', () => this.maFonctionPerso());
  }

  disconnectedCallback() {
  }

  render() {
    const name = this.getAttribute('name') || "Inconnu";
    this.shadowRoot.querySelector('#user-name').innerText = name;
  }
}

customElements.define('card', w13c_card);
// ---- End Import card ---- 

// ---- Import sample ---- 
class w13c_sample extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = ``;
  }

  connectedCallback() {
  }
}

customElements.define('sample', w13c_sample);
// ---- End Import sample ---- 
