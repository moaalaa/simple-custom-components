class ConfirmationLink extends HTMLAnchorElement {

    connectedCallback() {
        this.addEventListener('click', e => {
            if (! confirm('Are You Sure you want to leave us? :)')) {
                e.preventDefault();
            }
        })
    }
}


// If you Extending HTML Element Class like "HTMLAnchorElement" and not the base Element Class "HTMLElement"
// Then You Should Add Extends Option and put the "Html ELement" that you extends
// In Our Case is a element
customElements.define(`mxcd-confirmation-link`, ConfirmationLink, {extends: 'a'});