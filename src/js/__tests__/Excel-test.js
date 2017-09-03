/**
 * Created by eden90267 on 2017/5/1.
 */
import React from 'react';
import TestUtils from 'react-dom/test-utils';

jest.autoMockOff();

const Excel = require('../components/Excel').default;
const schema = require('../schema').default;
const Store = require('../flux/CRUDStore').default;

Store.init(schema);

describe('Editing data', () => {
  it('saves new data', () => {
    /* .. 渲染、互動、檢視 */
    const table = TestUtils.renderIntoDocument(<Excel/>);
    const newname = '$2.99 chunk';
    const cell = TestUtils.scryRenderedDOMComponentsWithTag(table, 'td')[0];
    cell.dataset = { // 需要一點小技巧才能支援資料集，調整一下 Jest 的 DOM 支援
      row: cell.getAttribute('data-row'),
      key: cell.getAttribute('data-key'),
    };
    TestUtils.Simulate.doubleClick(cell);
    cell.getElementsByTagName('input')[0].value = newname;
    TestUtils.Simulate.submit(cell.getElementsByTagName('form')[0]);
    expect(cell.textContent).toBe(newname);
  });
  it('deletes data', () => {
    const table = TestUtils.renderIntoDocument(<Excel/>);

    TestUtils.Simulate.click( // x icon
      TestUtils.findRenderedDOMComponentWithClass(table, 'ActionsDelete'),
    );

    TestUtils.Simulate.click(
      TestUtils.findRenderedDOMComponentWithClass(table, 'Button'),
    );

    // console.log(callback.mock.calls);
    expect(TestUtils.scryRenderedDOMComponentsWithTag(table, 'td').length).toBe(0); // 互動之後的新資料陣列，一個都不剩了，因刪除了唯一一筆紀錄。
  });
});
