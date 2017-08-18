import {TggEditorPage} from "./app.po";

describe('tgg-editor App', () => {
  let page: TggEditorPage;

  beforeEach(() => {
    page = new TggEditorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
