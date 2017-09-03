/**
 * Created by eden90267 on 2017/5/1.
 */
import React from 'react';
import TestUtils from 'react-dom/test-utils';

jest
  .dontMock('../components/FormInput')
  .dontMock('../components/Rating')
  .dontMock('../components/Suggest')
  .dontMock('classnames');

const FormInput = require('../components/FormInput').default;

describe('factory works', () => {
  it('returns input value', () => {
    let input = TestUtils.renderIntoDocument(<FormInput type="year"/>);
    expect(input.getValue()).toBe(String(new Date().getFullYear()));
    input = TestUtils.renderIntoDocument(
      <FormInput type="rating" defaultValue={3}/>,
    );
    expect(input.getValue()).toBe(3);
  });
});
