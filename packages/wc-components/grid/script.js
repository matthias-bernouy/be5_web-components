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

class w13c_btn extends HTMLElement {
	mainElement;

	static get observedAttributes() {
		return ["full-width"];
	}

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
      <style><!-- {{ W13C__CSS }} --></style>
      <!-- {{ W13C__HTML }} -->
    `;
		this.mainElement = this.shadowRoot.querySelector(".richtext");
		console.log(this.mainElement);
	}

	attributeChangedCallback(name, _oldValue, newValue) {
		if (name === "full-width" && this.mainElement) {
			const width = newValue !== null ? "100%" : "auto";
			this.mainElement.style.setProperty("--be5-richtext-wrapper-width", width);
		}
	}

	connectedCallback() {
		console.log("Component connected");
	}

	disconnectedCallback() {}

	render() {}
}

customElements.define("w13c-btn", w13c_btn);
