/**
 * @file Template.ts
 *
 * Simple templating class.
 *
 * @author Lars Gröber
 */

import * as _ from 'lodash';
import {Helper} from './helper';

export class Template {
  static leftDel = '<<';
  static rightDel = '>>';
  static leftDelComment = '<//';
  static rightDelComment = '//>';
  static leftDelVariable = '<\\$';
  static rightDelVariable = '\\$>';
  static leftDelStatement = '<=';
  static rightDelStatement = '=>';
  private _templateText: string;

  constructor(templateText: string, leftDel?: string, rightDel?: string) {
    this._templateText = Template.removeComments(templateText);
    if (leftDel) {
      Template.leftDel = leftDel;
    }
    if (rightDel) {
      Template.rightDel = rightDel;
    }
  }

  /**
   * If working with HTML escaped text, this method escapes the delimiters as well.
   */
  public setHtmlEscape(): void {
    Template.leftDel = Template.escapeHtml(Template.leftDel);
    Template.rightDel = Template.escapeHtml(Template.rightDel);
  }

  /**
   * Replaces every key found in text by the corresponding value in 'values'.
   * @param values An object connecting placeholder keys to replacement strings.
   * @return {string} Template text with placeholders replaced.
   */
  public replace(values: Object): string {
    const keys = this.getKeys_separated();
    let text = this._templateText;

    // replace placeholders
    _.each(keys.placeholders, key => {
      const re = new RegExp(`${Template.leftDel} *${key} *${Template.rightDel}`, 'g');
      if (values[key]) {
        text = text.replace(re, values[key]);
      } else {
        console.warn(`There is no replacement for key '${key}'!`);
      }
    });

    // replace statements
    _.each(keys.statements, statement => {
      // replace $NAME strings with corresponding value
      const re = new RegExp('\\$\\w*', 'g');
      let newStatement = statement;
      _.each(statement.match(re), (match: string) => {
        const key = match.slice(1);
        if (values[key]) {
          newStatement = statement.replace(re, values[key]);
        } else {
          console.warn(`There is no replacement for key '${key}' in statement '${statement}'!`);
          newStatement = '';
        }
      });
      let result: string;
      try {
        // TODO: think about better security here!
        result = eval(newStatement) || '';
      } catch (err) {
        Helper.displayMessage(`There was an error executing '${statement}':<br> ${err}`, 0);
        result = '';
      }
      const re2 = new RegExp(`${Template.leftDelStatement} *${Template.escapeRegex(statement)} *${Template.rightDelStatement}`, 'g');
      text = text.replace(re2, result);
    });

    return text;
  }

  /**
   * Searches for placeholders in template text between delimiters and returns their keys.
   * @return {string[]} all found keys
   */
  public getKeys(): string[] {
    return this.getKeysType('placeholders').concat(this.getKeysType('variables'));
  }

  /**
   * Returns the keys separated by their type.
   * @return {{placeholders: string[], variables: string[], statements: string[]}}
   */
  public getKeys_separated(): { placeholders: string[], variables: string[], statements: string[] } {
    return {
      placeholders: this.getKeysType('placeholders'),
      variables: this.getKeysType('variables'),
      statements: this.getKeysType('statements'),
    };
  }

  /**
   * Removes comment strings from a text.
   * @param text
   * @return {string}
   */
  public static removeComments(text: string): string {
    const re = new RegExp(`${Template.leftDelComment}.*${Template.rightDelComment}`, 'g');
    return text.replace(re, '');
  }

  /**
   * Removes variables and statement strings from the text.
   * @param text
   * @return {string}
   */
  public static removeVariablesAndStatements(text: string): string {
    const reV = new RegExp(`${Template.leftDelVariable}.*${Template.rightDelVariable}`, 'g');
    const reS = new RegExp(`${Template.leftDelStatement}.*${Template.rightDelStatement}`, 'g');
    return text.replace(reV, '').replace(reS, '');
  }

  /**
   * Searches the template for template strings of the specified type.
   * Available are 'placeholders', 'variables' and 'statements'.
   * @param type
   * @return {[]|String[]}
   */
  private getKeysType(type: string): string[] {
    let leftDel: string;
    let rightDel: string;
    switch (type) {
      case 'placeholders':
        leftDel = Template.leftDel;
        rightDel = Template.rightDel;
        break;
      case 'variables':
        leftDel = Template.leftDelVariable;
        rightDel = Template.rightDelVariable;
        break;
      case 'statements':
        leftDel = Template.leftDelStatement;
        rightDel = Template.rightDelStatement;
        break;
      default:
        console.error('Unknown key type!');
        return;
    }

    // "correct" regex would be (?<=ldel)(.*?)(?=rdel) using lookaheads and lookbehinds
    // but js does not support lookbehinds. So we have to remove the delimiters manually.
    const re = new RegExp(`${leftDel}(.*?)${rightDel}`, 'g');
    const a = this._templateText.match(re);
    return _.each(a, (e, i) => {
      const re2 = new RegExp(`${rightDel}|${leftDel}`, 'g');
      a[i] = e.replace(re2, '').trim();
    }) || [];
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

  /**
   * Escapes all regex characters in a given string.
   * @param str
   * @return {string}
   */
  private static escapeRegex(str: string): string {
    return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
  }
}
