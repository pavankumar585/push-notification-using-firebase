import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string().trim().min(4).max(50),
  email: z.string().nonempty().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "invalid email" }),
  password: z.string().trim().min(5).max(50),
});

function Register() {
  const { register, handleSubmit, formState: { errors }, reset  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log("data", data);

    reset();
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column justify-content-center vh-100 w-50 mx-auto"
    >
      <h1 className="text-center mb-4">Create your account</h1>
      <div className="shadow p-4 rounded">
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
        <Button variant="primary" type="submit" size="sm" className="w-25">
          Create account
        </Button>
        <p className="mt-2">
          Alreay have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </Form>
  );
}

export default Register;
