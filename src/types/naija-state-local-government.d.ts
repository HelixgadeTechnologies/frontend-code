declare module 'naija-state-local-government' {
  const content: {
    allStates: () => string[];
    allLgas: () => string[];
    getStateLgas: (state: string) => string[];
  };

  export default content;
}