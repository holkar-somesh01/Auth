const sendEmail = require("./email");

exports.sendOTP = async (email, otp) => {
    const subject = "Your OTP Code";
    const message = `Your OTP code is: <strong>${otp}</strong>. It is valid for 10 minutes.`;

    try {
        await sendEmail({ subject, to: email, message });
        console.log("OTP email sent to:", email);
        return true;
    } catch (error) {
        console.error("Failed to send OTP:", error);
        throw error; // Let the controller handle the error
    }
};
