import React from 'react';

import { ReactComponent as Spinner } from '../assets/white-spinner.svg';

const WaitingConnect = () => (
  <div className="bg-blue w-full max-w-sm m-auto px-4">
    <Spinner className="m-auto spin" />
    <p className="text-xl text-white text-center mt-16">
      There are no strangers only friends you haven&apos;t met yet&nbsp;
      <span role="img" aria-label="smile">
        😃
      </span>
    </p>
  </div>
);

export default WaitingConnect;
