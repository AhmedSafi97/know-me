import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

import { imageLoader } from '../utils';
import { ReactComponent as Unknown } from '../assets/unknown.svg';
import { ReactComponent as FemaleIcon } from '../assets/no-border-female.svg';
import { ReactComponent as MaleIcon } from '../assets/male-selected.svg';

const WaitingToConnect = ({ gender, name, age, image }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    imageLoader(image, () => setImageLoaded(true));
  }, [image]);

  return (
    <div className="bg-blue h-screen flex flex-col items-center justify-center">
      {imageLoaded ? (
        <img src={image} className="block w-32 h-32 rounded-full" alt={name} />
      ) : (
        <Unknown />
      )}

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
};

WaitingToConnect.propTypes = {
  gender: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  age: propTypes.number.isRequired,
  image: propTypes.string.isRequired,
};

export default WaitingToConnect;
