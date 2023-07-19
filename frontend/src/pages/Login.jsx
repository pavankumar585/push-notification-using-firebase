import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().nonempty().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "invalid email" }),
  password: z.string().trim().min(5).max(50),
});

function Login() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log("data", data);

    reset();
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: "700px" }}
      className="d-flex flex-column justify-content-center vh-100 mx-auto"
    >
      <h1 className="text-center mb-4">Login to your account</h1>
      <div className="shadow p-4 rounded" style={{ background: "#FFFFFF" }}>
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
        <Button variant="primary" type="submit" size="sm">
          Sign in
        </Button>
        <p className="mt-2">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </Form>
  );
}

export default Login;
