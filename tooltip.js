// Prefix for all Component Names
const prefix = 'mxcd'; // short for MixCode

class Tooltip extends HTMLElement {

    // In Constructor The "CustomElement" Hasn't Been Attached To The "DOM"
    // But It Was Initialized And Created In Memory in this stage.
    // So We Can't Manipulate The "DOM" in the Constructor
    // --------------------------------------------------------------//
    // Element Just Created but not Attached to the DOM yet in Simple Word
    constructor() {
        super();

        // _propertyName convention say that this property is "private" but not really do it.
        // Don't Have to define in constructor but it's a good case for documenting
        this._tooltipText = 'Tooltip Text!';
        this._visible = false;
        this._icon;

        // Using "Shadow DOM" Give us many advantage like scoped styles , seperate "DOM" and define our template easily
        // mode: 'open', 'close' define weather you want to access this element shadow dom from outside or not
        // no meaning to make it close because there other ways to use it even its close anyway
        // so make it open
        this.attachShadow({mode: 'open'});

        // Can manipulate the "DOM" in constructor because 
        // "Shadow DOM" is different "DOM" from the "Light DOM" and not the same 
        // And because i access it already by using "this.attachShadow({mode: 'open'});"  method so it safe to use it.
        // this.shadowRoot.appendChild();

        // define Template and not putting the template in html file and git it here
        // innerHTML is just a property prepare some strings and browsers read it but not manipulating the "DOM" it self
        // Adding Styles to the "Shadow DOM" Give us a huge benefits because now styles are scoped
        
        // Slots ------------------------------------------------------------------------------
        // To style Slotted Contents From inside the WebComponent you Should Use "::slotted(*|selector)" Pseudo Selector
        // Notice that Normally Slotted Contents are Projected, means it's not moving inside the slot so we can style it by light DOM Styles
        // So To Avoid That and provide Default Styles We Should Use "::slotted(selector-of-slotted-content)" Pseudo Selector
        // ::slotted() Only Accept the Top Most Element Fo Styling EX: ::slotted(span a) will not working but ::slotted(span) will work
        // Be Aware "Light DOM" Styling Overwrite "Shadow DOM" Styling

        // Host ------------------------------------------------------------------------------
        // To style Custom WebComponent you Should Use ":host" Pseudo Selector
        // Be Aware "Light DOM" Styling Overwrite "Shadow DOM" Styling
        // Also ":host" can used as function to make a condition
        // EX: :host.important not working it's wrong, Use :host(.important) instead
        // Notice that order of ":host(.|#|selector-condition)" must be above the normal ":host" selector

        // Host Context ------------------------------------------------------------------------
        // To style Custom WebComponent in a custom context you Should Use ":host-context()" Pseudo Selector
        // Be Aware "Light DOM" Styling Overwrite "Shadow DOM" Styling
        // ":host-context(surrounding-condition)" can used as function to make a condition
        // EX: p :host not working it's wrong, Use :host-context(p) instead
        // EX: :host-context(p.test), :host-context(p .test) can work normally
        // Notice that order of ":host-context(.|#|selector-condition)" for ":host" not important at all

        this.shadowRoot.innerHTML = `
            <style>

                :host-context(p) {
                    background-color: var(--host-inside-p-color, #a030e6);
                    color: #fff;
                    font-weight: bold;
                    line-height: 1.5;
                }

                :host(.important) {
                    background-color: var(--important-color, lightcoral);
                    color: #fff;
                }

                :host(.info) {
                    background-color: var(--info-color, #47c1c1);
                    color: #fff;
                }

                :host {
                    background-color: var(--default-color, lightgrey);
                    position: relative;
                    padding: 0.15rem 0.5rem;
                    border-radius: 5px;
                    display: inline-block;
                }

                div {
                    font-weight: normal;
                    background-color: #3a3a3a;
                    color: white;
                    position: absolute;
                    z-index: 10;
                    top: 1.5rem;
                    right: .5rem;
                    padding: .15rem;
                    font-size: 12px;
                    text-align: center;
                    border-radius: 3px;
                    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26);
                }

                ::slotted(.highlight) {
                    border-bottom: 1px dashed lightgreen;
                }

                .icon {
                    border-bottom: 1px dashed lightgreen;
                }
            </style>
            <slot>Default Value</slot> 
            <span class="icon">(?)</span>
        `;
    }

    // In connectedCallback Method The "CustomElement" Has Been Attached To The "DOM"
    // So we can manipulate the "DOM" in the connectedCallback
    // --------------------------------------------------------------//
    // Element Created and Attached to the DOM in Simple Word
    connectedCallback() {
        // Extract Attributes when the component mounted to the "Light DOM"
        // Notice we extract attributes only but not observing it
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }
        
        
        this._icon = this.shadowRoot.querySelector('span');
        
        // to use "this" that refers to Tooltip Class need to use "bind" 
        // but using Arrow function help to prevent the "this" key word problem
        // icon.addEventListener('mouseenter', this._showTooltip.bind(this)); 
        
        this._icon.addEventListener('mouseenter', this._showTooltip);
        this._icon.addEventListener('mouseleave', this._hideTooltip);
        // this.appendChild(this._icon);
        // Add Elements to the "Shadow DOM" not to "Light DOM" (Normal DOM)
        // No Need Already Defined in template
        // this.shadowRoot.appendChild(this._icon);

        this._render();
    }

    // Listening to Attributes Updates
    // By Default JavaScript make A Excellent Optimization by Stop Observing All Attributes
    // because maybe some elements have many attributes
    // But You Are Not Interesting In it At All so why observing it
    // That's Why We need to tell JavaScript to Observe What we want only 
    // by define a static getter called "observedAttributes"
    attributeChangedCallback(attribute_name, old_value, new_value) {
        // if old_value is equal to the new_value
        // just return and exist don't waste any resource and performance on something like this
        if (old_value === new_value) return;

        // Every Attribute have it's logic so we should check 
        if (attribute_name === 'text') {
            this._tooltipText = new_value;
        }
    }

    // Define Observed Attributes
    static get observedAttributes() {
        return ['text'];
    }

    // Listen for removing element from the "Light DOM"
    disconnectedCallback() {
        this._icon.removeEventListener('mouseenter', this._showTooltip);
        this._icon.removeEventListener('mouseleave', this._hideTooltip);
    }

    // "_methodName" Just convention to say it's just a method just called in inside the class "private method"

    _render() {
        // initialize the container with the "div" element we have one only that we used
        let tooltipContainer = this.shadowRoot.querySelector('div');

        if (this._visible) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);    
        } else {
            if (tooltipContainer) {
                this.shadowRoot.removeChild(tooltipContainer);
            }
        }
    }

    _showTooltip = () => {
        this._visible = true;
        this._render();
    }
    
    _hideTooltip = () => {
        this._visible = false;
        this._render();
    }

}

// Name Must Be one word and at Least consist of 2 parts separated by "-"
customElements.define(`${prefix}-tooltip`, Tooltip);