import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface SignatureRequest {
  'id' : bigint,
  'link' : [] | [string],
  'name' : string,
  'createdAt' : Time,
  'notes' : [] | [string],
  'signed' : boolean,
}
export type Time = bigint;
export interface _SERVICE {
  'addSignatureRequest' : ActorMethod<
    [string, [] | [string], [] | [string]],
    bigint
  >,
  'getSignatureRequests' : ActorMethod<[], Array<SignatureRequest>>,
  'markAsSigned' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
