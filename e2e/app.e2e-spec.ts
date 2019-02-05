import { OCPPage } from './app.po';

describe('ocp App', () => {
  let page: OCPPage;

  beforeEach(() => {
    page = new OCPPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
