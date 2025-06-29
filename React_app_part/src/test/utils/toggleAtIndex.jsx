const toggleAtIndex = (array, setArray, index) => {
    const updated = [...array];
    updated[index] = !updated[index];
    setArray(updated);
};

export default toggleAtIndex;