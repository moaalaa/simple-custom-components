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
        this._tooltipContainer;
        this._tooltipText = 'Tooltip Text!';

        // Using "Shadow DOM"
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
        // Define Attributes
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }
        
        const icon = this.shadowRoot.querySelector('span');
        
        // to use "this" that refers to Tooltip Class need to use "bind" 
        // but using Arrow function help to prevent the "this" key word problem
        // icon.addEventListener('mouseenter', this._showTooltip.bind(this)); 
        
        icon.addEventListener('mouseenter', this._showTooltip);
        icon.addEventListener('mouseleave', this._hideTooltip);
        // this.appendChild(icon);
        // Add Elements to the "Shadow DOM" not to "Light DOM" (Normal DOM)
        this.shadowRoot.appendChild(icon);
    }

    // "_methodName" Just convention to say it's just a method just called in inside the class "private method"
    _showTooltip = () => {
        this._tooltipContainer = document.createElement('div');
        this._tooltipContainer.textContent = this._tooltipText;
        this.shadowRoot.appendChild(this._tooltipContainer);
    }
    
    _hideTooltip = () => {
        this.shadowRoot.removeChild(this._tooltipContainer);
    }

}

// Name Must Be one word and at Least consist of 2 parts separated by "-"
customElements.define(`${prefix}-tooltip`, Tooltip);