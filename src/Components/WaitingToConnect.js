import React from 'react';
import propTypes from 'prop-types';

import Exit from './Exit';
import { ReactComponent as Spinner } from '../assets/white-spinner.svg';

const WaitingConnect = ({ exitHandler }) => (
  <div className="p-4 md:px-16 xl:px-32 bg-blue h-screen">
    <Exit primaryStyle={false} onClick={exitHandler} />
    <div className="bg-blue w-full max-w-sm m-auto px-4 h-fit flex flex-col items-center justify-center">
      <Spinner className="spin" />
      <p className="text-xl text-white text-center mt-16">
        There are no strangers only friends you haven&apos;t met yet&nbsp;
        <span role="img" aria-label="smile">
          😃
        </span>
      </p>
    </div>
  </div>
);

WaitingConnect.propTypes = {
  exitHandler: propTypes.func.isRequired,
};

export default WaitingConnect;
