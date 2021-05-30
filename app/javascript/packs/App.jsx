import React from 'react';
import ReactDOM from 'react-dom';
import ShareDiggaz from '../core';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('user_data');
  const data = JSON.parse(node.getAttribute('data')) || {};

  ReactDOM.render(
    <ShareDiggaz data={data} />,
    document.getElementById('root'),
  );
});