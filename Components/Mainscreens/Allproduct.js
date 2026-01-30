import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import { AppContext } from '../../AppContext';

const Allproduct = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [entry, setentry] = useState(false);
  const [add, setadd] = useState(0);
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
  const [GetData2, setGetData2] = useState([]);
  const handleAddToCart = (pid, mname, mimg, amount) => {
    // handleAddToCart()
    const product = {
      id: pid,
      name: mname,
      img: mimg,
      amount: amount,
      quantity: add,
    };
    // console.log(product);
    addToCart(product);
    // Alert.alert('Success', 'Product Added In The Cart', [
    //   { text: 'OK', onPress: () => navigation.goBack() },
    // ]);
  };

  const handleDecreaseQuantity = pid => {
    decreaseQuantity(pid);
  };

  const totalAmount = state.cart.reduce((total, item) => {
    return parseInt(total) + parseInt(item.amount) * parseInt(item.quantity);
  }, 0);
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userid').then(id => {
        const coll = collection(db, 'Products');
        const q = query(coll, where('active', '==', true));

        const unSubscribe = onSnapshot(q, snapshot => {
          // Step 1: Firestore se products lao
          const products = snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          }));

          // Step 2: Check karo cart empty hai ya nahi
          if (!state.cart || state.cart.length === 0) {
            // Agar cart empty hai → sab me quantity = 0
            const updatedProducts = products.map(item => ({
              selecteduser: {
                ...item.selecteduser,
                quantity: 0,
              },
            }));

            setGetData2(updatedProducts);
          } else {
            // Agar cart me items hain → match karo IDs aur quantity set karo
            const updatedProducts = products.map(item => {
              // product ka ID lo
              const productId = item.selecteduser.id;

              // cart me search karo same id wala item
              const found = state.cart.find(c => c.id === productId);

              return {
                selecteduser: {
                  ...item.selecteduser,
                  quantity: found ? found.quantity : 0, // match mila to uski quantity else 0
                },
              };
            });

            setGetData2(updatedProducts);
          }
        });

        return () => {
          unSubscribe();
        };
      });
    }, [state.cart]), // 👈 dependency me cart daal do, taake update hote hi reflect ho
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     AsyncStorage.getItem('userid').then(id => {
  //       const coll = collection(db, 'Products');
  //       const q = query(coll, where('active', '==', true));
  //       const unSubscribe = onSnapshot(q, snapshot => {
  //         setGetData2(
  //           snapshot.docs.map(doc => ({
  //             selecteduser: doc.data(),
  //           })),
  //         );
  //       });
  //       return () => {
  //         unSubscribe();
  //       };
  //     });
  //     return () => {};
  //   }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  // );

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'ALL PRODUCTS'}
        left={5}
        onPress={() => navigation.goBack()}
      />

      <View
        style={[
          {
            width: width,
            height: height * 0.85,
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          },
          tw`mt-5 self-center  bg-white `,
        ]}
      >
        <View
          style={[
            { width: width * 0.9 },
            tw`mt-5 self-center flex-row  justify-center  items-center  `,
          ]}
        >
          <Text style={tw`text-black font-bold text-xl`}>ALL PRODUCTS</Text>
        </View>
        <ScrollView>
          <View
            style={[
              { width: width * 0.95 },
              tw` self-center justify-center h-full mt-5  items-center  `,
            ]}
          >
            {/* <View style={tw`mb-5 w-90 mt-5 justify-center rounded-md`}> */}
            {/* <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              > */}
            {GetData2.length ? (
              <View
                style={[
                  { width: width * 0.98 },
                  tw`mb-5 mt-2 h-full  self-center justify-center items-center  rounded-md`,
                ]}
              >
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={false}
                >
                  {/* {GetData2.map((data, index) => ( */}
                  <View
                    style={[
                      { width: width * 0.98 },
                      tw`mb-10 mt-2 h-full  self-center  items-center  rounded-md`,
                    ]}
                  >
                    {/* <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={false}
                > */}
                    {GetData2.map((data, index) => (
                      <TouchableOpacity
                        // disabled={true}
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
                            tw`  h-35  self-center border border-gray-300 shadow-lg bg-white items-center justify-center mt-2 flex-row  rounded-2xl`,
                            { width: width * 0.9 },
                          ]}
                        >
                          <Image
                            style={[
                              { width: width * 0.3 },
                              tw` h-30  rounded-2xl rounded-tr-2xl`,
                            ]}
                            source={{ uri: data.selecteduser.link[0] }}
                          />

                          <View
                            style={[{ width: width * 0.55 }, tw`    h-30  `]}
                          >
                            <Text
                              numberOfLines={2}
                              style={tw`text-base ml-2 font-bold`}
                            >
                              {data.selecteduser.name.toUpperCase()}
                            </Text>
                            {/* <Text
                        numberOfLines={2}
                        style={tw`text-sm ml-2 font-light`}
                      >
                        {data.dis}
                      </Text> */}

                            <Text
                              style={[
                                tw`font-semibold text-orange-400 ml-2 text-lg`,
                              ]}
                            >
                              Pkr{' '}
                              {/* {data.selecteduser.quantity > 0
                                ? data.selecteduser.planamount *
                                  data.selecteduser.quantity
                                : data.selecteduser.planamount} */}
                                {data.selecteduser.planamount}
                            </Text>

                            <View
                              style={[
                                { width: width * 0.5 },
                                tw` h-10 justify-between  self-center flex-row items-center`,
                              ]}
                            >
                              <View
                                style={[
                                  tw`w-30 h-9 flex-row border rounded-full items-center justify-around`,
                                  {
                                    backgroundColor: '#F16767',
                                    borderColor: '#F16767',
                                  },
                                ]}
                              >
                                <TouchableOpacity
                                  // disabled={add === 0 ? true : false}
                                  onPress={() => {
                                    // setpid(GetData1[0]?.selecteduser?.userid);
                                    handleDecreaseQuantity(
                                      data.selecteduser.id,
                                    );
                                    setadd(add - 1);
                                  }}
                                >
                                  <Image
                                    source={require('../../Images/minusb.png')}
                                    style={tw`w-6 h-6 self-center`}
                                  />
                                </TouchableOpacity>

                                <Text
                                  style={tw`text-lg text-white font-semibold`}
                                >
                                  {data.selecteduser.quantity}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    // setpid(GetData1[0]?.selecteduser?.userid)
                                    // setmname(GetData1[0]?.selecteduser?.pname)
                                    // setmimg(GetData1[0]?.selecteduser?.profile)
                                    // setamount(GetData1[0]?.selecteduser?.amount)
                                    setcat(data?.selecteduser?.vendorid);
                                    // setvendoremail(
                                    //   GetData1[0]?.selecteduser?.vendoremail,
                                    // );
                                    handleAddToCart(
                                      data.selecteduser.id,
                                      data.selecteduser.name,
                                      data.selecteduser.link[0],
                                      data.selecteduser.planamount,
                                      // data.selecteduser.quantity,
                                    );
                                    setadd(add + 1);
                                  }}
                                >
                                  <Image
                                    source={require('../../Images/plus.png')}
                                    style={tw`w-6 h-6 self-center`}
                                  />
                                </TouchableOpacity>
                              </View>
                              {/* <Text
                          style={[tw`font-semibold text-orange-400 text-lg`]}
                        >
                          Pkr {data.price}
                        </Text> */}
                              {/* 
                                <TouchableOpacity
                                  onPress={() => {
                                    removeFromCart(data.selecteduser.id);
                                  }}
                                >
                                  <Image
                                    style={[
                                      // { width: width * 0.3 },
                                      tw` h-6 w-6  rounded-2xl rounded-tr-2xl`,
                                    ]}
                                    source={require('../../Images/delete.png')}
                                  />
                                </TouchableOpacity> */}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {/* </ScrollView> */}
                  </View>
                  {/* ))} */}
                </ScrollView>
              </View>
            ) : (
              <View style={tw`mt-40 mb-5 self-center`}>
                <Text style={tw`text-base font-bold`}>
                  No Products Available Right Now
                </Text>
              </View>
            )}

            {/* </View> */}
          </View>
        </ScrollView>

        <View
          style={[
            { width: width * 0.95 },
            tw` h-12 mt-3 mb-3 self-center flex-row justify-between`,
          ]}
        >
          <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
            <View
              style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
            >
              <Image
                style={tw`h-12 w-12 rounded-md`}
                source={require('../../Images/barbecue.png')}
              />
            </View>

            <View>
              <Text
                numberOfLines={1}
                style={tw`ml-2  w-40 font-semibold text-base`}
              >
                Your Total Amount
              </Text>
              {/* <Text style={tw`ml-2 font-semibold text-xs`}>
                  Item Added {add}
                </Text> */}
              <Text style={tw`ml-2 font-semibold text-xs`}>{totalAmount}</Text>
            </View>
          </View>

          <View
            style={[
              { width: width * 0.28 },
              tw`justify-evenly mr-3 items-center flex-row`,
            ]}
          >
            <TouchableOpacity onPress={() => navigation.navigate('Vieworder')}>
              <View
                style={[
                  { backgroundColor: '#F16767' },
                  tw`w-20 h-10 items-center justify-center rounded-full`,
                ]}
              >
                <Text style={tw`font-bold text-white`}>PAY NOW</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Allproduct;
