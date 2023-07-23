import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { convertEmail } from "../utils/convertEmail";
import { useLocation } from "react-router-dom";
import { verifyEmail } from "../services/userService";
import { toast } from "react-toastify";
import { formatCountdown } from "../utils/formatCountdown";

function OtpForm() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer;
    if(loading) setCountdown(30);
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return toast.error("Please enter otp");

    try {
      setLoading(true);
      const { data } = await verifyEmail({ email: state?.user?.email, otp });
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400)
        toast.error(error.response.data.message);
      if (error.response && error.response.status === 404)
        toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async (e) => {
    try {
      setLoading(true);
      const { data } = await verifyEmail({ email: state?.user?.email, otp });
      toast.success(data.message);
    } catch (error) {
      if (error.response && error.response.status === 400)
        toast.error(error.response.data.message);
    } finally {
      setLoading(false);
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
          {state && `A code has been sent to ${convertEmail(state.user.email)}`}
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
          <Button type="submit" variant="danger" disabled={loading}>
            Validate
          </Button>
        </div>
        <h6 className="text-center my-3">
          OTP Will Expires In:{" "}
          <span className="text-danger">{formatCountdown(countdown)} (S)</span>
        </h6>
        <p className="text-center">
          Didn't get the code{" "}
          <span
            onClick={resendEmail}
            className={
              loading
                ? "text-danger ps-2 disable"
                : "text-danger ps-2 clickable"
            }
          >
            Resend OTP
          </span>
        </p>
      </Form>
    </div>
  );
}

export default OtpForm;
