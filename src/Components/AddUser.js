import React from 'react';
import propTypes from 'prop-types';

import { ReactComponent as Add } from '../assets/add.svg';

const AddUser = ({ onClick }) => (
  <button type="button" aria-label="send friendship request" onClick={onClick}>
    <Add />
  </button>
);

AddUser.propTypes = {
  onClick: propTypes.func.isRequired,
};

export default AddUser;
