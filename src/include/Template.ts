import * as _ from 'lodash';

export class Template {
    private _leftDel: string = '<&';
    private _rightDel: string = '&>';
    private _templateText: string;

    constructor(templateText: string, leftDel?: string, rightDel?: string) {
        this._templateText = templateText;
        if (leftDel) {
            this._leftDel = leftDel
        }
        if (rightDel) {
            this._rightDel = rightDel
        }
    }

    public setHtmlEscape(): void {
        this._leftDel = this.escapeHtml(this._leftDel);
        this._rightDel = this.escapeHtml(this._rightDel);
    }

    public replace(values: Object): string {
        let keys = this.getKeys();
        let text = this._templateText;
        _.each(keys, key => {
            let re = new RegExp(`${this._leftDel} *${key} *${this._rightDel}`, 'g');
            if (values[key]) {
                text = text.replace(re, values[key]);
            } else {
                console.warn(`There is no replacement for key '${key}'!`);
            }
        });
        return text;
    }

    /**
     * Searches for placeholders in templatestring between delimiters and returns their keys.
     * @return {string[]} all found keys
     */
    public getKeys(): string[] {
        // "correct" regex would be (?<=ldel)(.*?)(?=rdel) using lookaheads and lookbehinds
        // but js does not support lookbehinds. So we have to remove the delimiters manually.
        let re = new RegExp(`${this._leftDel}(.*?)${this._rightDel}`, 'g');
        return _.each(this._templateText.match(re), (e, i, a) => {
            let re = new RegExp(`${this._rightDel}|${this._leftDel}`, 'g');
            a[i] = e.replace(re, '').trim();
        });
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
