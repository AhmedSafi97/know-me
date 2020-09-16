import React from 'react';
import propTypes from 'prop-types';

import { ReactComponent as FemaleIcon } from '../assets/no-border-female.svg';
import { ReactComponent as MaleIcon } from '../assets/male-selected.svg';

const WaitingToConnect = ({ gender, name, age, image }) => (
  <div className="w-32 bg-blue">
    <img src={image} className="block w-32 h-32 rounded-full" alt="contact" />
    <div className="flex items-center justify-center mt-4 mb-24 text-white">
      <span>
        {name}, {age}&nbsp;
      </span>
      {gender === 'female' ? (
        <FemaleIcon className="inline" />
      ) : (
        <MaleIcon className="inline" />
      )}
    </div>
    <p className="text-white text-xl text-center">Connecting...</p>
  </div>
);

WaitingToConnect.propTypes = {
  gender: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  age: propTypes.number.isRequired,
  image: propTypes.string.isRequired,
};

export default WaitingToConnect;
