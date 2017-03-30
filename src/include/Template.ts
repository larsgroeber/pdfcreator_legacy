/**
 * @file Template.ts
 *
 * Simple templating class.
 *
 * @author Lars Gröber
 */

import * as _ from 'lodash';

export class Template {
  private _leftDel = '<<';
  private _rightDel = '>>';
  private _templateText: string;

  constructor(templateText: string, leftDel?: string, rightDel?: string) {
    this._templateText = templateText;
    if (leftDel) {
      this._leftDel = leftDel;
    }
    if (rightDel) {
      this._rightDel = rightDel;
    }
  }

  /**
   * If working with HTML escaped text, this method escapes the delimiters as well.
   */
  public setHtmlEscape(): void {
    this._leftDel = Template.escapeHtml(this._leftDel);
    this._rightDel = Template.escapeHtml(this._rightDel);
  }

  /**
   * Replaces every key found in text by the corresponding value in 'values'.
   * @param values An object connecting placeholder keys to replacement strings.
   * @return {string} Template text with placeholders replaced.
   */
  public replace(values: Object): string {
    const keys = this.getKeys();
    let text = this._templateText;
    _.each(keys, key => {
      const re = new RegExp(`${this._leftDel} *${key} *${this._rightDel}`, 'g');
      if (values[key]) {
        text = text.replace(re, values[key]);
      } else {
        console.warn(`There is no replacement for key '${key}'!`);
      }
    });
    return text;
  }

  /**
   * Searches for placeholders in template text between delimiters and returns their keys.
   * @return {string[]} all found keys
   */
  public getKeys(): string[] {
    // "correct" regex would be (?<=ldel)(.*?)(?=rdel) using lookaheads and lookbehinds
    // but js does not support lookbehinds. So we have to remove the delimiters manually.
    const re = new RegExp(`${this._leftDel}(.*?)${this._rightDel}`, 'g');
    return _.each(this._templateText.match(re), (e, i, a) => {
      const re = new RegExp(`${this._rightDel}|${this._leftDel}`, 'g');
      a[i] = e.replace(re, '').trim();
    });
  }

  /**
   * Helper function to escape HTML characters.
   * @param unsafe
   * @return {string}
   */
  private static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
