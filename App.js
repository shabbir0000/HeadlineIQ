import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Navigation from './My Components/Navigation/Navigationw';
// import Navigationwl from './Screens/Universal/Navigationwl';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { showToast } from './Screens/Universal/Input';
import Deviceinfo from 'react-native-device-info';
import { AppProvider } from './AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigationw from './My Components/Navigation/Navigationw';
import { useFocusEffect } from '@react-navigation/native';
import { db } from './firebase/FIrebase';
import { collection, onSnapshot, where } from 'firebase/firestore';

const App = () => {
  // const mobileid = DeviceInfo.getUniqueId();
  const [id, setid] = useState(false);
  const [flag, setflag] = useState(true);
  const [GetData10, setGetData10] = useState([]);

  // useFocusEffect(
  //   React.useCallback(() => {

  //     return () => {};
  //   }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  // );

  useEffect(() => {
    // Noss()
    const login = async () => {
      const id = await Deviceinfo.getUniqueId();

      // AsyncStorage.setItem('mobileid', id).then(() => {
      // AsyncStorage.setItem('role', 'User').then(() => {
      AsyncStorage.setItem('Guest', 'Yes').then(() => {
        AsyncStorage.setItem('popup', 'true').then(() => {
          setid(false);
          setflag(false);
          // setflag(true)
          console.log('unique id ', id);
        });
        // });
      });
      // });
    };

    AsyncStorage.getItem('mobileid').then(id => {
      if (id) {
        AsyncStorage.setItem('popup', 'true').then(() => {
          console.log('my log id', id);
          setid(true);
          setflag(false);
        });
      } else {
        console.log('log id', id);
        login();
      }
    });
    // login();
  }, []);

  return (
    <>
      {flag ? (
        <ActivityIndicator
          color={'#00b9e2'}
          style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}
          size={'large'}
        />
      ) : id ? (
        <GestureHandlerRootView>
          <AppProvider>
            <Navigationw />
          </AppProvider>
        </GestureHandlerRootView>
      ) : (
        <GestureHandlerRootView>
          <AppProvider>
            <Navigation />
          </AppProvider>
        </GestureHandlerRootView>
      )}
    </>
  );
};

export default App;
