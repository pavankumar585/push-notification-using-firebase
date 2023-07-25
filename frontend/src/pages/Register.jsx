import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import userService from "../services/userService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate, Navigate } from "react-router-dom";
import { convertEmail } from "../utils/convertEmail";
import { formatCountdown } from "../utils/formatCountdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import moment from "moment";

const schema = z.object({
  name: z.string().trim().min(4).max(50),
  email: z
    .string()
    .nonempty()
    .email()
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "invalid email" }),
  password: z.string().trim().min(5).max(50),
});

function Register() {
  const count = JSON.parse(localStorage.getItem("count"));
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(count);
  const [otpExpired, setOtpExpired] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validate, setValidate] = useState(false);
  const { register, handleSubmit, formState, setError, reset } = useForm({ resolver: zodResolver(schema), });
  const { errors } = formState;

  useEffect(() => {
    const user = userService.getUser();
    if (user) setCurrentUser(user.data);

    if (count < 0) setOtpExpired(true);
  }, []);

  useEffect(() => {
    let timer;

    if (count === 0) {
      setOtpExpired(true);
      setOtp("");
    }

    timer = setInterval(() => {
      if (countdown > -1) setCountdown((prev) => prev - 1);
    }, 1000);

    localStorage.setItem("count", countdown);

    return () => {
      clearInterval(timer);
    };
  }, [countdown, otpExpired]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await userService.signUp(data);
      const user = userService.getUser();
      setCurrentUser(user.data);

      const { data: response } = await userService.sendVerificationEmail({ email: user.data.email,});
      toast.success(response.message);
      setOtpExpired(false);
      setCountdown(29);
      reset();
    } catch (error) {
      if (error.response && error.response.status === 400)
        setError("name", { type: "custom", message: error.response.data.message, });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = async () => {
    if (otp.length === 0) return toast.error("Please enter OTP");
    if (otp.length > 0 && otp.length < 4) return toast.error("OTP incomplete");

    try {
      setValidate(true);
      const { data } = await userService.verifyEmail({ email: currentUser.email, otp, });
      userService.setUser(data);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400)
        toast.error(error.response.data.message);
      if (error.response && error.response.status === 404)
        toast.error(error.response.data.message);
    } finally {
      setValidate(false);
    }
  };

  const resendEmail = async () => {
    try {
      setSending(true);
      const { data } = await userService.sendVerificationEmail({ email: currentUser.email, });
      toast.success(data.message);
      setOtpExpired(false);
      setCountdown(29);
    } catch (error) {
      if (error.response && error.response.status === 400)
        toast.error(error.response.data.message);
    } finally {
      setSending(false);
    }
  };

  if (currentUser?.isVerified) return <Navigate to="/" />;

  return currentUser && !loading ? (
    <div
      style={{ maxWidth: "700px" }}
      className="d-flex align-items-center vh-100 mx-auto"
    >
      <div className="shadow p-4 rounded">
        <h3 className="text-danger text-center">
          Please enter the one time password to verify your account
        </h3>
        <p className="text-center">
          {!otpExpired &&
            `A code has been sent to ${convertEmail(currentUser?.email)}`}
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
          <Button onClick={validateEmail} variant="danger" disabled={validate}>
            Validate
          </Button>
        </div>
        {!otpExpired && (
          <h6 className="text-center my-3">
            Resend OTP in{" "}
            <span className="text-danger">
              {"00 : " + formatCountdown(countdown)} sec
            </span>
          </h6>
        )}
        {sending ? (
          <p className="text-center">Sending...</p>
        ) : (
          otpExpired && (
            <div className="text-center">
              <span className="clickable" onClick={resendEmail}>
                Resend OTP
              </span>
            </div>
          )
        )}
      </div>
    </div>
  ) : (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: "700px" }}
      className="d-flex flex-column justify-content-center vh-100 mx-auto"
    >
      <h1 className="text-center mb-4">Create your account</h1>
      <div className="shadow p-4 rounded" style={{ background: "#FFFFFF" }}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            {...register("name")}
            type="text"
            placeholder="Enter Name"
          />
          {errors.name?.message && (
            <Alert variant="danger" className="p-2">
              {errors.name.message}
            </Alert>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            {...register("email")}
            type="email"
            placeholder="Enter email"
          />
          {errors.email?.message && (
            <Alert variant="danger" className="p-2">
              {errors.email.message}
            </Alert>
          )}
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            {...register("password")}
            type="password"
            placeholder="Password"
            autoComplete="off"
          />
          {errors.password?.message && (
            <Alert variant="danger" className="p-2">
              {errors.password.message}
            </Alert>
          )}
        </Form.Group>
        <Button variant="primary" type="submit" size="sm" disabled={loading}>
          Sign up
        </Button>
        <p className="mt-2">
          Alreay have an account?{" "}
          <Link to="/login" className={loading ? "disable" : ""}>
            Sign in
          </Link>
        </p>
      </div>
    </Form>
  );
}

export default Register;
