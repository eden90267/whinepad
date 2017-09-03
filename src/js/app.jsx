// @flow

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import 'app.sass';

import Logo from "./components/Logo";
import CRUDStore from "./flux/CRUDStore";
import schema from "./schema";
import Whinepad from "./components/Whinepad";

CRUDStore.init(schema);

ReactDOM.render(
  <div>
    <div className="app-header">
      <Logo/> Welcome to Whinepad!
    </div>
    <Whinepad/>
  </div>,
  document.getElementById('app')
);

if (module && module.hot && module.hot instanceof Object) {
  module.hot.accept();
}