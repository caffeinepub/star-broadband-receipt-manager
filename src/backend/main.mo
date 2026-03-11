import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type Receipt = {
    id : Nat;
    receiptNo : Text;
    date : Text;
    dateOfExpiry : Text;
    userId : Text;
    mobile : Text;
    customerName : Text;
    address : Text;
    installationCharges : Text;
    packageValue : Text;
    speedPlan : Text;
    duration : Text;
    total : Text;
    balance : Text;
    gst : Text;
    grandTotal : Text;
    paymentStatus : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module Receipt {
    public func compareByCreatedAtDesc(receipt1 : Receipt, receipt2 : Receipt) : Order.Order {
      Int.compare(receipt2.createdAt, receipt1.createdAt);
    };
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State
  var nextReceiptNo = 1;
  let receipts = Map.empty<Nat, Receipt>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Receipt Management
  public shared ({ caller }) func createReceipt(receipt : Receipt) : async Receipt {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only admins and authenticated users can create receipts");
    };

    let newReceiptNo = nextReceiptNo;
    nextReceiptNo += 1;

    let newReceipt : Receipt = {
      id = newReceiptNo;
      receiptNo = receipt.receiptNo;
      date = receipt.date;
      dateOfExpiry = receipt.dateOfExpiry;
      userId = receipt.userId;
      mobile = receipt.mobile;
      customerName = receipt.customerName;
      address = receipt.address;
      installationCharges = receipt.installationCharges;
      packageValue = receipt.packageValue;
      speedPlan = receipt.speedPlan;
      duration = receipt.duration;
      total = receipt.total;
      balance = receipt.balance;
      gst = receipt.gst;
      grandTotal = receipt.grandTotal;
      paymentStatus = receipt.paymentStatus;
      createdAt = receipt.createdAt;
    };

    receipts.add(newReceiptNo, newReceipt);
    newReceipt;
  };

  public query ({ caller }) func getAllReceiptsDesc() : async [Receipt] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view receipts");
    };
    receipts.values().toArray().sort(Receipt.compareByCreatedAtDesc);
  };

  public query ({ caller }) func getReceipt(id : Nat) : async Receipt {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view receipts");
    };
    switch (receipts.get(id)) {
      case (null) {
        Runtime.trap("Receipt not found for id " # id.toText());
      };
      case (?receipt) { receipt };
    };
  };

  public shared ({ caller }) func updateReceipt(id : Nat, updatedReceipt : Receipt) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only admins and authenticated users can update receipts");
    };

    switch (receipts.get(id)) {
      case (null) {
        Runtime.trap("Receipt not found for id " # id.toText());
      };
      case (?oldReceipt) {
        let receiptToStore : Receipt = {
          id = oldReceipt.id;
          receiptNo = updatedReceipt.receiptNo;
          date = updatedReceipt.date;
          dateOfExpiry = updatedReceipt.dateOfExpiry;
          userId = updatedReceipt.userId;
          mobile = updatedReceipt.mobile;
          customerName = updatedReceipt.customerName;
          address = updatedReceipt.address;
          installationCharges = updatedReceipt.installationCharges;
          packageValue = updatedReceipt.packageValue;
          speedPlan = updatedReceipt.speedPlan;
          duration = updatedReceipt.duration;
          total = updatedReceipt.total;
          balance = updatedReceipt.balance;
          gst = updatedReceipt.gst;
          grandTotal = updatedReceipt.grandTotal;
          paymentStatus = updatedReceipt.paymentStatus;
          createdAt = updatedReceipt.createdAt;
        };
        receipts.add(id, receiptToStore);
      };
    };
  };

  public shared ({ caller }) func deleteReceipt(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only admins and authenticated users can delete receipts");
    };

    switch (receipts.get(id)) {
      case (null) {
        Runtime.trap("Receipt not found for id " # id.toText());
      };
      case (?_) {
        receipts.remove(id);
      };
    };
  };

  public query ({ caller }) func getNextReceiptNo() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can get next receipt number");
    };
    nextReceiptNo;
  };
};
