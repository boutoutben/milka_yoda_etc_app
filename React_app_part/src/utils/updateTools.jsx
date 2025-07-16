const updateTools = (name, value, setTools) => {
  setTools(prev =>
    prev.map(el => el.name === name ? { ...el, value } : el)
  );
};

export default updateTools