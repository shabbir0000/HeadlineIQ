import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import { AppContext } from '../../AppContext';

const Home = ({ navigation }) => {
  const data = [...new Array(6).keys()];
  const [email, setEmail] = useState('');
  const [GetData2, setGetData2] = useState([
    {
      fullname: 'Vegetables',
      dis: 'Best Vegetable Soup With Chicken',
      price: 5000,
      image:
        'https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=',
    },

    {
      fullname: 'Soup',
      dis: 'Best Vegetable Soup With Chicken',
      price: 5000,
      image:
        'https://www.allrecipes.com/thmb/p4F_knUDCrUNusNOTyjY_dCp8d4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/13338-quick-and-easy-vegetable-soup-DDMFS-4x3-402702f59e7a41519515cecccaba1b80.jpg',
    },

    {
      fullname: 'Deserts',
      dis: 'Best Vegetable Soup With Chicken',
      price: 500,
      image:
        'https://imgix.theurbanlist.com/content/article/biz_profile_owner_uploaded_photos/dezerts.jpg',
    },

    {
      fullname: 'Biryani',
      dis: 'Best Vegetable Soup With Chicken',
      price: 500,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ33OMmjLKGZb0y2rcO02C2EEDOE7uoFgJyw&s',
    },
    {
      fullname: 'Beef Polao',
      dis: 'Best Vegetable Soup With Chicken',
      price: 500,
      image: 'https://i.ytimg.com/vi/8I58bXx49Vk/maxresdefault.jpg',
    },
  ]);
  const [password, setPassword] = useState('');
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const [GetData4, setGetData4] = useState([]);
  const [Guest, SetGuest] = useState('');
  const [loading, setloading] = useState(true);
  const [entry, setentry] = useState(true);
  const height = Dimensions.get('window').height;
  const progress = useSharedValue(0);
  const width = Dimensions.get('window').width;
  const [GetData5, setGetData5] = useState([]);
  // console.log('length', GetData5.length);
  const {
    state,
    cat,
    setcat,
    setvendoremail,
    addToCart,
    updateCart,
    removeFromCart,
    decreaseQuantity,
  } = useContext(AppContext);

  const ref = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      const coll = collection(db, 'Restaurentstatus');

      AsyncStorage.getItem('role').then(role => {
        AsyncStorage.getItem('Guest').then(guest => {
          if (guest === 'Yes') {
            onSnapshot(coll, snapshot => {
              snapshot.docs.map(doc => {
                const mystatus = doc.data();

                if (mystatus.Status === false) {
                  setentry(false);
                  // Alert.alert(
                  //   'Restaurant Offline',
                  //   'Restaurant is currently offline.',
                  //   [
                  //     {
                  //       text: 'OK',
                  //       onPress: () => {
                  //         // BackHandler.exitApp(); // app close kar deta hai
                  //         setentry(false);
                  //       },
                  //     },
                  //   ],
                  //   { cancelable: false },
                  // );
                }
              });
            });
          } else {
            if (role === 'Admin') {
              return;
            } else {
              onSnapshot(coll, snapshot => {
                snapshot.docs.map(doc => {
                  const mystatus = doc.data();

                  if (mystatus.Status === false) {
                    setentry(false);
                    // Alert.alert(
                    //   'Restaurant Offline',
                    //   'Restaurant is currently offline.',
                    //   [
                    //     {
                    //       text: 'OK',
                    //       onPress: () => {
                    //         // BackHandler.exitApp(); // app close kar deta hai
                    //         setentry(false);
                    //       },
                    //     },
                    //   ],
                    //   { cancelable: false },
                    // );
                  }
                });
              });
            }
          }
        });
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        AsyncStorage.getItem('Guest').then(guest => {
          SetGuest(guest);
          const coll = collection(db, 'Products');
          const q = query(
            coll,
            // where('email', '==', email),
            where('active', '==', true),
          );
          const unSubscribe = onSnapshot(q, snapshot => {
            setGetData(
              snapshot.docs.map(doc => ({
                selecteduser: doc.data(),
              })),
            );
          });
          setloading(false);
          return () => {
            unSubscribe();
          };
        });
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        const coll = collection(db, 'Sub_Maincat');
        const q = query(coll, where('email', '==', email));
        const unSubscribe = onSnapshot(coll, snapshot => {
          setGetData1(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
        return () => {
          unSubscribe();
        };
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     let unsubscribe = null;

  //     AsyncStorage.getItem('email').then(email => {
  //       const coll = collection(db, 'Companypromotion');
  //       unsubscribe = onSnapshot(coll, snapshot => {
  //         const images = [];
  //         setGetData4(
  //           snapshot.docs.map(doc => ({
  //             selecteduser: doc.data(),
  //           })),
  //         );
  //         snapshot.forEach(async docs => {
  //           const data = docs.get('img');
  //           console.log('images for promotion', data[0]);

  //           // if (data) {
  //           // Agar img array hai to img[0] lo, warna direct img
  //           // if (Array.isArray(data.img)) {
  //           images.push(data[0]);
  //           // } else {
  //           //   images.push(data.img);
  //           // }
  //           // }
  //         });

  //         // Sirf Firebase wali images set karo
  //         console.log('all images', images);

  //         setGetData5(images);
  //       });
  //     });

  //     return () => {
  //       if (unsubscribe) unsubscribe();
  //     };
  //   }, []),
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     let unsubscribePromos = null;
  //     let unsubscribeProducts = null;

  //     let products = [];

  //     // const setupListeners = async () => {
  //     // 🔹 1. Real-time listener for Products
  //     const prodColl = collection(db, 'Products');
  //     unsubscribeProducts = onSnapshot(prodColl, productSnap => {
  //       products = productSnap.docs.map(d => ({
  //         id: d.id,
  //         ...d.data(),
  //       }));
  //     });

  //     // 🔹 2. Real-time listener for Companypromotion
  //     const promoColl = collection(db, 'Companypromotion');
  //     unsubscribePromos = onSnapshot(promoColl, snapshot => {
  //       const promos = snapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       // 🔹 Filter promotions based on inactive product IDs
  //       const inactiveProductIds = products
  //         .filter(p => p.active === false)
  //         .map(p => p.id);

  //       const filteredPromos = promos.filter(
  //         p => !inactiveProductIds.includes(p.product_v),
  //       );

  //       setGetData4(filteredPromos);

  //       // 🔹 Extract images for filtered promotions
  //       const images = [];
  //       filteredPromos.forEach(promo => {
  //         const data = promo.img;
  //         if (Array.isArray(data) && data.length > 0) {
  //           images.push(data[0]);
  //         }
  //       });

  //       setGetData5(images);
  //       console.log('✅ Real-time filtered promos:', filteredPromos);
  //     });
  //     // };

  //     // setupListeners();

  //     // 🔹 Cleanup
  //     return () => {
  //       if (unsubscribePromos) unsubscribePromos();
  //       if (unsubscribeProducts) unsubscribeProducts();
  //     };
  //   }, []),
  // );

  const [inactiveProducts, setInactiveProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  useEffect(() => {
    let unsubscribePromos = null;
    let unsubscribeProducts = null;

    // 🔹 1. Listen only to inactive Products (active == false)
    const prodColl = collection(db, 'Products');
    const prodQuery = query(prodColl, where('active', '==', false));

    unsubscribeProducts = onSnapshot(prodQuery, productSnap => {
      const productData = productSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
      setInactiveProducts(productData);
    });

    // 🔹 2. Listen to all Companypromotion documents
    const promoColl = collection(db, 'Companypromotion');
    unsubscribePromos = onSnapshot(promoColl, promoSnap => {
      const promoData = promoSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
      setPromos(promoData);
    });

    // 🔹 3. Combine both whenever either changes

    // 🔹 Cleanup
    return () => {
      if (unsubscribePromos) unsubscribePromos();
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, []);

  useEffect(() => {
    if (inactiveProducts.length === 0 && promos.length === 0) return;

    const inactiveIds = inactiveProducts.map(p => p.id);

    const filtered = promos.filter(p => !inactiveIds.includes(p.product_v));

    setGetData4(filtered);

    // 🔹 Extract first image from each valid promo
    const images = [];
    filtered.forEach(promo => {
      if (Array.isArray(promo.img) && promo.img.length > 0) {
        images.push(promo.img[0]);
      }
    });

    setGetData5(images);

    console.log('✅ Updated promos (filtered inactive products):', filtered);
  }, [inactiveProducts, promos]);


  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userid').then(id => {
        const coll = collection(db, 'subs_users');
        const q = query(coll, where('uid', '==', id));
        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData3(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
        return () => {
          unSubscribe();
        };
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      {/* <Screensheader
        name={'LOGIN'}
        left={5}
        onPress={() => navigation.goBack()}
      /> */}
      {/* <ScrollView> */}

      <View
        style={[
          { width: width * 0.95 },
          tw` h-12 mt-6 self-center flex-row justify-between`,
        ]}
      >
        <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
          <View
            style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
          >
            <Image
              style={tw`h-12 w-12 rounded-full`}
              resizeMode="contain"
              source={
                GetData3.length
                  ? { uri: GetData3[0]?.selecteduser?.image[0] }
                  : require('../../Images/userc.png')
              }
            />
          </View>

          <View>
            <Text style={tw`ml-2 font-semibold text-base`}>
              {Guest === 'Yes' ? 'Guest User' : GetData3[0]?.selecteduser?.name}
            </Text>
            <Text style={tw`ml-2 font-semibold text-xs`}>
              {Guest === 'Yes' ? 'Guest' : GetData3[0]?.selecteduser?.role}
            </Text>
          </View>
        </View>

        {/* <View
          style={[
            { width: width * 0.28 },
            tw` justify-evenly mr-3 items-center flex-row`,
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('cart');
            }}
          >
            <Image
              style={tw`h-6 w-6`}
              source={require('../../Images/trolley.png')}
            />
          </TouchableOpacity>
        </View> */}

        <View
          style={[
            { width: width * 0.28 },
            tw`justify-evenly mr-3 items-center flex-row`,
          ]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('cart')}>
            <View>
              <Image
                style={tw`h-6 w-6`}
                source={require('../../Images/trolley.png')}
              />
              {/* Badge */}

              <View
                style={[
                  tw`absolute -top-2 -right-2 rounded-full bg-red-600`,
                  {
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                <Text style={[tw`text-white text-xs font-bold`]}>
                  {state.cart.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          {
            width: width,
            height: height * 0.9,
            //   alignSelf : '',
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          },
          tw`mt-5 self-end flex-1 flex-col  bg-white `,
        ]}
      >
        {entry ? (
          loading && GetData.length === 0 ? (
            <>
              <ActivityIndicator
                color={'#00b9e2'}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                size={'large'}
              />
            </>
          ) : (
            <>
              {GetData4.length ? (
                <>
                  <View
                    style={[
                      { width: width * 0.9 },
                      tw`mt-10 self-center items-start  `,
                    ]}
                  >
                    <Text style={tw`text-black font-bold text-xl`}>
                      Promotions
                    </Text>
                    {/* <Input
              value={email}
              onchangetext={setEmail}
              source={require('../../Images/emailcolor.png')}
              placeholder={'Enter Email'}
            /> */}
                  </View>

                  <View style={tw`w-80 border-black items-center self-center`}>
                    <Carousel
                      loop
                      width={420}
                      height={height / 4}
                      autoPlay={true}
                      mode="parallax"
                      parallaxScrollingScale={0.9}
                      parallaxScrollingOffset={50}
                      data={GetData4}
                      scrollAnimationDuration={1000}
                      renderItem={({ item, index }) => (
                        <View
                          key={index}
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              console.log('logs', item);
                              navigation.navigate('Productdetail', {
                                userid: item.product_v,
                                type: item.chargetype_l,
                                discount: item.discount_charges,
                              });
                            }}
                          >
                            <Image
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                              }}
                              source={{ uri: GetData5[index] }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                </>
              ) : (
                <View style={tw`mt-10 h-40 justify-center items-center`}>
                  <Text>No Promotion Right Now</Text>
                </View>
              )}

              <ScrollView>
                <View
                  style={[
                    { width: width * 0.9 },
                    tw`mt-5 self-center flex-row  justify-between items-start  `,
                  ]}
                >
                  <Text style={tw`text-black font-bold text-xl`}>
                    Top Categories
                  </Text>
                  {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('Categoryproducts',{});
              }}
            >
              <Text style={tw`text-black text-lg`}>View All</Text>
            </TouchableOpacity> */}
                </View>

                <View
                  style={[
                    { width: width * 0.95 },
                    tw` mb-5 flex-row justify-center h-15 mt-3  items-start  `,
                  ]}
                >
                  {/* <View style={tw`mb-5 w-90 mt-5 justify-center rounded-md`}> */}
                  {/* <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              > */}
                  {GetData1.length ? (
                    <View
                      style={[
                        { width: width * 0.95 },
                        tw`mb-5 mt-2  h-25 justify-start rounded-md`,
                      ]}
                    >
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                      >
                        {GetData1.map((data, index) => (
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('Categoryproducts', {
                                catt: data.selecteduser.company.toLowerCase(),
                              });
                            }}
                          >
                            <View
                              key={index}
                              style={[
                                tw` ml-5  h-25 self-center    rounded-md`,
                                { width: width * 0.2 },
                              ]}
                            >
                              <Image
                                style={[
                                  { width: width * 0.2 },
                                  tw` h-10  rounded-tl-2xl rounded-tr-2xl`,
                                ]}
                                source={{ uri: data.selecteduser.catimg[0] }}
                              />

                              <View
                                style={[
                                  { width: width * 0.2 },
                                  tw`border  rounded-b-md items-center justify-center  border-gray-300 `,
                                ]}
                              >
                                <Text
                                  numberOfLines={2}
                                  style={tw`text-xs m-1 text-center font-bold`}
                                >
                                  {data.selecteduser.company}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <View style={tw`mt-10 mb-5 self-center`}>
                      <Text>No Category Available Right Now</Text>
                    </View>
                  )}

                  {/* </View> */}
                </View>
                {/* Restaurents */}

                <View
                  style={[
                    { width: width * 0.9 },
                    tw`mt-5 self-center flex-row  justify-between items-start  `,
                  ]}
                >
                  <Text style={tw`text-black font-bold text-xl`}>
                    Our Products
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Allproduct');
                    }}
                  >
                    <Text style={tw`text-black text-lg`}>View All</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    { width: width * 0.95 },
                    tw` mb-10 flex-row justify-center h-55  items-start  `,
                  ]}
                >
                  {/* <View style={tw`mb-5 w-90 mt-5 justify-center rounded-md`}> */}
                  {/* <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              > */}
                  {GetData.length ? (
                    <View
                      style={[
                        { width: width * 0.95 },
                        tw`mb-5 mt-2  h-60 justify-start rounded-md`,
                      ]}
                    >
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                      >
                        {GetData.map((data, index) => (
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('Productdetail', {
                                userid: data.selecteduser.id,
                                type: 'Fixed',
                                discount: 0,
                              });
                            }}
                          >
                            <View
                              key={index}
                              style={[
                                tw` ml-5 mr-5 h-55  self-center    rounded-md`,
                                { width: width * 0.45 },
                              ]}
                            >
                              <Image
                                style={[
                                  { width: width * 0.5 },
                                  tw` h-30  rounded-tl-2xl rounded-tr-2xl`,
                                ]}
                                source={{ uri: data.selecteduser.link[0] }}
                              />

                              <View
                                style={[
                                  { width: width * 0.5 },
                                  tw`border  rounded-b-md  h-30 border-gray-300 `,
                                ]}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={tw`text-lg ml-2 font-bold`}
                                >
                                  {data.selecteduser.name.toUpperCase()}
                                </Text>
                                <Text
                                  numberOfLines={2}
                                  style={tw`text-sm ml-2 font-light`}
                                >
                                  {data.selecteduser.plandes}
                                </Text>

                                <View
                                  style={[
                                    { width: width * 0.5 },
                                    tw` h-12 justify-around  flex-row items-center`,
                                  ]}
                                >
                                  <TouchableOpacity>
                                    <View
                                      style={[
                                        tw`w-20 h-8  items-center justify-center rounded-full bg-red-500`,
                                      ]}
                                    >
                                      <Text style={tw`text-white font-bold`}>
                                        Buy Now
                                      </Text>
                                    </View>
                                  </TouchableOpacity>

                                  <Text style={[tw`font-semibold text-lg`]}>
                                    {data.selecteduser.planamount} PKR
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <View style={tw`mt-10 mb-5 self-center`}>
                      <Text>No Products Available Right Now</Text>
                    </View>
                  )}

                  {/* </View> */}
                </View>
              </ScrollView>
            </>
          )
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Text
              style={tw`text-red-500 text-center text-lg font-bold justify-center`}
            >
              Restaurent Is Currently Offline
            </Text>
          </View>
        )}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default Home;
