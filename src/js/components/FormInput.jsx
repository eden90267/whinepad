/**
 * 根據type特性產生輸入元素的工廠(factory)
 */

// @flow

import React, {Component} from 'react';
import Suggest from "./Suggest";
import Rating from "./Rating";

type FormInputFieldType = 'year' | 'suggest' | 'rating' | 'text' | 'input';

export type FormInputFieldValue = string | number;

export type FormInputField = {
  type?: FormInputFieldType,
  defaultValue?: FormInputFieldValue,
  id?: string,
  options?: Array<string>,
  label?: string,
}

class FormInput extends Component {

  props: FormInputField;

  static defaultProps = {
    type: 'input'
  };

  getValue(): FormInputFieldValue {
    return 'value' in this.refs.input
      ?
      this.refs.input.value
      :
      this.refs.input.getValue(); // 就<Suggest>與<Rating>之類的酷炫自訂輸入元素，則存取個別的getValue()方法
  }

  render() {
    const common: Object = { // 通用特性
      id: this.props.id,
      ref: 'input', // 這對擷取輸入欄位之值很有用
      defaultValue: this.props.defaultValue
    };
    switch (this.props.type) {
      case 'year':
        return (
          <input
            {...common}
            type="number"
            defaultValue={this.props.defaultValue || new Date().getFullYear()}
          />
        );
      case 'suggest':
        return <Suggest {...common} options={this.props.options}/>;
      case 'rating':
        return (
          <Rating {...common} defaultValue={parseInt(this.props.defaultValue, 10)}/>
        );
      case 'text':
        return <textarea {...common} />;
      default:
        return <input {...common} type="text"/>;
    }
  }

}

export default FormInput;