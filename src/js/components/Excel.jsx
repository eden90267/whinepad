// @flow

import React, {Component} from 'react';
import * as Immutable from 'immutable';
import classNames from 'classnames';
import invariant from "invariant";

import CRUDStore from "../flux/CRUDStore";
import CRUDActions from "../flux/CRUDAction";
import FormInput from "./FormInput";
import Rating from "./Rating";
import Actions from "./Actions";
import Dialog from "./Dialog";
import Form from "./Form";


type EditState = {
  row: number,
  key: string
}

type DialogState = {
  idx: number,
  type: string
}

type State = {
  data: Immutable.List<Object>,
  sortby: ?string,
  descending: boolean,
  edit: ?EditState,
  dialog: ?DialogState,
}

class Excel extends Component {

  state: State;
  schema: Array<Object>;

  constructor() {
    super();
    this.state = {
      data: CRUDStore.getData(),
      sortby: null, // schema.id
      descending: false,
      edit: null, // {row index, schema.id}
      dialog: null, // {type, idx}
    };
    this.schema = CRUDStore.getSchema();
    CRUDStore.addListener('change', () => {
      this.setState({
        data: CRUDStore.getData(),
      });
    });
  }

  _sort(key: string) {
    const descending = this.state.sortby === key && !this.state.descending;
    CRUDActions.sort(key, descending);
    this.setState({
      sortby: key,
      descending,
    });
  }

  _showEditor(e: Event) {
    const target = ((e.target: any): HTMLElement);
    this.setState({
      edit: {
        row: parseInt(target.dataset.row, 10),
        key: target.dataset.key
      }
    });
  }

  _save(e: Event) {
    e.preventDefault();
    invariant(this.state.edit, 'Messed up edit state');
    CRUDActions.updateField(
      this.state.edit.row,
      this.state.edit.key,
      this.refs.input.getValue()
    );
    this.setState({
      edit: null
    });
  }

  _actionClick(rowidx: number, action: string) {
    this.setState({
      dialog: {
        type: action,
        idx: rowidx,
      },
    });
  }

  _renderTable() {
    return (
      <table>
        <thead>
        <tr>
          {
            this.schema.map(item => {
              if (!item.show) {
                return null;
              }
              let title = item.label;
              if (this.state.sortby === item.id) {
                title += this.state.descending ? ' \u2191' : ' \u2193';
              }
              return (
                <th
                  className={`schema-${item.id}`}
                  key={item.id}
                  onClick={this._sort.bind(this, item.id)}
                >
                  {title}
                </th>
              )
            }, this)
          }
          <th className="ExcelNotSortable">Actions</th>
        </tr>
        </thead>
        <tbody onDoubleClick={this._showEditor.bind(this)}>
        {
          this.state.data.map((row, rowidx) => {
            return (
              <tr key={rowidx}>
                {
                  Object.keys(row).map((cell, idx) => {
                    const schema = this.schema[idx];
                    if (!schema || !schema.show) {
                      return null;
                    }
                    const isRating = schema.type === 'rating';
                    const edit = this.state.edit;
                    let content = row[cell];
                    if (!isRating && edit && edit.row === rowidx && edit.key === schema.id) {
                      content = (
                        <form onSubmit={this._save.bind(this)}>
                          <FormInput ref="input" {...schema} defaultValue={content}/>
                        </form>
                      );
                    } else if (isRating) {
                      content = <Rating defaultValue={Number(content)} readonly={true}/>;
                    }
                    return (
                      <td
                        className={classNames({
                          [`schema-${schema.id}`]: true,
                          'ExcelEditable': !isRating,
                          'ExcelDataLeft': schema.align === 'left',
                          'ExcelDataRight': schema.align === 'right',
                          'ExcelDataCenter': schema.align !== 'left' && schema.align !== 'right',
                        })}
                        key={idx}
                        data-row={rowidx}
                        data-key={schema.id}
                      >
                        {content}
                      </td>
                    )
                  }, this)
                }
                <tb className="ExcelDataCenter">
                  <Actions onAction={this._actionClick.bind(this, rowidx)}/>
                </tb>
              </tr>
            )
          }, this)
        }
        </tbody>
      </table>
    );
  }

  _deleteConfirmationClick(action: string) {
    this.setState({dialog: null});
    if (action === 'dismiss') {
      return;
    }
    const index = this.state.dialog ? this.state.dialog.idx : null;
    invariant(typeof index === 'number', 'Unexpected dialog state');
    CRUDActions.delete(index);
  }

  _renderDeleteDialog() {
    const index = this.state.dialog && this.state.dialog.idx;
    invariant(typeof index === 'number', 'Unexpected dialog state');
    const first = this.state.data.get(index);
    const nameguess = first[Object.keys(first)[0]];
    return (
      <Dialog
        header="Confirm deletion"
        confirmLabel="Delete"
        modal={true}
        onAction={this._deleteConfirmationClick.bind(this)}>
        {`Are you sure you want to delete "${nameguess}"?`}
      </Dialog>
    );
  }

  _saveDataDialog(action: string) {
    this.setState({dialog: null});
    if (action === 'dismiss') {
      return;
    }
    const index = this.state.dialog ? this.state.dialog.idx : null;
    invariant(typeof index === 'number', 'Unexpected dialog state');
    CRUDActions.updateRecord(index, this.refs.form.getData());
  }

  _renderFormDialog(readonly: ?boolean) {
    const index = this.state.dialog ? this.state.dialog.idx : null;
    invariant(typeof index === 'number', 'Unexpected dialog state');
    return (
      <Dialog
        modal={true}
        header={readonly ? 'Item info' : 'Edit item'}
        confirmLabel={readonly ? 'ok' : 'Save'}
        hasCancel={!readonly}
        onAction={this._saveDataDialog.bind(this)}
      >
        <Form
          ref="form"
          recordId={index}
          readonly={!!readonly}
        />
      </Dialog>
    );
  }

  _renderDialog() {
    if (!this.state.dialog) {
      return null;
    }
    switch(this.state.dialog.type) {
      case 'delete':
        return this._renderDeleteDialog();
      case 'info':
        return this._renderFormDialog(true);
      case 'edit':
        return this._renderFormDialog();
      default:
        throw Error(`Unexpected dialog type ${this.state.dialog.type}`);
    }
  }

  render() {
    return (
      <div className="Excel">
        {this._renderTable()}
        {this._renderDialog()}
      </div>
    )
  }

}

export default Excel;