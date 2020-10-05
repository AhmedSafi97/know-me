const getErrorMessage = (errCode) => {
  switch (errCode) {
    case 'auth/wrong-password':
      return 'Sorry, your password was incorrect. Please double-check your password.';
    case 'auth/user-not-found':
      return "The email you entered doesn't belong to an account. Please check your email and try again.";
    case 'auth/invalid-email':
      return 'The email you entered is not valid';
    case 'auth/email-already-in-use':
      return 'Another account is using the email you entered.';
    default:
      return 'Something went wrong, please try again later';
  }
};

export default getErrorMessage;
