import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import userService from "../services/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().trim().min(4).max(50),
  email: z.string().nonempty().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "invalid email" }),
  password: z.string().trim().min(5).max(50),
});

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState, setError, reset } = useForm({ resolver: zodResolver(schema), });
  const { errors } = formState;

  useEffect(() => {
    const user = userService.getUser();

    if(user) {
      const { data } = user;
      setUser(data);
    }
  }, []);

  useEffect(() => {
    if(user && !user?.isVerified) navigate("/validate-email");
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await userService.signUp(data);
      const { data: user } = userService.getUser();
      const { data: verifyData } = await userService.sendVerificationEmail({ email: user.email });

      if(verifyData.status) navigate("/validate-email");
      // we need to use local storage
      toast.success(verifyData.message);
      reset()
    } catch (error) {
      if (error.response && error.response.status === 400)
        setError("name", { type: "custom", message: error.response.data.message, });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Alreay have an account? <Link to="/login" className={loading ? "disable" : ""}>Sign in</Link>
        </p>
      </div>
    </Form>
  );
}

export default Register;
