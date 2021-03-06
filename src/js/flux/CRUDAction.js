// @flow


import CRUDStore from './CRUDStore';

const CRUDActions = {

  create(newRecord: Object) {
    CRUDStore.setData(CRUDStore.getData().unshift(newRecord));
  },

  delete(recordId: number) {
    CRUDStore.setData(CRUDStore.getData().remove(recordId));
  },

  updateRecord(recordId: number, newRecord: Object) {
    CRUDStore.setData(CRUDStore.getData().set(recordId, newRecord));
  },

  updateField(recordId: number, key: string, value: string | number) {
    const record = CRUDStore.getData().get(recordId);
    record[key] = value;
    CRUDStore.setData(CRUDStore.getData().set(recordId, record));
  },

  _preSearchData: null,

  startSearching() {
    this._preSearchData = CRUDStore.getData();
  },

  search(e: Event) {
    const target = ((e.target: any): HTMLInputElement);
    const needle: string = target.value.toLowerCase();
    if (!needle) {
      CRUDStore.setData(this._preSearchData);
      return;
    }
    const fields = CRUDStore.getSchema().map(item => item.id);
    if (!this._preSearchData) {
      return;
    }
    const searchdata = this._preSearchData.filter((row) => {
      for (let f = 0; f < fields.length; f++) {
        if (row[fields[f]].toString().toLowerCase().indexOf(needle) > -1) {
          return true;
        }
      }
      return false;
    });
    CRUDStore.setData(searchdata);
  },

  _sortCallback(a: (string | number), b: (string | number), descending: boolean): number {
    let res: number = 0;
    if (typeof a === 'number' && typeof b === 'number') {
      res = a - b;
    } else {
      res = String(a).localeCompare(String(b));
    }
    return descending ? -1 * res : res;
  },

  sort(key: string, descending: boolean) {
    CRUDStore.setData(CRUDStore.getData().sort((a, b) =>
      this._sortCallback(a[key], b[key], descending)));
  },

  /* ... */

};

export default CRUDActions;
