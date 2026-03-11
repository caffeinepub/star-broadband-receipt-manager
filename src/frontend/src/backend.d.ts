import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Receipt {
    id: bigint;
    gst: string;
    customerName: string;
    dateOfExpiry: string;
    total: string;
    duration: string;
    paymentStatus: string;
    balance: string;
    userId: string;
    date: string;
    createdAt: bigint;
    speedPlan: string;
    grandTotal: string;
    address: string;
    packageValue: string;
    receiptNo: string;
    mobile: string;
    installationCharges: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReceipt(receipt: Receipt): Promise<Receipt>;
    deleteReceipt(id: bigint): Promise<void>;
    getAllReceiptsDesc(): Promise<Array<Receipt>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNextReceiptNo(): Promise<bigint>;
    getReceipt(id: bigint): Promise<Receipt>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateReceipt(id: bigint, updatedReceipt: Receipt): Promise<void>;
}
