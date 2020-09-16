import React from 'react';
import propTypes from 'prop-types';

const Contact = ({ image, online }) => (
  <div className="w-12 h-12 relative rounded-full">
    <img
      src={image}
      className="block w-full h-full rounded-full"
      alt="contact"
    />
    <span
      className={`w-3 h-3 absolute bottom-0 right-0 border border-white rounded-full ${
        online ? 'bg-green' : 'bg-gray-medium'
      }`}
    />
  </div>
);

Contact.defaultProps = {
  online: false,
};

Contact.propTypes = {
  image: propTypes.string.isRequired,
  online: propTypes.bool,
};

export default Contact;
