export const validateEmail = (email: string): boolean => {
  return Boolean(
    email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
};

export const validatePassword = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
};
