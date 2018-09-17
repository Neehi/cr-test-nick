import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have a Clear Review logo', () => {
    page.navigateTo();
    expect(page.getImageSrc('img#logo')).toContain('ClearReview-Logo-300px.png');
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getText('main p')).toEqual('Hello world!');
  });

  it('should display footer message', () => {
    page.navigateTo();
    expect(page.getText('footer p')).toEqual('Clear Review Technical Test by Nick Snape');
  });

});
