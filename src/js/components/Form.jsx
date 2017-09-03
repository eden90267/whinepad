// @flow

import React, {Component} from 'react';
import CRUDStore from "../flux/CRUDStore";
import type {FormInputField, FormInputFieldValue} from "./FormInput";
import FormInput from "./FormInput";
import Rating from "./Rating";

type Props = {
  readonly?: boolean,
  recordId: ?number,
}

class Form extends Component {

  fields: Array<Object>;
  initialData: ?Object;

  constructor(props: Props) {
    super(props);
    this.fields = CRUDStore.getSchema();
    if ('recordId' in this.props) {
      this.initialData = CRUDStore.getRecord(this.props.recordId);
    }
  }

  getData(): Object {
    let data: Object = {};
    this.fields.forEach((field: FormInputField) =>
      data[field.id] = this.refs[field.id].getValue()
    );
    return data;
  }

  render() {
    return (
      <form className="Form">
        {
          this.fields.map((field: FormInputField) => {
            const prefilled: FormInputFieldValue = (this.initialData && this.initialData[field.id]) || '';
            if (!this.props.readonly) {
              return (
                <div className="FormRow" key={field.id}>
                  <label className="FormLabel" htmlFor={field.id}>{field.label}:</label>
                  <FormInput {...field} ref={field.id} defaultValue={prefilled}/>
                </div>
              );
            }
            if (!prefilled) {
              return null;
            }
            return (
              <div className="FormRow" key={field.id}>
                <span className="FormLabel">{field.label}:</span>
                {
                  field.type === 'rating'
                    ?
                    <Rating defaultValue={parseInt(prefilled, 10)} readonly={true}/>
                    :
                    <div>{prefilled}</div>
                }
              </div>
            );
          }, this)
        }
      </form>
    );
  }

}

export default Form;