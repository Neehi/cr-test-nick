import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  // getParapgraphText() {
  //   return element(by.css('app-root p')).getText();
  // }

  getText(selector: string) {
    return element(by.css(selector)).getText();
  }

  getImageSrc(selector: string) {
    return element(by.css(selector)).getAttribute('src');
  }
}
