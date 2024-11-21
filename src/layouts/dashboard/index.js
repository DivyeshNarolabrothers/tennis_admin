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

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [isFrozen, setIsFrozen] = useState(false); // State to track freeze status

  // Function to fetch initial freeze status
  const fetchFreezeStatus = () => {
    const token = localStorage.getItem("admin_token");
    axios
      .get("http://35.200.147.33/api/admin/market-status", {
        headers: {
          admin_token: token,
        },
      })
      .then((response) => {
        // Set initial freeze status based on response
        if (response.data && typeof response.data.isFrozen === "boolean") {
          setIsFrozen(response.data.isFrozen); // Ensure that the response contains a boolean
        } else {
          console.error("Invalid response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching freeze status:", error);
      });
  };

  useEffect(() => {
    fetchFreezeStatus(); // Fetch initial status on component mount
  }, []);

  // Function to handle button click
  const handleFreezeToggle = () => {
    const token = localStorage.getItem("admin_token");

    // Determine the new state
    const newFreezeState = !isFrozen; // Toggle freeze state

    axios
      .post(`http://35.200.147.33/api/admin/market-freeze`, { freeze: newFreezeState }, {
        headers: {
          admin_token: token,
        },
      })
      .then((response) => {
        // Check if the response contains a message
        if (response.data && response.data.message) {
          alert(response.data.message); // Display success message
        }
        // Update freeze status based on the new state
        setIsFrozen(newFreezeState); // Update state to the new freeze state
      })
      .catch((error) => {
        console.error("Error updating market state:", error);
        alert(`Failed to update market state: ${error.response?.data?.message || "Unknown error"}`);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Button onClick={handleFreezeToggle} variant={isFrozen ? "danger" : "success"}>
          {isFrozen ? "Unfreeze" : "Freeze"}
        </Button>



      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "today's money" }}
                count="$53,000"
                percentage={{ color: "success", text: "+55%" }}
                icon={{ color: "info", component: "paid" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "today's users" }}
                count="2,300"
                percentage={{ color: "success", text: "+3%" }}
                icon={{ color: "info", component: "public" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "new clients" }}
                count="+3,462"
                percentage={{ color: "error", text: "-2%" }}
                icon={{ color: "info", component: "emoji_events" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "sales" }}
                count="$103,430"
                percentage={{ color: "success", text: "+5%" }}
                icon={{
                  color: "info",
                  component: "shopping_cart",
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <BuildByDevelopers />
            </Grid>
            <Grid item xs={12} lg={5}>
              <WorkWithTheRockets />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                title="active users"
                description={
                  <>
                    (<strong>+23%</strong>) than last week
                  </>
                }
                chart={chart}
                items={items}
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Sales Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon className="font-bold">arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      4% more{" "}
                      <SoftTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={gradientLineChartData}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Projects />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
