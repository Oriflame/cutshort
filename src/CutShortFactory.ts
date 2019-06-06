import {CutShort, ICutShortElement, ICutShortOptions} from './CutShort';

interface ICutShortFactory {
    elements: Set<ICutShortElement>
}

class CutShortFactory implements ICutShortFactory {
    public elements: Set<ICutShortElement>;

    constructor(selector: string, options?: ICutShortOptions) {
        this.elements = new Set();

        this._createAll(selector, options);
    }

    private _create(element: ICutShortElement, options?: ICutShortOptions): void {
        element.cutShort = new CutShort(element, options);
        this.elements.add(element);
    }

    private _createAll(selector: string, options?: ICutShortOptions): void {
        document.querySelectorAll(selector).forEach((element: ICutShortElement) => this._create(element, options));
        this._watch(selector);
    }

    private _watch(selector: string): void {
        const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
            mutationsList.map((mutationList: MutationRecord) => {

                //Added nodes
                mutationList.addedNodes.forEach((node: ICutShortElement) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches(selector)) {
                        this._create(node);
                    };
                });

                //Removed nodes
                mutationList.removedNodes.forEach((node: ICutShortElement) => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.matches(selector) &&
                        this.elements.has(node) &&
                        node.cutShort
                    ) {
                        node.cutShort.destroy();
                        this.elements.delete(node);
                    }
                });
            });
        });

        observer.observe(document.body, {attributes: false, childList: true, subtree: true});
    }
}

export {
    CutShortFactory,
    ICutShortFactory
}