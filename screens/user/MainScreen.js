import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import logo from "../../assets/logo/artick-white.png";
import { colors } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import { network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import SearchableDropdown from "react-native-searchable-dropdown";
import { SliderBox } from "react-native-image-slider-box";
import { Button } from "react-native-web";
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';

const slides = [
  require("../../assets/image/highlight/H1C_Gallery_Nylon_Bandage_Jacket.png"),
  require("../../assets/image/highlight/H1C_Gallery_Nylon_Bandage_Jacket.png"),
];



const MainScreen = ({ navigation, route }) => {
//   const cartproduct = useSelector((state) => state.product);
//   const dispatch = useDispatch();

//   const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

//   const { user } = route.params;
  const [products, setProducts] = useState([]);
//   const [refeshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
//   const [userInfo, setUserInfo] = useState({});
//   const [searchItems, setSearchItems] = useState([]);

  //method to convert the authUser to json object
//   const convertToJSON = (obj) => {
//     try {
//       setUserInfo(JSON.parse(obj));
//     } catch (e) {
//       setUserInfo(obj);
//     }
//   };

  //method to navigate to product detail screen of a specific product
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  //method to add to cart (redux)
  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  var headerOptions = {
    method: "GET",
    redirect: "follow",
  };

  const fetchProduct = () => {
    fetch(`${network.serverip}/products`, headerOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
        console.log(result);
          setProducts(result.data);
          setError("");
          let payload = [];
          result.data.forEach((cat, index) => {
            let searchableItem = { ...cat, id: ++index, name: cat.title };
            payload.push(searchableItem);
          });
          setSearchItems(payload);
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
  };


  //convert user to json and fetch products in initial render
  useEffect(() => {
    // fetchProduct();
    const getProducts = () => {
        fetch(`${network.serverip}/products/get/featured-products`, headerOptions) //API call
        .then((response) => response.json())
        .then((result) => {
            // console.log(result);
            // console.log(result.length > 0);
       


            if (result) {
                console.log(result);
                setProducts(result.data);
                setError("");
            } else {
                setError(result.message);
            }
        })
        .catch((error) => {
            setError(error.message);
            console.log("error", error);
        });
      
    }

    getProducts();
  }, []);


 

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.topBarContainer}>
        <TouchableOpacity>
          <Ionicons name="menu" size={30} color={colors.secondary} 
            // onPress={() => navigation.navigate("cart")}
            
            />


        </TouchableOpacity>
        <View style={styles.topbarlogoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <TouchableOpacity 
            style={styles.cartIconContainer} 
            onPress={() => navigation.navigate("signup")}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.promotiomSliderContainer}>
            <SliderBox
              images={slides}
              sliderBoxHeight={700}
              dotColor={colors.secondary}
              inactiveDotColor={colors.muted}
              paginationBoxVerticalPadding={10}
              autoplayInterval={6000}
            />
            <View style={styles.overlayTextContainer}>
                <Text style={styles.overlayText}>H1C Gallery Nylon Bandage Jacket</Text>
                <Text style={styles.overlayText2}>available only on Artick</Text>
                <Text style={styles.overlayText2}>on 20th June 2023</Text>
                <TouchableOpacity 
                    style={styles.viewReleaseContainer} 
                    onPress={() => navigation.navigate("signup")}>
                <Text style={styles.viewReleaseText}>View Release</Text>
                </TouchableOpacity>
            </View>
          </View>
      
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>MARKETPLACE</Text>
          </View>
         {products ? (
            <View style={styles.productCardContainerEmpty}>
              <Text style={styles.productCardContainerEmptyText}>
                No Product
              </Text>
            </View>
          ) : (
            <View style={styles.productCardContainer}>
              <FlatList
                // refreshControl={
                //   <RefreshControl
                //     refreshing={refeshing}
                //     onRefresh={handleOnRefresh}
                //   />
                // }
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                horizontal={true}
                // data={products.slice(0, 2)}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                  <View
                    key={item._id}
                    style={{ marginLeft: 5, marginBottom: 10, marginRight: 5 }}
                  >
                    <ProductCard
                      name={item.title}
                      image={`${network.serverip}/uploads/${item.image}`}
                      price={item.price}
                      quantity={item.quantity}
                      onPress={() => handleProductPress(item)}
                      onPressSecondary={() => handleAddToCat(item)}
                    />

                    
                  </View>
                )}
              />
              <View style={styles.emptyView}></View>
            </View>
          )}
          
        </ScrollView>
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    marginTop: 30,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  topbarlogoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  bodyContainer: {
    width: "100%",
    flexDirecion: "row",

    paddingBottom: 0,
    flex: 1,
  },
  buttonText: {
    color: colors.secondary,
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
  secondaryText: {
    fontSize: 25,
    fontWeight: "bold",
  },
 
  inputContainer: {
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 40,
    width: "100%",
  },
  scanButtonText: {
    fontSize: 15,
    color: colors.light,
    fontWeight: "bold",
  },
  primaryTextContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 30,
    paddingBottom: 10,
  },

  viewReleaseContainer: {
    backgroundColor: colors.secondary,
    margin: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,


  },

   viewReleaseText: {
        color: colors.primary,  
        fontWeight: "bold",
        fontSize: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
 
  },

overlayTextContainer: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "bold", 
    marginTop: "-80%",
    flex: 1,

  }, 

overlayText: {
    color: colors.secondary,
    fontSize: 30,
    fontWeight: 700, 
    margin: 20,
  }, 

overlayText2: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: 400, 
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
  }, 

  
  primaryText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
  },
  flatListContainer: {
    width: "100%",
    height: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  promotiomSliderContainer: {
    margin: 5,
    height: 700,
    backgroundColor: colors.light,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 60,
    marginLeft: 10,
  },
  emptyView: { width: 30 },
  productCardContainer: {
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmpty: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmptyText: {
    fontSize: 15,
    fontStyle: "italic",
    color: colors.muted,
    fontWeight: "600",
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.secondary,
    borderRadius: 1,
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
});
