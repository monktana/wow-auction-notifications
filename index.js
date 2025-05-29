import "dotenv/config";
import got from "got";

const NAMESPACE = {
  DYNAMIC_EU: "dynamic-eu",
  STATIC_EU: "static-eu"
};

const LOCALE = {
  en_US: "en_US",
  es_MX: "es_MX",
  pt_BR: "pt_BR",
  en_GB: "en_GB",
  es_ES: "es_ES",
  fr_FR: "fr_FR",
  ru_RU: "ru_RU",
  de_DE: "de_DE",
  pt_PT: "pt_PT",
  it_IT: "it_IT",
  ko_KR: "ko_KR",
  zh_TW: "zh_TW",
  zh_CN: "zh_CN",
}

const ITEM_CLASS = {
  CONSUMABLE: 0,
  CONTAINER: 1,
  WEAPON: 2,
  GEMS: 3,
  ARMOR: 4,
  REAGENT: 5,
  PROJECTILE: 6,
  TRADE_GOODS: 7,
  ITEM_ENHANCEMENT: 8,
  RECIPE: 9,
  MONEY: 10,
};

const ITEM_SUBCLASS = {
  TRADE_GOODS: {
    PARTS: 1,
    JEWELCRAFTING: 4,
    CLOTH: 5,
    LEATHER: 6,
    METAL_STONE: 7,
    COOKING: 8,
    HERB: 9,
    ELEMENTAL: 10,
    OTHER: 11,
    ENCHANTING: 12,
    INSCRIPTION: 16,
    OPTIONAL_REAGENTS: 18,
    FINISHING_REAGENTS: 19,
  }
};

const ORE_IDS = [210930, 210931, 210932, 210933, 210934, 210935, 210936, 210937, 210938];

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
    }
  }).json();

  return response;
}

const getCommodityAuctions = async (accessToken) => {
  if (!accessToken ) {
    throw new Error(
      "No access token provided. Please authenticate first.",
    );
  }

  const response = await got({
    url: `${process.env.BNET_API_URL}/data/wow/auctions/commodities?locale=${LOCALE.en_GB}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Battlenet-Namespace": NAMESPACE.DYNAMIC_EU,
    },
  }).json();

  return response;
};

const filterAuctions = (auctions, itemIds) => {
  return auctions.filter(({ item }) => itemIds.includes(item.id));
};

try {
  const token = await getAccessToken();
  const auctions = await getCommodityAuctions(token.access_token);
  const oreAuctions = filterAuctions(auctions.auctions, ORE_IDS);
  console.log('test');
} catch (error) {
  console.error("Error fetching access token:", error);
  throw error;
}