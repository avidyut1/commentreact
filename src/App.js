import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {getUniqueId, setUniqueId, getId} from "./UniqueId";
import Comment from './Comment';

class App extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    return (
        <div>
            <Comment id={0} parentId={-1} isRootComment={true} />
        </div>
    );
  }
}

export default App;
