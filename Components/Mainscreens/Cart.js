import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import { AppContext } from '../../AppContext';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';

const Cart = ({ navigation }) => {
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [entry, setentry] = useState(false);
  const [GetData2, setGetData2] = useState([]);
  const [add, setadd] = useState(0);

  // useEffect(() => {
  //   // Check if the product is already in the cart
  //   const existingProduct = state.cart.find(item => item.id === userid);
  //   if (existingProduct) {
  //     console.log('exist q', existingProduct.quantity);

  //     setadd(existingProduct.quantity);
  //   }
  // }, [state.cart]);

  // const watchInactiveProducts = (db, state, setState) => {

  // };

  useEffect(() => {
    // watchInactiveProducts(db, state,setGetData2);
    // 🔹 Step 1: Query to get inactive products in real-time
    if (state) {
    const q = query(collection(db, 'Products'), where('active', '==', false));

    // 🔹 Step 2: Setup real-time listener
    onSnapshot(q, snapshot => {
      // Get all inactive product IDs
      const inactiveIds = snapshot.docs.map(doc => doc.id);

      console.log('🛑 Inactive products:', inactiveIds);
      console.log('🛑 Cart products:', state.cart);

      // 🔹 Step 3: Filter cart items that are not inactive
      const updatedCart = state.cart.filter(
        item => !inactiveIds.includes(item.id),
      );

      console.log('🛒 Updated cart:', updatedCart);

      // 🔹 Step 4: Update state
      setGetData2(updatedCart);
    });

    // 🔹 Step 5: Return unsubscribe for cleanup
    // return unsubscribe;
    }
    // return () => unsubscribe();
  }, [state.cart]);

  const handleAddToCart = (pid, mname, mimg, amount, quantity) => {
    // handleAddToCart()
    const product = {
      id: pid,
      name: mname,
      img: mimg,
      amount: amount,
      quantity: quantity,
    };
    // console.log(product);
    addToCart(product);
  };

  const handleDecreaseQuantity = pid => {
    console.log("decrease chala");
    
    decreaseQuantity(pid);
  };

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'MY CART'}
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
        {GetData2.length ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Vieworder');
            }}
          >
            <View
              style={[
                { width: width * 0.7, backgroundColor: '#F16767' },
                tw`mt-5 self-center h-10 rounded-full flex-row  justify-around items-center  `,
              ]}
            >
              <Text style={tw`text-white font-bold text-base`}>
                Complete Your Order
              </Text>
              <View
                style={tw` h-8  bg-white items-center justify-center rounded-full w-8  `}
              >
                <Image
                  style={tw`h-8 w-8 `}
                  source={require('../../Images/rightbarrow.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        <ScrollView>
          {/* <View
            style={[
              { width: width * 0.95 },
              tw`  self-center justify-center h-full  items-center  `,
            ]}
          > */}
          {/* <View style={tw`mb-5 w-90 mt-5 justify-center rounded-md`}> */}
          {/* <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              > */}
          {GetData2.length ? (
            <View
              style={[
                { width: width * 0.98 },
                tw`mb-20 mt-2 h-full  self-center  items-center  rounded-md`,
              ]}
            >
              {/* <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={false}
                > */}
              {GetData2.map((data, index) => (
                <TouchableOpacity
                  disabled={true}
                  onPress={() => {
                    // navigations.navigate('Ordertech', {
                    //   catl: data.selecteduser.ownemail,
                    //   mid: data.selecteduser.userid,
                    //   status: true,
                    // });
                  }}
                >
                  <View
                    key={index}
                    style={[
                      tw`  h-30  self-center border border-gray-300 shadow-lg bg-white items-center justify-center mt-2 flex-row  rounded-2xl`,
                      { width: width * 0.9 },
                    ]}
                  >
                    <Image
                      style={[
                        { width: width * 0.3 },
                        tw` h-25  rounded-2xl rounded-tr-2xl`,
                      ]}
                      source={{ uri: data.img }}
                    />

                    <View style={[{ width: width * 0.55 }, tw`    h-25  `]}>
                      <Text
                        numberOfLines={1}
                        style={tw`text-lg ml-2 font-bold`}
                      >
                        {data.name.toUpperCase()}
                      </Text>
                      {/* <Text
                        numberOfLines={2}
                        style={tw`text-sm ml-2 font-light`}
                      >
                        {data.dis}
                      </Text> */}

                      <Text
                        style={[tw`font-semibold text-orange-400 ml-2 text-lg`]}
                      >
                        Pkr {data.amount * data.quantity}
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
                              handleDecreaseQuantity(data.id);
                              // setadd(add - 1);
                            }}
                          >
                            <Image
                              source={require('../../Images/minusb.png')}
                              style={tw`w-6 h-6 self-center`}
                            />
                          </TouchableOpacity>

                          <Text style={tw`text-lg text-white font-semibold`}>
                            {data.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              // setpid(GetData1[0]?.selecteduser?.userid)
                              // setmname(GetData1[0]?.selecteduser?.pname)
                              // setmimg(GetData1[0]?.selecteduser?.profile)
                              // setamount(GetData1[0]?.selecteduser?.amount)
                              setcat(cat);
                              // setvendoremail(
                              //   GetData1[0]?.selecteduser?.vendoremail,
                              // );
                              handleAddToCart(
                                data.id,
                                data.name,
                                data.img,
                                data.amount,
                                data.quantity,
                              );
                              // setadd(add + 1);
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

                        <TouchableOpacity
                          onPress={() => {
                            removeFromCart(data.id);
                          }}
                        >
                          <Image
                            style={[
                              // { width: width * 0.3 },
                              tw` h-6 w-6  rounded-2xl rounded-tr-2xl`,
                            ]}
                            source={require('../../Images/delete.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {/* </ScrollView> */}
            </View>
          ) : (
            <View style={tw`mt-10 mb-5 self-center`}>
              <Text>No Products Available Right Now</Text>
            </View>
          )}

          {/* </View> */}
          {/* </View> */}
        </ScrollView>
      </View>
    </View>
  );
};

export default Cart;
