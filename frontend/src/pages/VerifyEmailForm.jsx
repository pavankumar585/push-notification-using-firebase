import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { convertEmail } from "../utils/convertEmail";
import userService from "../services/userService";
import { toast } from "react-toastify";
import { formatCountdown } from "../utils/formatCountdown";
import { useLocation } from "react-router-dom";

function OtpForm() {
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(29);
  const [timerReset, setTimerReset] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [user, setUser] = useState(null);
  const [otpRequested, setOtpRequested] = useState(state);
  console.log("state", state);

  useEffect(() => {
    const user = userService.getUser();

    if (user) {
      const { data } = user;
      setUser(data);
    }
  }, []);

  useEffect(() => {
    let timer;

    if (timerReset) setCountdown(29);
    setTimerReset(false);

    if (countdown === -1) setOtpRequested(false);

    if (countdown > -1 && !isSent) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, timerReset, isSent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length === 0) return toast.error("Please enter OTP");

    if (otp.length > 0 && otp.length < 4) return toast.error("OTP incomplete");

    try {
      setLoading(true);
      const { data } = await userService.verifyEmail({
        email: user.email,
        otp,
      });
      toast.success(data.message);
    } catch (error) {
      if (error.response && error.response.status === 400)
        toast.error(error.response.data.message);
      if (error.response && error.response.status === 404)
        toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    try {
      setTimerReset(true);
      setIsSent(true);
      const { data } = await userService.sendVerificationEmail({
        email: user.email,
      });
      setOtpRequested(true);
      toast.success(data.message);
    } catch (error) {
      if (error.response && error.response.status === 400)
        toast.error(error.response.data.message);
    } finally {
      setIsSent(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "700px" }}
      className="d-flex align-items-center vh-100 mx-auto"
    >
      <Form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <h3 className="text-danger text-center">
          Please enter the one time password to verify your account
        </h3>
        <p className="text-center">
          {otpRequested &&
            `A code has been sent to ${convertEmail(user?.email)}`}
        </p>
        <div className="d-flex justify-content-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span className="p-2" />}
            renderInput={(props) => (
              <Form.Control
                type="text"
                {...props}
                style={{ width: "40px", textAlign: "center" }}
              />
            )}
          />
        </div>
        <div className="text-center my-3">
          <Button type="submit" variant="danger" disabled={isSent || loading}>
            Validate
          </Button>
        </div>
        {!isSent && countdown > -1 && otpRequested && (
          <h6 className="text-center my-3">
            Resend OTP in{" "}
            <span className="text-danger">
              {"00 : " + formatCountdown(countdown)} sec
            </span>
          </h6>
        )}
        {isSent ? (
          <p className="text-center">Sending...</p>
        ) : (
          (countdown < 0 || !otpRequested) && (
            <p className="text-center clickable" onClick={resendEmail}>
              Resend OTP
            </p>
          )
        )}
      </Form>
    </div>
  );
}

export default OtpForm;
