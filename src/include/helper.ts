declare let Materialize: any;

export class Helper {
  // TODO: display differently based on level
  /**
   * 0: Error
   * 1: Warning
   * 2: Info
   */
  public static displayMessage(message: string, level?: number): void {
    if (!level && level !== 0) level = 2;

    switch (level) {
      case 0:
        Materialize.toast(message, 10000, 'red');
        console.error(message);
        break;
      case 1:
        Materialize.toast(message, 4000, 'yellow');
        console.warn(message);
        break;
      case 2:
        Materialize.toast(message, 4000, 'blue');
        break;
      default:
        Materialize.toast(message, 4000);
    }
  }
}
