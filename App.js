import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View, Image, Pressable, FlatList } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { LineChart, CandlestickChart } from "react-native-wagmi-charts";

const data2 = [
  {
    timestamp: 1625945400000,
    value: 33575.25,
  },
  {
    timestamp: 1625946300000,
    value: 33545.25,
  },
  {
    timestamp: 1625947200000,
    value: 33510.25,
  },
  {
    timestamp: 1625948100000,
    value: 33215.25,
  },
];

export default function App() {
  const [isReady, setReady] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [market, setMarket] = React.useState([]);
  const [chart, setChart] = React.useState([]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const market = await fetch("https://api.upbit.com/v1/market/all?isDetails=false");
        const json_market = await market.json();
        setMarket(json_market);
        const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-DOGE", { method: "GET", headers: { accept: "application/json" } });
        const json = await res.json();
        setData(json);
        const btc = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200");
        const btc_json = await btc.json();
        const eth = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-ETH&count=200");
        const eth_json = await eth.json();
        const doge = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-DOGE&count=200");
        const doge_json = await doge.json();
        const json_filter = [...btc_json, ...eth_json, ...doge_json].map((item) => {
          return {
            timestamp: new Date(item.candle_date_time_utc).getTime(),
            value: item.trade_price,
            open: item.opening_price,
            close: item.trade_price,
            high: item.high_price,
            low: item.low_price,
          };
        });
        setChart(json_filter);
      } catch (err) {
        console.error(err);
      }
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const renderItem = ({ item, index }) => {
    const name = market.filter((item2) => item2.market === item.market)[0];
    return (
      <View
        style={{
          flexDirection: "row",
          width: wp(80),
          marginHorizontal: wp(10),
          height: hp(10),
          borderBottomWidth: 1,
          borderColor: "#aaa",
          justifyContent: "center",
        }}
      >
        <View style={{ width: wp(25), justifyContent: "center" }}>
          {item.market.split("-")[1] === "BTC" ? (
            <Image source={require("./assets/btc.png")} style={{ width: wp(15), height: wp(15) }} />
          ) : item.market.split("-")[1] === "ETH" ? (
            <Image source={require("./assets/eth.png")} style={{ width: wp(12), height: wp(12) }} />
          ) : item.market.split("-")[1] === "DOGE" ? (
            <Image source={require("./assets/doge.png")} style={{ width: wp(12), height: wp(12) }} />
          ) : null}
        </View>
        <View style={{ width: wp(30), justifyContent: "center" }}>
          <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "#fff" }}>{name.english_name}</Text>
          <Text style={{ fontSize: hp(1.5), fontWeight: "bold", color: "#aaa" }}>{item.market.split("-")[1]}</Text>
        </View>
        <View style={{ width: wp(25), justifyContent: "center", alignItems: "flex-end" }}>
          <Text style={{ fontSize: hp(1.7), color: "#fff" }}>₩ {item.trade_price}</Text>
          {item.signed_change_rate > 0 ? (
            <Text style={{ fontSize: hp(1.7), color: "red" }}>+{(item.signed_change_rate * 100).toPrecision(2)} %</Text>
          ) : (
            <Text style={{ fontSize: hp(1.7), color: "skyblue" }}>{(item.signed_change_rate * 100).toPrecision(2)} %</Text>
          )}
        </View>
      </View>
    );
  };

  if (isReady) {
    return (
      <View style={styles.container2}>
        <View style={{ flexDirection: "row", paddingHorizontal: wp(5) }}>
          <MaterialCommunityIcons name="dots-triangle" size={hp(5)} color="#fff" style={{ marginRight: wp(65) }} />
          <Image style={{ width: hp(5), height: hp(5), borderRadius: 100 }} source={require("./assets/person.jpeg")} />
        </View>
        <Text style={{ marginTop: hp(5), textAlign: "center", color: "#fff", fontSize: hp(5), fontWeight: "bold" }}>$12,345</Text>
        <Text style={{ marginTop: hp(2), textAlign: "center", color: "#aaa", fontSize: hp(2) }}>total balance</Text>
        <PagerView style={{ marginTop: hp(5), width: wp(100), height: hp(30) }} initialPage={0}>
          <View
            style={{
              width: wp(80),
              height: hp(30),
              backgroundColor: "#fff",
              marginHorizontal: wp(10),
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            key="1"
          >
            <Text style={{ fontSize: hp(3), fontWeight: "bold" }}>Bitcoin</Text>
            <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "#aaa" }}>₩{data[0].trade_price}</Text>
            <CandlestickChart.Provider data={chart.slice(0, 200)}>
              <CandlestickChart width={wp(80)} height={hp(20)}>
                <CandlestickChart.Candles color="#609683"/>
              </CandlestickChart>
            </CandlestickChart.Provider>
          </View>
          <View
            style={{
              width: wp(80),
              height: hp(30),
              backgroundColor: "#fff",
              marginHorizontal: wp(10),
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            key="2"
          >
            <Text style={{ fontSize: hp(3), fontWeight: "bold" }}>Etherium</Text>
            <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "#aaa" }}>₩{data[1].trade_price}</Text>
            <LineChart.Provider data={chart.slice(200, 400)}>
              <LineChart width={wp(80)} height={hp(20)}>
                <LineChart.Path color="#609683"/>
                <LineChart.CursorCrosshair>
                  <LineChart.Tooltip />
                </LineChart.CursorCrosshair>
              </LineChart>
            </LineChart.Provider>
          </View>
          <View
            style={{
              width: wp(80),
              height: hp(30),
              backgroundColor: "#fff",
              marginHorizontal: wp(10),
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            key="3"
          >
            <Text style={{ fontSize: hp(3), fontWeight: "bold" }}>Doge</Text>
            <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "#aaa" }}>₩{data[2].trade_price}</Text>
            <LineChart.Provider data={chart.slice(400, 600)}>
              <LineChart width={wp(80)} height={hp(20)}>
                <LineChart.Path color="#609683" />
                <LineChart.CursorCrosshair>
                  <LineChart.Tooltip />
                </LineChart.CursorCrosshair>
              </LineChart>
            </LineChart.Provider>
          </View>
        </PagerView>
        <View style={{ marginTop: hp(5) }}>
          <Text style={{ marginBottom: hp(1), marginHorizontal: wp(10), color: "#fff", fontSize: hp(2) }}>Current price</Text>
          <FlatList data={data} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image style={{ width: wp(80), height: wp(80), alignSelf: "center" }} source={require("./assets/crypto.png")} />
      <Text style={{ alignSelf: "center", width: wp(80), textAlign: "center", color: "#fff", fontSize: hp(6), fontWeight: "bold" }}>
        Brand new way to invest
      </Text>
      <Text style={{ width: wp(70), alignSelf: "center", textAlign: "center", fontSize: hp(2), color: "#aaa", marginTop: hp(3) }}>
        Track market positions in real time and make your investment easily
      </Text>
      <Pressable
        style={{
          marginTop: hp(5),
          backgroundColor: "#fff",
          width: wp(60),
          height: hp(7),
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
        onPress={() => setReady(true)}
      >
        <Text style={{ fontSize: hp(2), fontWeight: "bold" }}>Get started</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A090B",
    paddingTop: hp(20),
  },
  container2: {
    flex: 1,
    backgroundColor: "#0A090B",
    paddingTop: hp(7),
  },
});
