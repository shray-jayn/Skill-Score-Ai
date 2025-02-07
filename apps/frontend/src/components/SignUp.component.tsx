import React from "react";
import { Button, Form, Input, Checkbox, message } from "antd";
import { authService } from "../services/auth.service"; 
import { useNavigate } from "react-router-dom"; 
import { useSetRecoilState } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

const SignUpComponent: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); 
  const setAuth = useSetRecoilState(authState); 

  const onFinish = async (values: any) => {
    const { name, email, password } = values;

    try {
      
      const response = await authService.register({ name, email, password });
      const { user, token } = response;

      setAuth({
        isAuthenticated: true,
        user,
        token
      });

      message.success("Account created successfully!");
      console.log("Registration successful:", response);

      navigate("/");
    } catch (error: any) {
      console.error("Registration failed:", error);

      // Display error message
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Registration failed!");
      } else {
        message.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      {/* Heading */}
      <div className="w-full flex justify-center mb-8">
        <img
          src="https://www.graduatesfirst.com/wp-content/uploads/2024/02/IMD-Horizontal-Lockup-Blue-on-White-Safe-Space-RGB.jpg"
          alt="Skill Score Ai"
          className="w-48"
        />
      </div>  

      <p className="text-3xl font-medium mb-2 text-center">Get Started Now</p>
      <p className="text-gray-500 mb-6 text-center">
        Enter your credentials to create your account
      </p>

      
      {/* Form */}
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please input your Name!" },
            { min: 3, message: "Name must be at least 3 characters long!" },
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: "Please input your Email!" },
            {
              type: "email",
              message: "Please enter a valid Email address!",
            },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input your Password!" },
            {
              min: 8,
              message: "Password must be at least 8 characters long!",
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
              message:
                "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character!",
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("You must agree to the Terms & Privacy!")
                    ),
            },
          ]}
        >
          <Checkbox>I agree to the Terms & Privacy</Checkbox>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>

      <p className="text-center text-sm mt-4">
        Have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default SignUpComponent;
