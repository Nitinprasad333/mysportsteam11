export declare class User {
    id: number;
    name: string;
    email: string;
    dob: string;
    mobile: string;
    otp?: string;
    otpExpiresAt?: Date;
    refreshToken?: string;
    profilePicture?: string;
    bio?: string;
    country?: string;
    state?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}
