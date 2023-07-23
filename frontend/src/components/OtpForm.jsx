import { useState } from "react";
import OtpInput from "react-otp-input";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { convertEmail } from './../utils/convertEmail';

function OtpForm({ label, email = "pavanmaddala16@gmail.com" }) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length < 4) return;

    console.log("otp--", otp);
  };

  return (
    <div
      style={{ maxWidth: "700px" }}
      className="d-flex align-items-center vh-100 mx-auto"
    >
      <Form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <h3 className="text-danger text-center">
          {label
            ? label
            : "Please enter the one time password to verify your account"}
        </h3>
        <p className="text-center">
          {email && `A code has been sent to ${convertEmail(email)}`}
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
          <Button type="submit" variant="danger">
            Validate
          </Button>
        </div>
        <p className="text-center">
          Didn't get the code{" "}
          <span className="text-danger ps-2 clickable">Resend OTP</span>
        </p>
      </Form>
    </div>
  );
}

export default OtpForm;
