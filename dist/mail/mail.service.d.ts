export declare class MailService {
    private transporter;
    constructor();
    sendOtpEmail(to: string, otp: string): Promise<void>;
}
