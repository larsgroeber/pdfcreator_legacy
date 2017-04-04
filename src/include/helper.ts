declare let Materialize: any;

export class Helper {
  // TODO: display differently based on level
  public static displayMessage(message: string, level?: number): void {
    Materialize.toast(message, 4000);
  }
}
