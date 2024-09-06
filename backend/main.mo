import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Result "mo:base/Result";

actor {
  type SignatureRequest = {
    id: Nat;
    name: Text;
    notes: ?Text;
    link: ?Text;
    createdAt: Time.Time;
    signed: Bool;
  };

  stable var nextId : Nat = 0;
  stable var signatureRequests : [SignatureRequest] = [];

  public func addSignatureRequest(name: Text, notes: ?Text, link: ?Text) : async Nat {
    let id = nextId;
    let newRequest : SignatureRequest = {
      id = id;
      name = name;
      notes = notes;
      link = link;
      createdAt = Time.now();
      signed = false;
    };
    signatureRequests := Array.append(signatureRequests, [newRequest]);
    nextId += 1;
    id
  };

  public query func getSignatureRequests() : async [SignatureRequest] {
    signatureRequests
  };

  public func markAsSigned(id: Nat) : async Bool {
    let index = Array.indexOf<SignatureRequest>(
      { id = id; name = ""; notes = null; link = null; createdAt = 0; signed = false },
      signatureRequests,
      func(a, b) { a.id == b.id }
    );
    switch (index) {
      case null { false };
      case (?i) {
        let updatedRequest = {
          id = signatureRequests[i].id;
          name = signatureRequests[i].name;
          notes = signatureRequests[i].notes;
          link = signatureRequests[i].link;
          createdAt = signatureRequests[i].createdAt;
          signed = true;
        };
        signatureRequests := Array.mapEntries<SignatureRequest, SignatureRequest>(
          signatureRequests,
          func(req, j) { if (j == i) updatedRequest else req }
        );
        true
      };
    }
  };
}
