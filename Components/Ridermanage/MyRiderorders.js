import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  TextInput,
} from 'react-native';
import { AppContext } from '../../AppContext';
import tw from 'twrnc';
import { Buttonnormal } from '../Universal/Buttons';
import { showToast, width } from '../Universal/Input';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';
import Screensheader from '../Universal/Screensheader';
import { Dropdown } from 'react-native-element-dropdown';

const MyRiderorders = ({ navigation, route }) => {
  const { customeremail, myorderid, timeAgo } = route.params;
  const [imageUri, setImageUri] = useState(null);
  const [simguri, setsimguri] = useState(null);
  const [imgname, setimgname] = useState('');
  const [orderid, setorderid] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(true);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [gimg, setgimg] = useState('');
  const [rnum, setrnum] = useState(Math.floor(Math.random() * 1000000));
  const [shareflag, setshareflag] = useState(false);
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [user, setuser] = useState(null);
  const [value, setValue] = useState();
  const [label, setlabel] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const {
    state,
    removeFromCart,
    cat,
    clearCart,
    bankacc,
    banktitle,
    bankname,
  } = useContext(AppContext);
  const useridd = uuid.v4();
  const date = new Date();
  const monthdate =
    date.getMonth() + 1 + ':' + date.getDate() + ':' + date.getFullYear();
  const [GetData, setGetData] = useState([]);
  // const [GetData2, setGetData2] = useState([]);

  //   const {userid} = route.params;
  const [GetData1, setGetdata1] = useState([]);
  const [GetData3, setGetData3] = useState([]);

  const [GetData2, setGetData2] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);

  //   const {userid} = route.params;

  useEffect(() => {
    const func = async () => {
      try {
        // Step 1: Get order ID (tum jahan se le rahe ho, wahan se le lo)
        // const orderId = "your-order-id"; // <- yahan apna dynamic orderId daalna
        const docRef = doc(db, 'Orders', myorderid);

        // Step 2: Listen to changes in that specific order document
        const unSubscribe = onSnapshot(docRef, async snapshot => {
          if (snapshot.exists()) {
            const orderData = snapshot.data();
            const orderItems = orderData.orders || []; // array of items
            const ordercharges = orderData.tax || []; // array of items

            // Step 3: Calculate base total
            const totalAmount = orderItems.reduce((total, item) => {
              return (
                parseInt(total) +
                parseInt(item.amount) * parseInt(item.quantity)
              );
            }, 0);

            console.log('Base Total for order review:', totalAmount);

            // Step 4: Fetch charges
            // const coll = collection(db, 'Charges');
            // const chargesSnapshot = await getDocs(coll);
            // const charges = chargesSnapshot.docs.map(doc => doc.data());

            // Step 5: Calculate final amount including charges
            let finalAmount = totalAmount;
            console.log('my tax charges', ordercharges);

            if (ordercharges.length) {
              ordercharges.forEach(charge => {
                if (charge.type_l === 'Fixed') {
                  finalAmount += parseInt(charge.fuel_charges);
                } else if (charge.type_l === 'Percent') {
                  const percentValue =
                    (parseInt(charge.fuel_charges) / 100) * totalAmount;
                  finalAmount += percentValue;
                }
              });
            }

            console.log(
              'Final Total for order review (with Charges):',
              finalAmount,
            );
            setFinalAmount(finalAmount);
            setGetData2(charges);
          } else {
            console.log('No such order found!');
          }
        });

        return () => unSubscribe();
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    func();
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        setuser(email);
      });
      return () => {};
    }, []),
  );

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(coll, where('id', '==', myorderid));

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('userid').then(id => {
      const coll = collection(db, 'subs_users');
      const q = query(coll, where('email', '==', customeremail));

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetdata1(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
    });
  }, []);

  //   useEffect(() => {
  //     console.log('data for p', GetData1);

  //     AsyncStorage.getItem('email').then(email => {
  //       AsyncStorage.getItem('role').then(role => {
  //         console.log('userid', userid);

  //         const coll = collection(db, 'Product');
  //         const q = query(coll, where('userid', '==', userid));

  //         const unSubscribe = onSnapshot(q, snapshot => {
  //           setGetdata1(
  //             snapshot.docs.map(doc => ({
  //               selecteduser: doc.data(),
  //             })),
  //           );
  //           setloading(false);
  //         });
  //       });

  //       return () => {
  //         unSubscribe();
  //       };
  //     });
  //   }, []);

  const totalAmount = state.cart.reduce((total, item) => {
    return parseInt(total) + parseInt(item.amount) * parseInt(item.quantity);
  }, 0);

  const uploadfile = async () => {
    if (!imgname || !simguri) {
      showToast('error', 'Error', 'Please Select The Image First', true, 3000);
    } else {
      try {
        setloading(true);

        const reference = storage().ref(`allfiles/${imgname}`);
        await reference.putFile(simguri);
        const url = await storage().ref(`allfiles/${imgname}`).getDownloadURL();
        console.log('your file is locating :', url);
        Uploadata(url);
      } catch (error) {
        setloading(false);
        console.log('Error :', error);
      }
    }
  };

  const Uploadata = async () => {
    if (toggleCheckBox1) {
      if (!bankacc || !bankname || !banktitle) {
        showToast(
          'error',
          'Error',
          'Please Select The Account First',
          true,
          5000,
        );
      } else {
        if (!orderid) {
          showToast(
            'error',
            'Error',
            'Please Fill The Transection Id',
            true,
            5000,
          );
        } else {
          setloading1(true);
          // showToast('info', 'Info', 'Congo for online', true, 5000);
          setDoc(doc(db, 'Orders', useridd), {
            customername: GetData[0].selecteduser.fullname,
            customerphone: GetData[0].selecteduser.phone,
            customeraddress: GetData[0].selecteduser.address,
            customerarea: GetData[0].selecteduser.area,
            customerprovince: GetData[0].selecteduser.provincel,
            customeremail: GetData[0].selecteduser.email,
            vendorname: GetData1[0].selecteduser.fullname,
            vendorphone: GetData1[0].selecteduser.phone,
            vendoraddress: GetData1[0].selecteduser.address,
            vendorarea: GetData1[0].selecteduser.area,
            vendorprovince: GetData1[0].selecteduser.provincel,
            vendoremail: GetData1[0].selecteduser.email,
            vendorcity: GetData1[0].selecteduser.city,
            vendordc: GetData1[0].selecteduser.dc,
            orderstatus: 'pending',
            ordertype: 'food',
            ridername: '',
            riderid: '',
            rideremail: '',
            ridercity: '',
            riderorderstatus: 'pending',
            ridercall: 'offline',
            paymentmode: 'online',
            transectionid: orderid,
            accname: banktitle,
            bankname: bankname,
            banktitle: banktitle,
            ordernum: rnum,
            id: useridd,
            email: user,
            orders: state.cart,
            date: monthdate,
            month: date.getMonth() + 1,
            singledate: date.getDate(),
            year: date.getFullYear(),
            totalbill:
              parseInt(totalAmount) + parseInt(GetData1[0]?.selecteduser?.dc),
            riderlimit: 'true',
          })
            .then(() => {
              // console.log('done');
              setloading1(false);
              clearCart();
              Alert.alert('Congratulation', 'Order Has Been Placed', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
              // getinfo();
            })
            .catch(error => {
              setloading1(false);
              Alert.alert('this :', error.message);
            });
        }
      }
    } else {
      if (toggleCheckBox) {
        // showToast('info', 'Info', 'Congo for cod', true, 5000);
        setloading1(true);
        setDoc(doc(db, 'Orders', useridd), {
          customername: GetData[0].selecteduser.name,
          customerphone: GetData[0].selecteduser.phoneNumber,
          customeraddress: GetData[0].selecteduser.address,
          // customerarea: GetData[0].selecteduser.area,
          // customerprovince: GetData[0].selecteduser.provincel,
          customeremail: GetData[0].selecteduser.email,
          vendorname: GetData1[0].selecteduser.name,
          vendorphone: GetData1[0].selecteduser.phoneNumber,
          vendoraddress: GetData1[0].selecteduser.address,
          // vendorarea: GetData1[0].selecteduser.area,
          // vendorprovince: GetData1[0].selecteduser.provincel,
          vendoremail: GetData1[0].selecteduser.email,
          vendorcity: GetData1[0].selecteduser.city,
          // vendordc: GetData1[0].selecteduser.dc,
          orderstatus: 'pending',
          ordertype: 'food',
          ridername: '',
          riderid: '',
          ridernum: '',
          rideremail: '',
          ridercity: '',
          riderorderstatus: 'pending',
          ridercall: 'offline',
          paymentmode: 'COD',
          transectionid: '',
          accname: '',
          bankname: '',
          banktitle: '',
          ordernum: rnum,
          id: useridd,
          email: user,
          orders: state.cart,
          date: monthdate,
          month: date.getMonth() + 1,
          singledate: date.getDate(),
          year: date.getFullYear(),
          totalbill: parseInt(totalAmount),
          riderlimit: 'true',
        })
          .then(() => {
            setloading1(false);
            clearCart();
            Alert.alert('Congratulation', 'Order Has Been Placed', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
            // getinfo();
          })
          .catch(error => {
            setloading1(false);
            Alert.alert('this :', error.message);
          });
      } else {
        setloading1(false);
        showToast(
          'error',
          'Error',
          'Please Select Any Payment Method',
          true,
          5000,
        );
      }
      // showToast("info","Info","Congo",true,5000)
    }
  };

  const sendFCMNotification = async (fcmToken, accessToken) => {
    try {
      const response = await fetch(
        'https://fcm.googleapis.com/v1/projects/fasthomedelivery-9c8e4/messages:send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`, // 🔁 Dynamic Bearer Token
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              token: fcmToken, // 🔁 Dynamic FCM device token
              data: {},
              notification: {
                title: 'New Order Has Been Arrived',
                body: 'Click And Check The Detail',
              },
            },
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log('done');
        clearCart();
        setloading1(false);
        Alert.alert('Congratulation', 'Order Has Been Placed', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        console.log('✅ FCM Message Sent Successfully!');
        console.log('👉 Result Token/ID:', result);
      } else {
        setloading1(false);
        showToast(
          'error',
          'Order Has Been Placed',
          'But Notifcation Not Send Due To Error',
          true,
          4000,
        );
        console.warn('⚠️ FCM Sending Failed:', result);
      }
    } catch (error) {
      setloading1(false);
      showToast(
        'error',
        'Order Has Been Placed',
        'But Notifcation Not Send Due To Error',
        true,
        4000,
      );
      console.error('❌ Error sending FCM message:', error);
    }
  };

  const getinfo = async () => {
    try {
      const fcmResponse = await fetch(
        'https://firebasenotificationtoken-vxt6.vercel.app/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: GetData1[0]?.selecteduser.fcmtoken,
            title: 'FCM Message',
            body: 'This is an FCM notification message!',
          }),
        },
      );

      const fcmResult = await fcmResponse.json();

      if (fcmResponse.ok || GetData1[0]?.selecteduser?.fcmtoken) {
        setloading1(false);
        sendFCMNotification(
          GetData1[0]?.selecteduser.fcmtoken,
          fcmResult.result,
        );
        console.log('✅ FCM Notification Sent, result:', fcmResult.result);
      } else {
        setloading1(false);
        showToast(
          'error',
          'Order Has Been Placed',
          'But Notifcation Not Send Due To Error',
          true,
          4000,
        );
        console.warn('⚠️ FCM Sending Failed:', fcmResult);
      }
    } catch (error) {
      setloading1(false);
      showToast(
        'error',
        'Order Has Been Placed',
        'But Notifcation Not Send Due To Error',
        true,
        4000,
      );
      console.error('Catch Error:', error);
    }
  };

  useEffect(() => {
    const usersColl = collection(db, 'subs_users');

    // Query: sirf Rider users
    const q = query(usersColl, where('role', '==', 'Rider'));

    const unSubscribe = onSnapshot(q, snapshot => {
      const riders = snapshot.docs.map(doc => ({
        label: `${doc.data().name}\n${String(doc.data().usernum)}`, // user name + usernum as label
        value: String(doc.data().usernum), // uid as value
        // usernum: String(doc.data().usernum), // extra field separately
      }));

      setGetData3(riders); // tumhari state me set kar do
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const Reject = async () => {
    setloading1(true);
    updateDoc(doc(db, 'Orders', myorderid), {
      orderstatus: 'reject',
    })
      .then(() => {
        setloading1(false);
        navigation.goBack();
      })
      .catch(error => {
        setloading1(false);
        Alert.alert('Error:', error.message);
      });
  };

  const Dispatch = async () => {
    try {
      if (!label || !value) {
        Alert.alert('Validation Error', 'Please Select a Rider First!');
        return;
      }

      setloading1(true);

      // usernum jo tum pass kar rahe ho
      // const usernum = '03001234567'; // yaha pe tum selected num use karo

      // Rider find karo usernum se
      console.log('Rider number value', value);

      const q = query(
        collection(db, 'subs_users'),
        where('usernum', '==', parseInt(value)),
      );
      const querySnapshot = await getDocs(q);
      console.log('mu rider data', querySnapshot.size);

      if (!querySnapshot.empty) {
        const riderDoc = querySnapshot.docs[0].data(); // ek hi rider milega

        // Ab Orders me update karo
        await updateDoc(doc(db, 'Orders', myorderid), {
          riderorderstatus: 'dispatch',
          ridercall: 'conform',
          ridercity: riderDoc.city,
          rideremail: riderDoc.email,
          ridername: riderDoc.name,
          ridernum: riderDoc.phoneNumber,
          riderid: riderDoc.uid,
          orderstatus: 'dispatch',
        });

        setloading1(false);
        navigation.goBack();
      } else {
        setloading1(false);
        Alert.alert('Error', 'Rider not found with this number!');
      }
    } catch (error) {
      setloading1(false);
      Alert.alert('Error:', error.message);
    }
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: '#ffffff' }]}>
      <Screensheader
        name={'VIEW ORDER'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View
          style={[
            { width: width * 0.92 },
            tw`  h-40 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
          ]}
        >
          <View style={tw`flex-row justify-between`}>
            <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
              <View
                style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
              >
                <Image
                  style={tw`h-8 w-8`}
                  source={require('../../Images/choices.png')}
                />
              </View>

              <View>
                <Text style={tw`ml-2 font-semibold text-base`}>Order Num</Text>
                <Text style={tw`ml-2 font-semibold text-xs`}>
                  {GetData[0]?.selecteduser.ordernum}
                </Text>
              </View>
            </View>

            <View style={tw`items-center right-2`}>
              <Text style={tw`mr-2 font-bold`}>{timeAgo}</Text>
              <Text style={tw`font-light`}>
                {GetData[0]?.selecteduser.date}
              </Text>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-75 self-center`} />

          <View style={tw`flex-row justify-between`}>
            <View style={[{ width: width * 0.3 }, tw` flex-row items-center`]}>
              <View>
                <Text style={tw`ml-5 font-semibold text-base`}>Payment</Text>
                <Text style={tw`ml-5 font-semibold text-green-500 text-base`}>
                  {'COD'}
                </Text>
              </View>
            </View>

            <View
              style={[
                { width: width * 0.3 },
                tw` flex-row border-l items-center`,
              ]}
            >
              <View>
                <Text style={tw`ml-2 font-semibold text-base`}>D-Charges</Text>
                <Text style={tw`ml-2 font-semibold text-xs`}>
                  {GetData[0]?.selecteduser.vendordc}
                </Text>
              </View>
            </View>

            <View
              style={[
                { width: width * 0.3 },
                tw` flex-row border-l items-center`,
              ]}
            >
              <View>
                <Text style={tw`ml-2 font-semibold text-base`}>Sub Total</Text>
                <Text style={tw`ml-2 font-semibold text-xs`}>
                  {GetData[0]?.selecteduser.subtotal}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            {
              backgroundColor: '#ffffff',
              // borderColor: '#d4af00',
              width: width * 0.92,
            },
            tw`border self-center border-gray-200 shadow-xl rounded-lg mt-5`,
          ]}
        >
          <View
            style={tw`mt-2 w-85 items-center  flex-row justify-around h-10 self-center`}
          >
            {/* <View style={tw` items-center  justify-center w-20 h-10`}>
              <Text>Image</Text>
            </View> */}
            <View style={tw` items-start justify-center w-35  h-10`}>
              <Text style={tw`font-bold ml-3`}>Product Name</Text>
            </View>
            <View style={tw` items-start justify-center w-25  h-10`}>
              <Text style={tw`font-bold`}>Quantity</Text>
            </View>
            <View style={tw` items-center  justify-center w-25  h-10`}>
              <Text style={tw`font-bold`}>Amount</Text>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-80 self-center`} />

          {GetData[0]?.selecteduser?.orders.map((product, index) => (
            <View
              key={index}
              style={tw`mt-2 w-85 items-center  flex-row justify-around h-10 self-center`}
            >
              <View style={tw` items-start justify-center  w-35  h-10`}>
                <Text style={tw`ml-3`} numberOfLines={2}>
                  {product.name}
                </Text>
              </View>
              <View style={tw` items-start justify-center w-25 h-10`}>
                <Text style={tw`ml-5`}>{product.quantity}</Text>
              </View>
              <View style={tw` items-center justify-center w-25 h-10`}>
                <Text>{product.amount * product.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            { width: width * 0.92 },
            tw` mt-6  self-center border border-gray-200 rounded-xl bg-white shadow-xl `,
          ]}
        >
          <View style={tw`flex-col mt-3 justify-between`}>
            <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
              <View>
                <Text style={tw`ml-5 font-semibold text-base`}>
                  Payment Details
                </Text>
              </View>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-76 mt-1 self-center`} />

          <View style={tw`flex-col justify-between`}>
            <View
              style={[
                { width: width * 0.85 },
                tw` flex-row self-center justify-between  mt-2 items-center`,
              ]}
            >
              <View style={[{ width: width * 0.65 }]}>
                <Text style={tw` font-light  text-base`}>Sub Total</Text>
              </View>

              <View>
                <Text style={tw`mr-1 font-light text-base`}>
                  {GetData[0]?.selecteduser.subtotal}
                </Text>
              </View>
            </View>

            {GetData[0]?.selecteduser?.tax.length ? (
              GetData[0]?.selecteduser?.tax?.map(data => (
                <View
                  style={[
                    { width: width * 0.85 },
                    tw` flex-row self-center justify-between  mt-2 items-center`,
                  ]}
                >
                  <View style={[{ width: width * 0.65 }]}>
                    <Text style={tw` font-light  text-base`}>
                      {/* {data?.type_l === 'Percent' && `${data?.fuel_charges}% `} */}
                      {data?.company.toUpperCase()}{' '}
                    </Text>
                  </View>

                  <View>
                    <Text style={tw`mr-1 font-light text-base`}>
                      {data.type_l === 'Fixed'
                        ? parseInt(data.fuel_charges)
                        : (parseInt(GetData[0]?.selecteduser?.subtotal) / 100) *
                          parseInt(data.fuel_charges)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <></>
            )}

            <View
              style={[
                { width: width * 0.85 },
                tw` flex-row self-center justify-between  mt-2 items-center`,
              ]}
            >
              <View style={[{ width: width * 0.65 }]}>
                <Text style={tw` font-light  text-base`}>Delivery Charges</Text>
              </View>

              <View>
                <Text style={tw`mr-1 font-light text-base`}>
                  {GetData[0]?.selecteduser.vendordc}
                </Text>
              </View>
            </View>
          </View>

          {GetData[0]?.selecteduser?.discount > 0 && (
            <View
              style={[
                { width: width * 0.85 },
                tw` flex-row self-center justify-between  mt-2 items-center`,
              ]}
            >
              <View style={[{ width: width * 0.65 }]}>
                <Text style={tw` font-light  text-base`}>
                  {/* {data?.type_l === 'Percent' && `${data?.fuel_charges}% `} */}
                  Discount
                </Text>
              </View>

              <View>
                <Text style={tw`mr-1 font-light text-base`}>
                  {parseFloat(GetData[0]?.selecteduser?.discount)}
                </Text>
              </View>
            </View>
          )}

          <View style={tw`border border-gray-300 w-76 mt-1 self-center`} />

          <View
            style={[
              { width: width * 0.85 },
              tw` flex-row self-center justify-between mb-2  mt-2 items-center`,
            ]}
          >
            <View style={[{ width: width * 0.65 }]}>
              <Text style={tw` font-bold  text-base`}>Grand Total</Text>
            </View>

            <View>
              <Text style={tw`mr-1 font-bold text-base`}>
                {GetData[0]?.selecteduser?.discount > 0
                  ? parseInt(
                      parseInt(finalAmount) +
                        GetData[0]?.selecteduser?.vendordc,
                    ) - parseFloat(GetData[0]?.selecteduser?.discount)
                  : finalAmount + GetData[0]?.selecteduser?.vendordc}
                {/* {data.selecteduser.type_l === 'Fixed'
                  ? parseInt(data.selecteduser.fuel_charges)
                  : (parseInt(totalAmount) / 100) *
                    parseInt(data.selecteduser.fuel_charges)} */}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            { width: width * 0.92 },
            tw` mt-6 mb-5 h-50 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
          ]}
        >
          <View style={tw`flex-col justify-between`}>
            <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
              <View>
                <Text style={tw`ml-5 font-semibold text-base`}>
                  Delivery Details
                </Text>
              </View>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-75 self-center`} />

          <View style={tw`flex-col justify-between`}>
            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/userc.png')}
                  />
                </View>

                <View>
                  <Text style={tw`ml-2 font-light text-base`}>
                    {GetData1[0]?.selecteduser?.name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/phone.png')}
                  />
                </View>

                <View>
                  <Text style={tw`ml-2 font-light text-base`}>
                    {GetData1[0]?.selecteduser?.phoneNumber}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/city-map.png')}
                  />
                </View>

                <View>
                  <Text numberOfLines={2} style={tw`ml-2 font-light text-base`}>
                    {GetData1[0]?.selecteduser?.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  captureArea: {
    // padding: 20,
    // margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productContainer: {
    flexDirection: 'row',

    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 50,
    height: 50,
    // marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
  },
  capturedImage: {
    height: 400,
    width: '100%',
    marginTop: 20,
  },
  captureArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#199A8E',
    borderRadius: 5,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  capturedImage: {
    height: 400,
    width: '100%',
    marginTop: 20,
  },
});

export default MyRiderorders;
