import { Observable } from 'rxjs/Observable';


/**
 * This class i used to hold common logic in components when we fetch data.
 * - show and hide spinner
 * - show erros
 * - disable button
 * - show addtional information
 */
export class CommonContent {

  // normaly all posts have set limit to 35
  // can be override when limit is bigger
  public limitPost = 35;

  // this array holds fetched data
  public data: Array<any> = null;

  public showSpinner: boolean;
  public disabledButton: boolean;
  public showSpinnerButton: boolean;
  public showButton = true;
  public showError: boolean;
  public showNoContent: boolean;

  reset() {
    this.data = null;
    this.showSpinner = false;
    this.disabledButton = false;
    this.showSpinnerButton = false;
    this.showError = false;
    this.showNoContent = false;
    this.showButton = true;
  }
  public getData(observable: Observable<any>): void {
    this.reset();
    this.showSpinner = true;
    observable.subscribe(res => {
      this.showInfoIfEmpty(res);
      this.hideButtonIfLessLimit(res);
      this.data = [...res];
      this.showSpinner = false;
    }, err => {
      this.showError = true;
      this.showSpinner = false;
    });
  }

  public getNext(observable: Observable<any>): void {
    this.showSpinnerButton = true;
    this.showError = false;
    observable.subscribe(
      (res: [any]) => {
        res.shift();
        this.disableButtonIfEmpty(res);
        this.data = [...this.data, ...res];
        this.showSpinnerButton = false;
      },
      err => {
        this.showError = true;
        this.showSpinnerButton = false;
      });
  }

  // if array is empty or null disable button
  private disableButtonIfEmpty(array: Array<any>): void {
    if (!array || array.length === 0) {
      this.disabledButton = true;
      this.showSpinnerButton = false;
      this.showError = false;
    }
  }

  // if array is empty or null show info
  private showInfoIfEmpty(array: Array<any>): void {
    if (!array || array.length === 0) {
      this.showNoContent = true;
    }
  }

  hideButtonIfLessLimit(array: Array<any>) {
    if (array && array.length < this.limitPost) {
      this.showButton = false;
    }
  }
}
