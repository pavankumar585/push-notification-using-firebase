import OtpInput from "react-otp-input";
import { useState } from "react";

function OtpForm() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("otp--", otp);
  };

  return (
    <form onSubmit={handleSubmit}>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
      <button type="submit">validate</button>
    </form>
  );
}

export default OtpForm;
