import {debounce} from 'lodash-es';
import {Cancelable} from 'lodash';

interface ICutShortOptionsBreakpoints {
    [key: number]: number
}

interface ICutShortDefaultOptions {
    lines: number,
    breakpoints: ICutShortOptionsBreakpoints
}

interface ICutShortOptions {
    lines?: number,
    breakpoints?: ICutShortOptionsBreakpoints
}

interface ICutShortCSSStyleDeclaration extends CSSStyleDeclaration {
    overflowWrap: string
}

interface ICutShortElement extends HTMLElement {
    cutShort?: CutShort
    style: ICutShortCSSStyleDeclaration
}

type TDebounceExcerpt = () => void | Cancelable;

class CutShort {
    private static readonly DEBOUNCE_INTERVAL = 100;
    private static readonly CHANGE_EVENT_TYPE = 'resize';
    private static readonly ELEMENT_LINES_ATTRIBUTE = 'cut-short-lines';
    private static readonly ELEMENT_BREAKPOINT_ATTRIBUTE = 'cut-short-breakpoints';
    private static readonly DEFAULT_OPTIONS = {
        lines: 1,
        breakpoints: {
            0: 1
        }
    };

    private _element: ICutShortElement;
    private _options: ICutShortOptions;
    private _debounced: TDebounceExcerpt;

    protected _originalContent: string = '';

    constructor(element: ICutShortElement, options?: ICutShortOptions) {
        if (element.cutShort) {
            throw new Error('You tried to initialize CutShort on element that has it already, to access it use currentElement.cutShort');
        }

        element.cutShort = this;
        this._element = element;

        this._options = this._defineOptions(options);

        if (element.textContent) {
            this._originalContent = element.textContent;
        }
        
        this._createCssStyles();
        this.excerpt();
        this._watch();
    }

    private _defineOptions(options?: ICutShortOptions): ICutShortDefaultOptions {
        const attributeOptions = this._parseAttibutes();

        if (!options) {
            options = this._parseOptions(options || {});
        }

        return {
            ...CutShort.DEFAULT_OPTIONS,
            ...options,
            ...attributeOptions
        };
    }

    private _parseOptions(options: ICutShortOptions): ICutShortDefaultOptions {
        const parsedOptions: ICutShortDefaultOptions = {...CutShort.DEFAULT_OPTIONS};

        if (options.lines) {
            parsedOptions.lines = options.lines;
        }

        if (!options.breakpoints) {
            options.breakpoints = {}
        }

        parsedOptions.breakpoints = {
            ...options.breakpoints,
            0: parsedOptions.lines
        }

        return parsedOptions;
    }

    private _parseAttibutes(): ICutShortOptions {
        let lines: number = 1;
        let breakpoints: ICutShortOptionsBreakpoints = {};

        if (this._element.hasAttribute(CutShort.ELEMENT_LINES_ATTRIBUTE)) {
            lines = Number(this._element.getAttribute(CutShort.ELEMENT_LINES_ATTRIBUTE));
        }

        if (this._element.hasAttribute(CutShort.ELEMENT_BREAKPOINT_ATTRIBUTE)) {
            try {
                breakpoints = JSON.parse(this._element.getAttribute(CutShort.ELEMENT_BREAKPOINT_ATTRIBUTE) as string);
            } catch (error) {
                throw new Error('Invalid cut-short-breakpoints attribute, please provide valid breakpoints object: https://github.com/WitoTV/cutshort#breakpoints-key-number-number');
            }
        }

        return this._parseOptions({lines, breakpoints});
    }

    private _doesFit(maxHeight: number): boolean {
        return this._element.getBoundingClientRect().height <= maxHeight;
    }

    private _singleLineHeight(): number {
        const placeholder: HTMLElement = document.createElement('span');
        placeholder.textContent = '&nbsp;';
        placeholder.setAttribute('style',`
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            visibility: hidden;
            z-index: -1;
        `);
        this._element.appendChild(placeholder);
        const placeholderHeight: number = placeholder.getBoundingClientRect().height;
        this._element.removeChild(placeholder);

        return placeholderHeight;
    }

    private _watch(): void {
        this._unwatch();
        window.addEventListener(CutShort.CHANGE_EVENT_TYPE, this._debouncedExcerpt);
    }

    private _unwatch(): void {
        window.removeEventListener(CutShort.CHANGE_EVENT_TYPE, this._debouncedExcerpt);
    }

    private _createCssStyles(): void {
        if (this._cssFallback) {
            this._element.style['-webkit-box-orient'] = 'vertical'; 
            this._element.style.display = '-webkit-box';
        }

        this._element.style.overflow = 'hidden';
        this._element.style.overflowWrap = 'break-word';
    }

    private get _debouncedExcerpt(): TDebounceExcerpt {
        if (!this._debounced) {
            this._debounced = debounce(this.excerpt, CutShort.DEBOUNCE_INTERVAL);
        }

        return this._debounced;
    }

    private get _cssFallback(): boolean {
        return ('-webkit-line-clamp' in document.body.style);
    }

    public excerpt = (): void => {
        const lineHeight: number = this._singleLineHeight();
        let maxHeight: number = lineHeight; 
        let matchingBreakpoints: number[] = [];

        Object.keys(this._options.breakpoints as ICutShortOptionsBreakpoints).map((breakpoint: string) => {
            if (window.innerWidth >= Number(breakpoint)) {
                matchingBreakpoints = [...matchingBreakpoints, Number(breakpoint)];
            }
        });

        this._element.textContent = this._originalContent;

        let currentBreakpoint = Math.max(...matchingBreakpoints, 0);

        if (!this._cssFallback) {
            maxHeight = lineHeight * (this._options.breakpoints as ICutShortOptionsBreakpoints)[currentBreakpoint];

            while (!this._doesFit(maxHeight)) {
                this._element.textContent = this._element.textContent.replace(/\W*\s(\S)*$/, '…');
            }
            return;
        }

        this._element.style['-webkit-line-clamp'] = (this._options.breakpoints as ICutShortOptionsBreakpoints)[currentBreakpoint];
    }

    public destroy(): void {
        this._unwatch();
        this._element.textContent = this._originalContent;
        delete this._element.cutShort;
    }

    public get content(): string {
        return this._originalContent;
    }

    public get options(): ICutShortOptions {
        return this._options;
    }

    public set content(value: string) {
        this._originalContent = value;
        this.excerpt();
    }

    public set options(value: ICutShortOptions) {
        this._options = this._parseOptions(value);
    }
}

export {
    CutShort,
    ICutShortElement,
    ICutShortOptions,
    ICutShortOptionsBreakpoints
}