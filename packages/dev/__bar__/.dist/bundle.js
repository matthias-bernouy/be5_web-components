
// ---- Component card ---- 
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

class w13c_card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>/** 
*
* For a good component, you should make the component be able to personalize its style via CSS variables.
* Also, you should use position-anchor to make sure the component is well positioned in any context.
*
*/

:host{
    display: block;
    box-sizing: border-box;

    /* Variables here */
}

/* Styles for your components */
.card{
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    width: max(20vw, 200px);
}

/* Styles for slotted elements */
::slotted(*){
    display: block;
}

/* Styles for slotted elements which slot name is "header" */
::slotted([slot="header"]){
    font-weight: bold;
    font-size: 1.5em;
    margin-bottom: 0.5em;
}</style>
      <div class="card">
    <h1><slot name="card_title">Hello zz</slot></h1>
    <p><slot name="card_content">Hello zz</slot></p>
</div>
    `;
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  render() {
  }
}

customElements.define('local-card', w13c_card);
// ---- End Component card ---- 

// ---- Component component1 ---- 
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

class w13c_component1 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>/** 
*
* For a good component, you should make the component be able to personalize its style via CSS variables.
* Also, you should use position-anchor to make sure the component is well positioned in any context.
*
*/

:host{
    display: block;
    box-sizing: border-box;

    /* Variables here */
}

/* Styles for your components */

/* Styles for slotted elements */
::slotted(*){
    display: block;
}

/* Styles for slotted elements which slot name is "header" */
::slotted([slot="header"]){
    font-weight: bold;
    font-size: 1.5em;
    margin-bottom: 0.5em;
}</style>
      <div class="">
    <h1><slot name="header">default header</slot></h1>
    <p><slot name="content">default content</slot></p>
</div>
    `;
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  render() {
  }
}

customElements.define('local-component1', w13c_component1);
// ---- End Component component1 ---- 

// ---- Component component2 ---- 
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

class w13c_component2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>/** 
*
* For a good component, you should make the component be able to personalize its style via CSS variables.
* Also, you should use position-anchor to make sure the component is well positioned in any context.
*
*/

:host{
    display: block;
    box-sizing: border-box;

    /* Variables here */
}

/* Styles for your components */

/* Styles for slotted elements */
::slotted(*){
    display: block;
}

/* Styles for slotted elements which slot name is "header" */
::slotted([slot="header"]){
    font-weight: bold;
    font-size: 1.5em;
    margin-bottom: 0.5em;
}</style>
      <div class="">
    <h1><slot name="header">default header</slot></h1>
    <p><slot name="content">default content</slot></p>
</div>
    `;
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  render() {
  }
}

customElements.define('local-component2', w13c_component2);
// ---- End Component component2 ---- 
