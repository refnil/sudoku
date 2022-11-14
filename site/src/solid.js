import "./index.css";

import { Component } from 'solid-js';
import { render } from 'solid-js/web';

const App = () => {
  return (
    <div >
      test solid
    </div>
  );
};


render(() => <App />, document.getElementById('sudoku'));
