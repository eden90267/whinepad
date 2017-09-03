// @flow

import React, {Component} from 'react';
import CRUDStore from "../flux/CRUDStore";
import Excel from "./Excel";
import Button from "./Button";
import Dialog from "./Dialog";
import Form from "./Form";
import CRUDActions from "../flux/CRUDAction";


type State = {
  addnew: boolean,
  count: number,
}

class Whinepad extends Component {

  state: State;

  constructor() {
    super();
    this.state = {
      addnew: false,
      count: CRUDStore.getCount(),
    };

    CRUDStore.addListener('change', () => {
      this.setState({
        count: CRUDStore.getCount(),
      });
    });
  }

  _addNewDialog() {
    this.setState({addnew: true});
  }

  _addNew(action: string) {
    this.setState({
      addnew: false
    });
    if (action === 'confirm') {
      CRUDActions.create(this.refs.form.getData());
    }
  }

  render() {
    return (
      <div className="Whinepad">
        <div className="WhinepadToolbar">
          <div className="WhinepadToolbarAdd">
            <Button
              onClick={this._addNewDialog.bind(this)}
              className="WhinepadToolbarAddButton"
            >
              + add
            </Button>
          </div>
          <div className="WhinepadToolbarSearch">
            <input
              placeholder={
                this.state.count === 1
                ?
                  'Search 1 record...'
                  :
                  `Search ${this.state.count} records...`
              }
              onChange={CRUDActions.search.bind(this)}
              onFocus={CRUDActions.startSearching.bind(this)}
            />
          </div>
        </div>
        <div className="WhinepadDatagrid">
          <Excel/>
        </div>
        {
          this.state.addnew
            ?
            <Dialog
              header="Add new item"
              confirmLabel="Add"
              modal={true}
              onAction={this._addNew.bind(this)}>
              <Form ref="form"/>
            </Dialog>
          :
          null
          }
      </div>
    );
  }

}

export default Whinepad;