import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Screensheader from '../../Components/Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/FIrebase';
import uuid from 'react-native-uuid';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { keepLocalCopy, pick } from '@react-native-documents/picker';
import storage from '@react-native-firebase/storage';

const Updateprofile = ({ navigation, route }) => {
  const { url, pid, rfname, rlname, phonee, addresss, emaill } = route.params;
  const [email, setEmail] = useState(emaill);
  const [fname, setfname] = useState(rfname);
  const [lname, setlname] = useState(rlname);
  const [password, setPassword] = useState('');
  const [phone, setphone] = useState(phonee);
  const [address, setaddress] = useState(addresss);
  const [filedata1, setfiledata1] = useState(url);
  // const [phone, setphone] = useState('');
  const [loading, setloading] = useState(false);
  const [images, setImages] = useState([null]);
  const [entry, setentry] = useState(false);
  const userid = uuid.v4();
  const [rnum, setrnum] = useState(Math.floor(Math.random() * 1000000));
  const datee = new Date();
  const showdate =
    datee.getFullYear() + '-' + (datee.getMonth() + 1) + '-' + datee.getDate();

  const Signinwithemailandpass = async () => {
    if (!email || !password || !fname || !lname || !phone || !address) {
      Alert.alert('Field Required', `Must Fill All The Field`, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK');
          },
        },
      ]);
    } else {
      try {
        setloading(true);

        // if (imglink1 && filedata1) {
        //   const reference = storage().ref(`allsubscriptionfiles/${name1}`);
        //   await reference.putFile(imglink1);
        //   const url = await storage()
        //     .ref(`allsubscriptionfiles/${name1}`)
        //     .getDownloadURL();
        //   console.log('your file is locating :', url);
        //   sethomephone(url);
        // }

        createUserWithEmailAndPassword(
          auth,
          email.toLowerCase().trim(),
          password.trim(),
        )
          .then(data => {
            console.log(data.user.email);
            setDoc(doc(db, 'subs_rider', userid), {
              name: fname + ' ' + lname,
              fname: fname,
              lname: lname,
              role: 'User',
              email: email.toLowerCase().trim(),
              address: address,
              cnic: `42403-959303-${rnum}`,
              phoneNumber: phone,
              image: '',
              usernum: rnum,
              joiningDate: showdate,
              profilestatus: 'active',
              country: 'Pakistan',
              city: 'Karachi',
              password: password.trim(),
              uid: userid,
              walletamount: 0,
              timestamp: serverTimestamp(),
            })
              .then(() => {
                setloading(false);
                Alert.alert('Congratulation', `Register Successfully`, [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              })
              .catch(error => {
                setloading(false);
                // console.log(error);
                Alert.alert('Error :', error.message);
              });
          })
          .catch(error => {
            setloading(false);
            // console.log("this : ",error.message);
            Alert.alert('Error :', error.message);
          });
      } catch (error) {
        setloading(false);
        Alert.alert('Error :', error.message);
        console.log(error);
      }
    }
  };

  const updateUserProfile = async () => {
    if (!email || !fname || !lname || !phone || !address) {
      Alert.alert('Field Required', `Must Fill All The Field`, [
        { text: 'OK', onPress: () => console.log('OK') },
      ]);
    } else {
      if (phone.length === 11) {
        try {
          if (phonee === phone) {
            setloading(true);
            console.log('images ki array', images);

            const uploadPromises = images.map(async (image, index) => {
              try {
                if (images[index] !== null && image?.name && image?.path) {
                  console.log('Image OK:', image.name, image.path);
                  console.log('step 1');
                  console.log('name', image.name);
                  const reference = storage().ref(`products/${image.name}`);
                  console.log('step 2');
                  console.log('path', image.path);
                  const filePath = `file://${image.path}`;
                  await reference.putFile(image.path, {
                    cacheControl: 'no-store', // disable caching
                  });
                  console.log('step 3');
                  const url = await reference.getDownloadURL();
                  console.log('step 4');
                  return url;
                } else {
                  setloading(false);
                  console.log('Invalid or null image at index:', index);
                  return null;
                }
              } catch (error) {
                setloading(false);
                console.log(`Upload failed at index ${index}:`, error.message);
                return null;
              }
            });

            console.log('upload ho chuki ha images ya pdf');

            const unfilterurls = await Promise.all(uploadPromises);
            const filterimages = unfilterurls.filter(url => url !== undefined);
            // setloading(false)
            console.log('Uploaded image URLs:', filterimages);

            const userRef = doc(db, 'subs_users', pid); // userid must be known

            await updateDoc(userRef, {
              name: fname + ' ' + lname,
              fname: fname,
              lname: lname,
              // email: email.toLowerCase().trim(),
              address: address,
              phoneNumber: phone,
              image: filterimages[0] === null ? [filedata1] : filterimages,
              // password: password.trim(),
              timestamp: serverTimestamp(),
            });

            setloading(false);
            Alert.alert('Success', 'Profile updated successfully', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } else {
            const coll = collection(db, 'subs_users');
            // const q = query(coll, where('role', '==', label1), where('email', '==', email));
            const q = query(
              coll,
              where('phoneNumber', '==', phone.trim()),
              // where('password', '==', password),
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size > 0) {
              setloading(false);
              Alert.alert(
                'Alert',
                `Phone Number is Already Register Please Add New One`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      console.log('OK');
                    },
                  },
                ],
              );
            } else {
              setloading(true);
              console.log('images ki array', images);

              const uploadPromises = images.map(async (image, index) => {
                try {
                  if (images[index] !== null && image?.name && image?.path) {
                    console.log('Image OK:', image.name, image.path);
                    console.log('step 1');
                    console.log('name', image.name);
                    const reference = storage().ref(`products/${image.name}`);
                    console.log('step 2');
                    console.log('path', image.path);
                    const filePath = `file://${image.path}`;
                    await reference.putFile(image.path, {
                      cacheControl: 'no-store', // disable caching
                    });
                    console.log('step 3');
                    const url = await reference.getDownloadURL();
                    console.log('step 4');
                    return url;
                  } else {
                    setloading(false);
                    console.log('Invalid or null image at index:', index);
                    return null;
                  }
                } catch (error) {
                  setloading(false);
                  console.log(
                    `Upload failed at index ${index}:`,
                    error.message,
                  );
                  return null;
                }
              });

              console.log('upload ho chuki ha images ya pdf');

              const unfilterurls = await Promise.all(uploadPromises);
              const filterimages = unfilterurls.filter(
                url => url !== undefined,
              );
              // setloading(false)
              console.log('Uploaded image URLs:', filterimages);

              const userRef = doc(db, 'subs_users', pid); // userid must be known

              await updateDoc(userRef, {
                name: fname + ' ' + lname,
                fname: fname,
                lname: lname,
                // email: email.toLowerCase().trim(),
                address: address,
                phoneNumber: phone,
                image: filterimages[0] === null ? [filedata1] : filterimages,
                // password: password.trim(),
                timestamp: serverTimestamp(),
              });

              setloading(false);
              Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            }
          }
        } catch (error) {
          setloading(false);
          Alert.alert('Error', error.message);
          console.log('Update Error:', error);
        }
      } else {
        Alert.alert('Alert', `Number Should Be 11 Digits`, [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK');
            },
          },
        ]);
      }
    }
  };

  const choosefileimg = async index => {
    try {
      const [file] = await pick({
        type: ['image/*'], // restrict to images only
      }); // Custom picker, returns [{ uri, name, size, type }]

      if (!file) return;

      if (file.size / 1000 / 1000 >= 5.0) {
        Alert.alert('Alert', 'Select Image Max 5 MB');
        return;
      }

      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name ?? 'fallbackName',
          },
        ],
        destination: 'documentDirectory',
      });

      const newImage = {
        uri: localCopy.localUri,
        path: localCopy.localUri.replace('file://', ''),
        name: file.name ?? 'fallbackName',
        type: file.type ?? 'image/jpeg',
      };

      setfiledata1(localCopy.localUri);

      console.log('images :', localCopy);
      console.log('images for object :', newImage);

      setImages(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages[index] = newImage;
        return updatedImages;
      });
    } catch (error) {
      if (error?.message?.includes('cancel')) {
        console.log('User canceled the picker');
      } else {
        console.log('Error image:', error);
      }
    }
  };

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={pid ? 'UPDATE PROFILE' : 'ADD RIDER'}
        left={5}
        onPress={() => navigation.goBack()}
      />

      <View
        style={[
          {
            width: width,
            // height: height * 0.85,
            // borderTopLeftRadius: 60,
            // borderTopRightRadius: 60,
          },
          tw`mt-5 self-center mb-25 bg-white `,
        ]}
      >
        <ScrollView>
          {/* <View
            style={[
              { width: width * 0.98 },
              tw`items-center justify-center h-15`,
            ]}
          >
            <Text style={tw`text-2xl underline mt-5 font-bold`}>
              {pid ? 'UPDATE PROFILE' : 'CREATE RIDER ACCOUNT'}
            </Text>

            <Text
              style={[
                { width: width * 0.9 },
                tw`text-base mt-2 text-center font-light`,
              ]}
            >
              Create An Account To Start Looking For The Food You Like
            </Text>
          </View> */}
          {images.map((image, index) => (
            <View style={tw`flex flex-col w-80 self-center justify-around`}>
              <TouchableOpacity onPress={() => choosefileimg(index)}>
                <View style={tw`flex w-80  items-center  mt-5 flex-col`}>
                  <View
                    style={tw`  h-30 border-2 rounded-full w-30 items-center border-dotted`}
                  >
                    {images[index] !== null ? (
                      <Image
                        source={{
                          uri: images.uri ? images[0].uri : images[0]?.uri,
                        }}
                        resizeMode="cover"
                        style={tw`w-29 h-29  self-center rounded-full`}
                      />
                    ) : (
                      <Image
                        source={{ uri: filedata1 }}
                        resizeMode="cover"
                        style={tw` w-29 h-29 rounded-full`}
                      />
                    )}
                  </View>
                  <View style={tw`mt-2 items-center`}>
                    <Text style={tw`font-bold text-black  `}>
                      {'Add Profile Picture'}
                    </Text>
                    <Text style={tw`text-xs text-black `}>Max 5mb</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}

          <View>
            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center  items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>First Name</Text>
              <Input
                value={fname}
                onchangetext={setfname}
                source={require('../../Images/usercolor.png')}
                placeholder={'First Name'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Last Name</Text>
              <Input
                value={lname}
                onchangetext={setlname}
                source={require('../../Images/usercolor.png')}
                placeholder={'Last Name'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Phone</Text>
              <Input
                value={phone}
                onchangetext={setphone}
                phonepad={'number-pad'}
                source={require('../../Images/phone.png')}
                placeholder={'Enter Phone Number'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Address</Text>
              <Input
                value={address}
                onchangetext={setaddress}
                source={require('../../Images/city-map.png')}
                placeholder={'Enter Address'}
              />
            </View>

            {/* <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Email Address</Text>
              <Input
                value={email}
                onchangetext={setEmail}
                source={require('../../Images/emailcolor.png')}
                placeholder={'Enter Email'}
              />
            </View> */}

            {pid ? (
              <></>
            ) : (
              <View
                style={[
                  { width: width * 0.9 },
                  tw`mt-5 self-center items-start  `,
                ]}
              >
                <Text style={tw`text-gray-400`}>Password</Text>
                <View
                  style={[
                    { width: width * 0.9 },
                    tw`flex-row text-black justify-between rounded-lg items-center border border-gray-400    mt-3 `,
                  ]}
                >
                  <TextInput
                    placeholder={'Enter Password'}
                    onChangeText={setPassword}
                    placeholderTextColor={'black'}
                    value={password}
                    secureTextEntry={entry}
                    style={[
                      tw`h-12 w-70 rounded-xl text-black
                text-start pl-5  `,
                    ]}
                  ></TextInput>
                  <TouchableOpacity
                    onPress={() => {
                      setentry(!entry);
                    }}
                  >
                    <Image
                      source={
                        entry
                          ? require('../../Images/lockcolor.png')
                          : require('../../Images/visible.png')
                      }
                      style={tw`h-5 w-5 -left-5  justify-end`}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* <View style={tw`justify-end items-center flex-row w-85 h-10 mt-5`}>
            <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
              <Text style={[tw`text-center`, { color: '#FBAE17' }]}>
                {'Forget Password'}
              </Text>
            </TouchableOpacity>
          </View> */}
            {loading ? (
              <ActivityIndicator
                style={tw`mt-5`}
                size={'large'}
                color={'#00b9e2'}
              />
            ) : (
              <View style={tw`justify-between self-center w-80 h-15 mt-5`}>
                <Buttonnormal
                  onPress={() => {
                    if (pid) {
                      updateUserProfile();
                    } else {
                      Signinwithemailandpass();
                    }
                  }}
                  // onPress={()=> navigation.navigate('Tabbar')}

                  c1={'#F16767'}
                  c2={'#F16767'}
                  style={tw`text-white text-xl`}
                  title={pid ? 'UPDATE' : 'Register'}
                />
              </View>
            )}
            {/* <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <View style={tw`mt-5 self-center`}>
                <Text style={tw`text-black mb-5`}>
                  {'Already have an account?'}
                  <Text style={{ color: '#FBAE17' }}> {'Sign In'}</Text>
                </Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
};

export default Updateprofile;
