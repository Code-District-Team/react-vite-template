export const phoneRegex =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
export const onlyAlphabets = /^[A-Za-z]+$/;
export const passwordRegex =
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^,/()+-=*_<>?`~"'|])[A-Za-z\d@$!%*?&.#^,/()+-=*_<>?`~"'|]{6,}$/;
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^<>|])[A-Za-z\d@$!%*?&.#^<>|]{6,}$/;
export const passwordMessage = (
  <>
    Password must be at least 6 characters, non alphanumeric character, one
    digit (0-9), one uppercase (A-Z), one lowercase (a-z), one special character{" "}
  </>
);
