// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import 'app.sass';

import CRUDStore from "./flux/CRUDStore";
import schema from "./schema";
import Logo from "./components/Logo";
import Button from "./components/Button";
import Suggest from "./components/Suggest";
import Rating from "./components/Rating";
import FormInput from "./components/FormInput";
import Form from "./components/Form";
import Actions from './components/Actions';
import Dialog from "./components/Dialog";
import Excel from "./components/Excel";

CRUDStore.init(schema);

ReactDOM.render(
  <div style={{padding: '20px'}}>
    <h1>Component discoverer</h1>

    <h2>Logo</h2>
    <div style={{display: 'inline-block', background: 'purple'}}>
      <Logo/>
    </div>

    <h2>Buttons</h2>
    <div>Button with onClick: <Button onClick={() => alert('ouch')}>Click me</Button></div>
    <div>A link: <Button href="http://reactjs.com">Follow me</Button></div>
    <div>Custom class name: <Button className="custom">I do nothing</Button></div>

    <h2>Suggest</h2>
    <div><Suggest options={['eenie', 'meenie', 'miney', 'mo']}/></div>

    <h2>Rating</h2>
    <div>No initial value: <Rating/></div>
    <div>Initial value 4: <Rating defaultValue={4}/></div>
    <div>This one goes to 11: <Rating max={11}/></div>
    <div>Read-only: <Rating defaultValue={3} readonly={true}/></div>

    <h2>Form inputs</h2>
    <table>
      <tbody>
      <tr>
        <td>Vanilla input</td>
        <td>
          <FormInput/>
        </td>
      </tr>
      <tr>
        <td>Prefilled</td>
        <td>
          <FormInput defaultValue="It's like a default"/>
        </td>
      </tr>
      <tr>
        <td>Year</td>
        <td>
          <FormInput type="year"/>
        </td>
      </tr>
      <tr>
        <td>Rating</td>
        <td>
          <FormInput type="rating" defaultValue={4}/>
        </td>
      </tr>
      <tr>
        <td>Suggest</td>
        <td>
          <FormInput
            type="suggest"
            options={['red', 'green', 'blue']}
            defaultValue="green"
          />
        </td>
      </tr>
      <tr>
        <td>Vanilla textarea</td>
        <td>
          <FormInput type="text"/>
        </td>
      </tr>
      </tbody>
    </table>

    <h2>Form</h2>
    <Form recordId={0} readonly={false}/>

    <h2>Form readonly</h2>
    <Form recordId={0} readonly={true}/>

    <h2>Actions</h2>
    <div>
      <Actions onAction={type => alert(type)}/>
    </div>

    <h2>Dialog</h2>
    <Dialog
      header="Out-of-the-box example"
      onAction={type => alert(type)}
    >
      Hello, dialog!
    </Dialog>
    <Dialog
      header="No cancel, custom button"
      hasCancel={false}
      confirmLabel="Whatever"
      onAction={type => alert(type)}
    >
      Anything goes here, see:
      <Button>A button</Button>
    </Dialog>

    <Excel/>

    {/* 更多元件 */}

  </div>,
  document.getElementById('app')
);