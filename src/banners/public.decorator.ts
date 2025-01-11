export const getIds = async (array): Promise<Array<number>> =>
  array.reduce((result, { id }) => [...result, ...(id ? [+id] : [])], []);
