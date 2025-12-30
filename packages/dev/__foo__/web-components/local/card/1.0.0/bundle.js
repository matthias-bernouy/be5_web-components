class UserCard extends HTMLElement {
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

customElements.define('user-card', UserCard);