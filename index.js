import "dotenv/config";
import got from "got";

const getAccessToken = async () => {
  const clientId = process.env.BNET_CLIENT_ID;
  const clientSecret = process.env.BNET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("BATTLE_NET_CLIENT_ID and BATTLE_NET_CLIENT_SECRET must be set in environment variables.");
  }

  const response = await got.post(process.env.BNET_AUTH_URL, {
    username: clientId,
    password: clientSecret,
    form: {
      grant_type: "client_credentials",
    },
    responseType: "json",
  }).json();

  return response;
}

const getAuctionData = async (accessToken) => {
  if (!accessToken ) {
    throw new Error(
      "No access token provided. Please authenticate first.",
    );
  }

  const response = await got({
      url: `${process.env.BNET_API_URL}/data/wow/connected-realm/${process.env.BNET_REALM_ID}/auctions?namespace=dynamic-eu`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .json();

  return response;
};

try {
  const token = await getAccessToken();
  const auctionData = await getAuctionData(token.access_token);
  console.log('test');
} catch (error) {
  console.error("Error fetching access token:", error);
  throw error;
}