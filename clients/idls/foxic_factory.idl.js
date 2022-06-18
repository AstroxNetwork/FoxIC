export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    greeting: IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => {
  return [];
};
