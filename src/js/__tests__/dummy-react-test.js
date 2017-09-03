/* eslint-disable react/no-find-dom-node */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

describe('We can render a button', () => {
  it('changes the text after click', () => {
    const button = TestUtils.renderIntoDocument(
      <button onClick={(ev) => {
        ev.target.innerHTML = 'Bye';
      }}>
        Hello
      </button>,
    );
    expect(ReactDOM.findDOMNode(button).textContent).toEqual('Hello');
    TestUtils.Simulate.click(button); // TestUtils.Simulate.* - 與介面互動
    expect(ReactDOM.findDOMNode(button).textContent).toEqual('Bye');
  });
});
