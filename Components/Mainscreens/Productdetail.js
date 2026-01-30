import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
// import Screensheader from '../Universal/Screensheader';
import tw, { style } from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import { AppContext } from '../../AppContext';
import { FAB } from '@rneui/themed';
import { height, showToast, width } from '../Universal/Input';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
// import Modal from "react-native-modal";
// import { FAB } from '@rneui/themed';

const Productdetail = ({ navigation, route }) => {
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
  const { userid, type, discount } = route.params;
  const [GetData1, setGetdata1] = useState([]);
  const [add, setadd] = useState(0);
  const [loading, setloading] = useState(true);
  const [GetData2, setGetData2] = useState([]);
  const [visible, setVisible] = React.useState(true);
  const [heartfill, setheartfill] = useState(false); // To show/hide the date picker
  const [idd, setidd] = useState('');
  // const [mname, setmname] = React.useState("");
  // const [amount, setamount] = React.useState("");
  // const [mimg, setmimg] = React.useState("");
  // const [pid, setpid] = React.useState("");

  useEffect(() => {
    console.log('data for p', GetData1);

    AsyncStorage.getItem('email').then(email => {
      AsyncStorage.getItem('role').then(role => {
        AsyncStorage.getItem('userid').then(id => {
          setidd(id);
          // console.log('id', id, 'uniqueid', uniqueid);
          getprofile(id);
          toggleFavorite1(id);
          console.log('userid', userid);

          const coll = collection(db, 'Products');

          const q = query(
            coll,
            where('active', '==', true),
            where('id', '==', userid),
          );

          const unSubscribe = onSnapshot(q, snapshot => {
            setGetdata1(
              snapshot.docs.map(doc => ({
                selecteduser: doc.data(),
              })),
            );
            setloading(false);
          });
        });

        return () => {
          unSubscribe();
        };
      });
    });

    const toggleFavorite1 = async id => {
      try {
        const favRef = doc(db, 'sub_favorites', `${id}_${userid}`);
        const favDoc = await getDoc(favRef);

        if (favDoc.exists()) {
          // setfavtext('Remove To Fav');
          setheartfill(true);
          // return false;
        } else {
          // setfavtext('Add To Fav');
          setheartfill(false);
          // return true;
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Check if the product is already in the cart
      const existingProduct = state.cart.find(item => item.id === userid);
      if (existingProduct) {
        console.log('exist q', existingProduct.quantity);
        setadd(existingProduct.quantity);
      }

      // cleanup optional
      return () => {
        setadd(0);
      };
    }, [state.cart, userid]),
  );

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
    Alert.alert('Success', 'Product Added In The Cart', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDecreaseQuantity = pid => {
    decreaseQuantity(pid);
  };

  const getprofile = async uniqueid => {
    const coll = collection(db, 'subs_users');
    const q1 = query(coll, where('uid', '==', uniqueid));

    const unSubscribe = onSnapshot(q1, snapshot => {
      setGetData2(
        snapshot.docs.map(doc => ({
          selecteduser: doc.data(),
        })),
      );

      return () => {
        unSubscribe();
      };
    });
  };

  const toggleFavorite = async itemId => {
    AsyncStorage.getItem('Guest').then(guest => {
      AsyncStorage.getItem('userid').then(id => {
        if (guest == 'No') {
          const favv = async () => {
            try {
              if (!idd) {
                Alert.alert('Please login to add favorites!');
                return;
              }

              const favRef = doc(db, 'sub_favorites', `${idd}_${userid}`);
              const favDoc = await getDoc(favRef);

              if (favDoc.exists()) {
                await deleteDoc(favRef); // Remove from favorites
                // setfavflag(false);
                setheartfill(false);
                // setfavtext('Add To Fav');
                return false;
              } else {
                // setfavflag(true);
                await setDoc(favRef, {
                  vendorname: GetData2[0]?.selecteduser.name,
                  vendorphone: GetData2[0]?.selecteduser.phoneNumber,
                  vendorcity: GetData2[0]?.selecteduser.city,
                  vendoremail: GetData2[0]?.selecteduser.email,
                  usernum: GetData2[0]?.selecteduser.usernum,
                  // categoryl: name,
                  vendorid: GetData2[0]?.selecteduser.uid,
                  // linktype: linktype,
                  postid: userid,
                  link: [GetData1[0]?.selecteduser?.link[0]],
                  name: GetData1[0]?.selecteduser?.name,
                  dis: GetData1[0]?.selecteduser?.plandes,
                  price: GetData1[0]?.selecteduser?.planamount,
                  userId: id,
                  itemId: userid,
                  createdAt: new Date(),
                });
                // setfavflag(false);
                setheartfill(true);
                // setfavtext('Remove To Fav');
                return true;
              }
            } catch (error) {
              setfavflag(false);
              console.error('Error toggling favorite:', error);
            }
          };
          favv();
        } else {
          console.log('no login');

          showToast(
            'error',
            'Please Logout As Guest',
            'And Please Login As User',
            true,
            5000,
          );
        }
      });
    });
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator size={'large'} color={'#FEF0F0'} />
      ) : (
        <>
          {GetData1.length ? (
            <View style={[tw`flex-1`, { backgroundColor: '#FEF0F0' }]}>
              {/* <Screensheader name={"Products"} left={25}
                onPress={() => {
                    navigation.goBack()
                }}
            />
            <EvenOddColumns navigation={navigation} data={categories} /> */}
              <ScrollView>
                <View
                  style={[
                    tw` h-100 w-full self-center items-center justify-center`,
                    { backgroundColor: '#FEF0F0' },
                  ]}
                >
                  <Image
                    style={tw`h-90 w-80 rounded-md`}
                    source={{ uri: GetData1[0]?.selecteduser?.link[0] }}
                  />
                </View>

                <View
                  style={[
                    {
                      width: width,
                      // height: height * 0.43,
                      //   alignSelf : '',
                      borderTopLeftRadius: 60,
                      borderTopRightRadius: 60,
                    },
                    tw`mt-5 self-center flex-1 flex-col  bg-white `,
                  ]}
                >
                  <View style={tw`w-80 mt-10 self-center `}>
                    <View
                      style={tw`w-78 h-10 justify-between flex-row items-center `}
                    >
                      <View
                        style={tw`flex-row justify-between w-23 items-center`}
                      >
                        <Text style={tw`text-lg font-normal`}>Detail's</Text>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              toggleFavorite(GetData2[0]?.selecteduser?.uid);
                            }}
                          >
                            <View style={[tw` `]}>
                              <>
                                {heartfill ? (
                                  <Image
                                    style={tw`h-7 w-7 `}
                                    source={require('../../Images/heartfill.png')}
                                  />
                                ) : (
                                  <Image
                                    style={tw`h-7 w-7 `}
                                    source={require('../../Images/heart.png')}
                                  />
                                )}
                              </>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={[
                          tw`w-30 h-8   flex-row border self-center rounded-full items-center justify-around`,
                          {
                            backgroundColor: '#F16767',
                            borderColor: '#F16767',
                          },
                        ]}
                      >
                        <TouchableOpacity
                          disabled={add === 0 ? true : false}
                          onPress={() => {
                            // setpid(GetData1[0]?.selecteduser?.userid);
                            handleDecreaseQuantity(
                              GetData1[0]?.selecteduser?.id,
                            );
                            setadd(add - 1);
                          }}
                        >
                          <Image
                            source={require('../../Images/minusb.png')}
                            style={tw`w-6 h-6 self-center`}
                          />
                        </TouchableOpacity>

                        <Text style={tw`text-2xl text-white font-semibold`}>
                          {add}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            // setpid(GetData1[0]?.selecteduser?.userid)
                            // setmname(GetData1[0]?.selecteduser?.pname)
                            // setmimg(GetData1[0]?.selecteduser?.profile)
                            // setamount(GetData1[0]?.selecteduser?.amount)
                            setcat(GetData1[0]?.selecteduser?.vendorid);
                            // setvendoremail(GetData1[0]?.selecteduser?.vendoremail);
                            handleAddToCart(
                              GetData1[0]?.selecteduser?.id,
                              GetData1[0]?.selecteduser?.name,
                              GetData1[0]?.selecteduser?.link[0],
                              type === 'Fixed'
                                ? parseInt(
                                    GetData1[0]?.selecteduser?.planamount,
                                  ) - parseInt(discount)
                                : parseInt(
                                    GetData1[0]?.selecteduser?.planamount,
                                  ) -
                                    (parseInt(
                                      GetData1[0]?.selecteduser?.planamount,
                                    ) /
                                      100 +
                                      parseInt(discount)),
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
                    </View>

                    <View style={tw`border-b-2 border-black`} />

                    <Text numberOfLines={1} style={tw`text-xl font-bold mt-2`}>
                      {GetData1[0]?.selecteduser?.name.toUpperCase()}
                    </Text>

                    <View
                      style={tw`flex-row w-80 mt-1 justify-start items-start`}
                    >
                      <Text style={tw`text-base font-light`}>
                        {GetData1[0]?.selecteduser?.plandes.toUpperCase()}{' '}
                      </Text>
                    </View>

                    {/* <View style={tw`flex-row w-80 mt-1 justify-start items-start`}>
                  <Text  style={tw`text-base font-light`}>
                    {GetData1[0]?.selecteduser?.plandes.toUpperCase()}{' '}
                  </Text>
                </View> */}

                    <Text style={tw`text-lg mb-3 font-normal`}>
                      {discount > 0 && 'DISCOUNT PRICE'}{' '}
                      {type === 'Fixed'
                        ? parseInt(GetData1[0]?.selecteduser?.planamount) -
                          parseInt(discount)
                        : parseInt(GetData1[0]?.selecteduser?.planamount) -
                          (parseInt(GetData1[0]?.selecteduser?.planamount) /
                            100 +
                            parseInt(discount))}
                      /= PKR
                    </Text>
                  </View>

                  {/* <View
                style={[
                  tw`w-45 h-15 mb-10  flex-row border self-center rounded-full items-center justify-around`,
                  {
                    backgroundColor: '#F16767',
                    borderColor: '#F16767',
                  },
                ]}
              >
                <TouchableOpacity
                  disabled={add === 0 ? true : false}
                  onPress={() => {
                    // setpid(GetData1[0]?.selecteduser?.userid);
                    handleDecreaseQuantity(GetData1[0]?.selecteduser?.id);
                    setadd(add - 1);
                  }}
                >
                  <Image
                    source={require('../../Images/minusb.png')}
                    style={tw`w-10 h-10 self-center`}
                  />
                </TouchableOpacity>

                <Text style={tw`text-2xl text-white font-semibold`}>{add}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // setpid(GetData1[0]?.selecteduser?.userid)
                    // setmname(GetData1[0]?.selecteduser?.pname)
                    // setmimg(GetData1[0]?.selecteduser?.profile)
                    // setamount(GetData1[0]?.selecteduser?.amount)
                    setcat(GetData1[0]?.selecteduser?.vendorid);
                    // setvendoremail(GetData1[0]?.selecteduser?.vendoremail);
                    handleAddToCart(
                      GetData1[0]?.selecteduser?.id,
                      GetData1[0]?.selecteduser?.name,
                      GetData1[0]?.selecteduser?.link[0],
                      GetData1[0]?.selecteduser?.planamount,
                    );
                    setadd(add + 1);
                  }}
                >
                  <Image
                    source={require('../../Images/plus.png')}
                    style={tw`w-10 h-10 self-center`}
                  />
                </TouchableOpacity>
              </View> */}

                  <TouchableOpacity
                    onPress={() => {
                      setcat(GetData1[0]?.selecteduser?.vendorid);
                      // setvendoremail(GetData1[0]?.selecteduser?.vendoremail);
                      handleAddToCart(
                        GetData1[0]?.selecteduser?.id,
                        GetData1[0]?.selecteduser?.name,
                        GetData1[0]?.selecteduser?.link[0],
                        type === 'Fixed'
                          ? parseInt(GetData1[0]?.selecteduser?.planamount) -
                              parseInt(discount)
                          : parseInt(GetData1[0]?.selecteduser?.planamount) -
                              (parseInt(GetData1[0]?.selecteduser?.planamount) /
                                100 +
                                parseInt(discount)),
                      );
                      setadd(add + 1);
                    }}
                  >
                    <View
                      style={[
                        { backgroundColor: '#F16767' },
                        tw`w-50 h-10 items-center flex-row justify-around self-center rounded-full mb-5`,
                      ]}
                    >
                      <Text style={tw`font-bold text-white text-base`}>
                        ADD TO CART
                      </Text>
                      <Image
                        style={tw`h-7 w-7`}
                        source={require('../../Images/trolley.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View
                style={[
                  { width: width * 0.95 },
                  tw` h-12 mt-3 mb-3 self-center flex-row justify-between`,
                ]}
              >
                <View
                  style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
                >
                  <View
                    style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                  >
                    <Image
                      style={tw`h-12 w-12 rounded-md`}
                      source={
                        GetData1[0]?.selecteduser?.link[0] !== null
                          ? { uri: GetData1[0]?.selecteduser?.link[0] }
                          : require('../../Images/userc.png')
                      }
                    />
                  </View>

                  <View>
                    <Text
                      numberOfLines={1}
                      style={tw`ml-2  w-40 font-semibold text-base`}
                    >
                      {GetData1[0]?.selecteduser?.name.toUpperCase()}
                    </Text>
                    {/* <Text style={tw`ml-2 font-semibold text-xs`}>
                  Item Added {add}
                </Text> */}
                    <Text style={tw`ml-2 font-semibold text-xs`}>
                      Price{' '}
                      {parseFloat(
                        add * GetData1[0]?.selecteduser?.planamount,
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>

             

                {add > 0 && (
                  <View
                    style={[
                      { width: width * 0.28 },
                      tw`justify-evenly mr-3 items-center flex-row`,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Vieworder')}
                    >
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
                )}
              </View>

              {/* <FAB
              onPress={() => {
                navigation.navigate('Vieworder');
              }}
              style={tw`justify-end  w-80 -top-10`}
              visible={visible}
              icon={{
                name: 'cart-plus',
                size: 25,
                color: 'white',
                type: 'font-awesome',
              }}
              color={state.cart ? '#000000' : 'white'}
            /> */}
            </View>
          ) : (
            <View style={tw`flex-1 items-center justify-center`}>
              <Image
                resizeMode="contain"
                source={require('../../Images/sorry.png')}
                style={tw`h-40 w-40 items-center justify-center self-center`}
              />
              <Text
                style={tw`text-center mt-5 text-lg font-bold text-red-500`}
              >{`The Product Is\nNot Available Right Now`}</Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <View
                  style={[
                    { backgroundColor: '#F16767' },
                    tw`w-60 h-12 items-center justify-center rounded-3xl mt-5`,
                  ]}
                >
                  <Text
                    style={tw`text-center text-lg font-bold text-white`}
                  >{`Go Back`}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      <Toast />
    </>
  );
};

export default Productdetail;

const EvenOddColumns = ({ data, navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = React.useState(true);
  const [mname, setmname] = React.useState('');
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // Filter even and odd elements

  const Carsurl = [
    'https://t3.ftcdn.net/jpg/02/28/76/20/360_F_228762020_md5J7oyDKx8ydqrGyN4Pe173n9j51dQe.jpg',
    'https://media.istockphoto.com/id/1151784210/photo/ripe-rice-field-and-sky-background-at-sunset.jpg?s=612x612&w=0&k=20&c=DZz4wxIbPXnMhmoTsEV06uYKup9MEZTtRFe2XkDb0mY=',
    'https://images.pexels.com/photos/1509607/pexels-photo-1509607.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://st.depositphotos.com/1469828/1559/i/450/depositphotos_15595841-stock-photo-hand-with-rice-field.jpg',
    'https://media.istockphoto.com/id/165646486/photo/rice-harvest.jpg?s=612x612&w=0&k=20&c=CMdTN8zAKiOzBVacLL9SDLv0DJVylKgjwoNDZ8Byy2o=',
  ];

  const evenElements = data.filter((_, index) => index % 2 === 0);
  const oddElements = data.filter((_, index) => index % 2 !== 0);

  // Combine even and odd elements into one array of objects with type 'even' or 'odd'
  const combinedData = evenElements.map((item, index) => ({
    even: item,
    odd: oddElements[index],
  }));

  // Render an item
  const renderItem = ({ item, index }) => (
    <>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={tw`h-45 flex-row justify-around mt-5`}>
          <View
            style={tw`h-40 w-30 items-center justify-around rounded-2xl bg-white shadow-lg`}
          >
            <View style={tw`flex-row w-25 justify-between`}>
              {/* <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Addproduct')

                                }
                                }
                            >
                                <Image
                                    source={require('../../Images/edit.png')}
                                    style={tw`h-5 w-5`}
                                />
                            </TouchableOpacity> */}
              {/* <TouchableOpacity>
                                <Image
                                    source={require('../../Images/delete.png')}
                                    style={tw`h-5 w-5`}
                                />
                            </TouchableOpacity> */}
            </View>

            <Image
              style={tw`h-20 w-20 rounded-full`}
              source={{
                uri: item.even.url,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                margin: 5,
              }}
            >
              {item.even.name.toUpperCase()}
            </Text>
          </View>

          {item.odd && (
            <View
              style={tw`h-40 w-30 items-center justify-around rounded-2xl bg-white shadow-lg`}
            >
              <View style={tw`flex-row w-25 justify-between`}>
                {/* <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Addproduct')

                                    }
                                    }
                                >
                                    <Image
                                        source={require('../../Images/edit.png')}
                                        style={tw`h-5 w-5`}
                                    />
                                </TouchableOpacity> */}
                {/* <TouchableOpacity>
                                    <Image
                                        source={require('../../Images/delete.png')}
                                        style={tw`h-5 w-5`}
                                    />
                                </TouchableOpacity> */}
              </View>

              <Image
                style={tw`h-20 w-20 rounded-full`}
                source={{
                  uri: item.odd.url,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  margin: 5,
                }}
              >
                {item.odd.name.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
      />

      {/* <FAB
                onPress={() => {
                    navigation.navigate('Addproduct')

                }
                }
                style={tw`justify-end w-80 -top-10`}
                visible={visible}
                icon={{ name: 'add', color: 'white' }}
                color="blue"
            /> */}

      {/* <Modal

                style={tw`w-80 self-center rounded-t-lg`}
                onDismiss={toggleModal}
                animationIn={'bounceInUp'}
                isVisible={isModalVisible}>
                <View style={{ borderRadius: 50, backgroundColor: 'white' }}>
                    <View style={[{ height: 300, backgroundColor: 'white' }, tw`rounded-xl`]}>

                        <TouchableOpacity
                            onPress={() => {
                                toggleModal()
                                // navigation.goBack()
                            }}
                        >
                            <View
                                style={tw`items-end self-center justify-end w-310px`}>
                                <Image 
                                    style={{ height: 30, width: 30 }}
                                    source={require('../../Images/close.png')}
                                />
                            </View>
                        </TouchableOpacity>

                        <View style={tw`mt-10 flex-col  h-30 justify-around`}>

                            <View style={tw`self-center`} >
                                <Text style={tw`text-center font-normal text-lg`}>
                                    {mname}
                                </Text>
                            </View>

                            <TextInput
                                style={tw`pl-3 h-10 w-60 mt-10 self-center rounded-xl border`}
                                placeholder='Enter Category'
                            />


                            <TouchableOpacity>
                                <View style={[{ marginTop: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: 40, width: 200 }, tw`bg-blue-500 rounded-2xl`]}>
                                    <Text style={{ textAlign: 'center', color: 'white' }}>Update Category</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
            </Modal> */}
    </View>
  );
};
