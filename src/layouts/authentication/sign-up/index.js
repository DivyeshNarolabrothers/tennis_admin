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
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

// Images
import curved6 from "assets/images/curved-images/curved14.jpg";
import axios from "axios";

// function SignUp() {
//   const [agreement, setAgremment] = useState(true);

//   const handleSetAgremment = () => setAgremment(!agreement);

//   return (
//     <BasicLayout
//       title="Welcome!"
//       description="Use these awesome forms to login or create new account in your project for free."
//       image={curved6}
//     >
//       <Card>
//         <SoftBox p={3} mb={1} textAlign="center">
//           <SoftTypography variant="h5" fontWeight="medium">
//             Register with
//           </SoftTypography>
//         </SoftBox>
//         <SoftBox mb={2}>
//           <Socials />
//         </SoftBox>
//         <Separator />
//         <SoftBox pt={2} pb={3} px={3}>
//           <SoftBox component="form" role="form">
//             <SoftBox mb={2}>
//               <SoftInput placeholder="Name" />
//             </SoftBox>
//             <SoftBox mb={2}>
//               <SoftInput type="email" placeholder="Email" />
//             </SoftBox>
//             <SoftBox mb={2}>
//               <SoftInput type="password" placeholder="Password" />
//             </SoftBox>
//             <SoftBox display="flex" alignItems="center">
//               <Checkbox checked={agreement} onChange={handleSetAgremment} />
//               <SoftTypography
//                 variant="button"
//                 fontWeight="regular"
//                 onClick={handleSetAgremment}
//                 sx={{ cursor: "poiner", userSelect: "none" }}
//               >
//                 &nbsp;&nbsp;I agree the&nbsp;
//               </SoftTypography>
//               <SoftTypography
//                 component="a"
//                 href="#"
//                 variant="button"
//                 fontWeight="bold"
//                 textGradient
//               >
//                 Terms and Conditions
//               </SoftTypography>
//             </SoftBox>
//             <SoftBox mt={4} mb={1}>
//               <SoftButton variant="gradient" color="dark" fullWidth>
//                 sign up
//               </SoftButton>
//             </SoftBox>
//             <SoftBox mt={3} textAlign="center">
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 Already have an account?&nbsp;
//                 <SoftTypography
//                   component={Link}
//                   to="/authentication/sign-in"
//                   variant="button"
//                   color="dark"
//                   fontWeight="bold"
//                   textGradient
//                 >
//                   Sign in
//                 </SoftTypography>
//               </SoftTypography>
//             </SoftBox>
//           </SoftBox>
//         </SoftBox>
//       </Card>
//     </BasicLayout>
//   );
// }




function SignUp() {
  const [agreement, setAgreement] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    

    try {
      const response = await axios.post('http://35.200.147.33/api/signup', formData);
      console.log('Sign up successful:', response.data);
      // Navigate to login page after successful sign up
      navigate("/authentication/sign-in")
    } catch (error) {
      console.error('Sign up error:', error.response ? error.response.data : error);
      alert('Sign up failed. Please try again.');
    }
  };

  return (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create a new account in your project for free."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Register with
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={2}>
          <Socials />
        </SoftBox>
        <Separator />
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form" onSubmit={handleSubmit}>
            <SoftBox mb={2}>
              <SoftInput
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required // Ensure this field is required
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                name="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
                required // Ensure this field is required
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required // Ensure this field is required
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required // Ensure this field is required
              />
            </SoftBox>
          
            <SoftBox mt={4} mb={1}>
              <SoftButton type="submit" variant="gradient" color="dark" fullWidth>
                Sign Up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;





