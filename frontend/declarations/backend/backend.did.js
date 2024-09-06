export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const SignatureRequest = IDL.Record({
    'id' : IDL.Nat,
    'link' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'createdAt' : Time,
    'notes' : IDL.Opt(IDL.Text),
    'signed' : IDL.Bool,
  });
  return IDL.Service({
    'addSignatureRequest' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [IDL.Nat],
        [],
      ),
    'getSignatureRequests' : IDL.Func(
        [],
        [IDL.Vec(SignatureRequest)],
        ['query'],
      ),
    'markAsSigned' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
