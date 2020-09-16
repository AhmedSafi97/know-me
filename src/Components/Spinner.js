import React from 'react';
import propTypes from 'prop-types';

import { ReactComponent as Spinner } from '../assets/spinner.svg';

const SpinnerComponent = ({ centered }) => (
  <Spinner className={`w-8 h-8 m-auto spin ${centered ? 'mt-48' : 'mt-0'}`} />
);

SpinnerComponent.defaultProps = {
  centered: true,
};

SpinnerComponent.propTypes = {
  centered: propTypes.bool,
};

export default SpinnerComponent;
