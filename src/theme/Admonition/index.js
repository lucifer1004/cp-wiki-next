import React from 'react';
import Admonition from '@theme-original/Admonition';

export default function AdmonitionWrapper(props) {
  if (props.type === 'details') {
    return (
      <details style={
        {
          marginBottom: '1rem',
        }
      }>
        <summary>{props.title}</summary>
        {props.children}
      </details >
    );
  } else {
    return (
      <Admonition {...props} />
    );
  }
}
