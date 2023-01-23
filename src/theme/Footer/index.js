import React from 'react';
import Footer from '@theme-original/Footer';
import Utterances from '@site/src/components/Utterances';

export default function FooterWrapper(props) {
  return (
    <>
      <Utterances />
      <Footer {...props} />
    </>
  );
}
