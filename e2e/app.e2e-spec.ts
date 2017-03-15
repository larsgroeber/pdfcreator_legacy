import { PdfcreatorPage } from './app.po';

describe('pdfcreator App', () => {
  let page: PdfcreatorPage;

  beforeEach(() => {
    page = new PdfcreatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
