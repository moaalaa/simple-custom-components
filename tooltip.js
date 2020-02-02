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
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: #3a3a3a;
                    color: white;
                    position: absolute;
                    z-index: 10;
                    right: 0;
                    padding: .3rem .6rem;
                    font-size: 12px;
                    text-align: center;
                }
            </style>
            <slot>Default Value</slot> 
            <span> (?)</span>
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
        this.style.position = 'relative';
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