export const beautifyJSON = (text) => {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text; // if invalid JSON
  }
};

export const minifyJSON = (text) => {
  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return text;
  }
};
