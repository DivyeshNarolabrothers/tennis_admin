/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import axios from "axios";
import Swal from "sweetalert2";

// function SignIn() {
//   const [rememberMe, setRememberMe] = useState(true);

//   const handleSetRememberMe = () => setRememberMe(!rememberMe);

//   return (
//     <CoverLayout
//       title="Welcome back"
//       description="Enter your email and password to sign in"
//       image={curved9}
//     >
//       <SoftBox component="form" role="form">
//         <SoftBox mb={2}>
//           <SoftBox mb={1} ml={0.5}>
//             <SoftTypography component="label" variant="caption" fontWeight="bold">
//               Email
//             </SoftTypography>
//           </SoftBox>
//           <SoftInput type="email" placeholder="Email" />
//         </SoftBox>
//         <SoftBox mb={2}>
//           <SoftBox mb={1} ml={0.5}>
//             <SoftTypography component="label" variant="caption" fontWeight="bold">
//               Password
//             </SoftTypography>
//           </SoftBox>
//           <SoftInput type="password" placeholder="Password" />
//         </SoftBox>
//         <SoftBox display="flex" alignItems="center">
//           <Switch checked={rememberMe} onChange={handleSetRememberMe} />
//           <SoftTypography
//             variant="button"
//             fontWeight="regular"
//             onClick={handleSetRememberMe}
//             sx={{ cursor: "pointer", userSelect: "none" }}
//           >
//             &nbsp;&nbsp;Remember me
//           </SoftTypography>
//         </SoftBox>
//         <SoftBox mt={4} mb={1}>
//           <SoftButton variant="gradient" color="info" fullWidth>
//             sign in
//           </SoftButton>
//         </SoftBox>
//         <SoftBox mt={3} textAlign="center">
//           <SoftTypography variant="button" color="text" fontWeight="regular">
//             Don&apos;t have an account?{" "}
//             <SoftTypography
//               component={Link}
//               to="/authentication/sign-up"
//               variant="button"
//               color="info"
//               fontWeight="medium"
//               textGradient
//             >
//               Sign up
//             </SoftTypography>
//           </SoftTypography>
//         </SoftBox>
//       </SoftBox>
//     </CoverLayout>
//   );
// }




function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // For navigation


  const showAutoCloseAlert = (message) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const showAutoError = (message) => {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 3000,
    });
  };


  // Handle changes in input fields
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post('http://35.200.147.33/api/login', {
        email,
        password,
      });     

      // Assuming the response contains the token
      const token = response.data.token; // Adjust this based on your API response structure
      if (token) {
        localStorage.setItem('admin_token', token); // Store token in local storage
        showAutoCloseAlert('Sign in successful', response.data.message);
        navigate('/Users'); // Navigate to the dashboard upon successful sign-in
        
      } else {
        showAutoError('Invalid credentials. Please try again.'); // Handle invalid token case
      }
    } catch (error) {
      showAutoError('Sign in error', error.message);
      
    }
  };

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={curved9}
    >
      <SoftBox component="form" role="form" onSubmit={handleSubmit}>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </SoftBox>
        
        <SoftBox mt={4} mb={1}>
          <SoftButton type="submit" variant="gradient" color="info" fullWidth>
            Sign In
          </SoftButton>
        </SoftBox>
        {/* <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox> */}
      </SoftBox>
    </CoverLayout>
  );
}



export default SignIn;
