import axios from "axios";

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "WSc5QQe2ECCNmceeNGoRcnyh60oeM0eY",
        client_secret: "8gHNj5eHYJGrT6uq",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    console.error("Full error:", error);
  }
};


