class UserCard extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = ``;
  }

  connectedCallback() {
  }
}

customElements.define('user-card', UserCard);