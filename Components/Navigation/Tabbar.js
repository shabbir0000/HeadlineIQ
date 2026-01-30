import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import tw from 'twrnc';
// import Supplier from "../Tabbar/Supplier";
// import Home from '../Tabbar/Home';
// import Profile from '../Tabbar/Profile';
// // import Sessions from "../Tabbar/Sessions";
// import Yourplan from '../Tabbar/Yourplan';
// import Active from '../Tabbar/Active';
// import Accept from '../Tabbar/Accept';
// import Complete from '../Tabbar/Complete';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Sessions from '../Tabbar/Sessions';
// import Techworkd from './Techworkd';
// import HeadlineBar from '../Tabbar/HeadlineBar';
import { AppContext } from '../../AppContext';
import Home from '../Mainscreens/Home';
import Profile from '../Mainscreens/Profile';
import Favorite from '../Mainscreens/Favorite';
import Cart from '../Mainscreens/Cart';
import Mainfile from '../Userordermanage/Mainfile';
import Homeadmin from '../Mainscreens/Homeadmin';
import Techworkd from '../Adminmanage/Techworkd';
import AdminMainfile from '../Adminordermanage/AdminMainfile';
import Riderhome from '../Mainscreens/Riderhome';
import Ridermain from '../Ridermanage/Ridermain';
import RMain from '../Reports/RMain';
const Tab = createBottomTabNavigator();

function Tabbar() {
  const { darkMode } = useContext(AppContext);

  const [userflags, setuserflags] = useState('');
  const [flag, setflag] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('role').then(flag => {
      setflag(false);
      setuserflags(flag);
    });
  }, []);

  return (
    <>
      {flag ? (
        <ActivityIndicator
          color={'#00b9e2'}
          style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}
          size={'large'}
        />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#002C6B', // Green color when focused
            tabBarInactiveTintColor: 'gray', // Black color when not focused
            animation: 'none',
            tabBarPressColor: 'transparent',
            // tabBarBackground: () => (
            //     <View style={{flex:1, backgroundColor: 'white' }} />
            //   ),
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarStyle: {
              // borderRadius: 40,
              // borderColor : "gray",
              // marginBottom: 10,
              // width: 300,
              alignItems: 'center',
              justifyContent: 'center',
              // flex : 1,
              // flexDirection :'row',
              // left: 30,
              // right: 30,
              height: 60,

              // top : 10,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,

              backgroundColor: '#ffffff',
              //  paddingBottom:20,
              // position:'absolute'
            },
          }}
        >
          {userflags === 'Admin' ? (
            <>
              <Tab.Screen
                options={{
                  tabBarLabel: 'Homeadmin',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/homeg.png')
                      //     :  require('../../Images/home.png')
                      // }
                      source={require('../../Images/house.png')}
                    />
                  ),
                }}
                name="Home"
                component={Homeadmin}
              />

              <Tab.Screen
                options={{
                  tabBarLabel: 'Manage',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8`}
                      // source={
                      //   focused
                      //     ? require('../../Images/activitiesb.png')
                      //     : require('../../Images/activities.png')
                      // }
                      source={require('../../Images/manage.png')}
                    />
                  ),
                }}
                name="Manage"
                component={Techworkd}
              />

              <Tab.Screen
                options={{
                  tabBarLabel: 'My Orders',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/homeg.png')
                      //     :  require('../../Images/home.png')
                      // }
                      source={require('../../Images/clock.png')}
                    />
                  ),
                }}
                name="My Orders"
                component={AdminMainfile}
              />

               <Tab.Screen
                options={{
                  tabBarLabel: 'Reports',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/homeg.png')
                      //     :  require('../../Images/home.png')
                      // }
                      source={require('../../Images/report.png')}
                    />
                  ),
                }}
                name="All Reports"
                component={RMain}
              />

            </>
          ) : userflags === 'Rider' ? (
            <>
              <Tab.Screen
                options={{
                  tabBarLabel: 'Home',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/homeg.png')
                      //     :  require('../../Images/home.png')
                      // }
                      source={require('../../Images/house.png')}
                    />
                  ),
                }}
                name="Home"
                component={Riderhome}
              />

              <Tab.Screen
                options={{
                  tabBarLabel: 'Manage Orders',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8`}
                      // source={
                      //   focused
                      //     ? require('../../Images/activitiesb.png')
                      //     : require('../../Images/activities.png')
                      // }
                      source={require('../../Images/manage.png')}
                    />
                  ),
                }}
                name="Manage"
                component={Ridermain}
              />
            </>
          ) : (
            <>
              <Tab.Screen
                options={{
                  tabBarLabel: 'Home',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/homeg.png')
                      //     :  require('../../Images/home.png')
                      // }
                      source={require('../../Images/house.png')}
                    />
                  ),
                }}
                name="Home"
                component={Home}
              />

              <Tab.Screen
                options={{
                  tabBarLabel: 'Favorite',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/activitiesb.png')
                      //     : require('../../Images/activities.png')
                      // }
                      source={require('../../Images/favourite.png')}
                    />
                  ),
                }}
                name="Active"
                component={Favorite}
              />

              <Tab.Screen
                options={{
                  tabBarLabel: 'Cart',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/activitiesb.png')
                      //     : require('../../Images/activities.png')
                      // }
                      source={require('../../Images/trolley.png')}
                    />
                  ),
                }}
                name="Cart"
                component={Cart}
              />

              <Tab.Screen
                options={{
                  tabBarLabel: 'Orders',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    top: 5,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Image
                      style={tw`h-8 w-8 mt-2`}
                      // source={
                      //   focused
                      //     ? require('../../Images/activitiesb.png')
                      //     : require('../../Images/activities.png')
                      // }
                      source={require('../../Images/clock.png')}
                    />
                  ),
                }}
                name="Orders"
                component={Mainfile}
              />
            </>
          )}

          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarLabel: 'Profile',
              tabBarLabelStyle: {
                fontSize: 12,
                top: 5,
              },
              tabBarIcon: ({ focused }) => (
                <Image
                  style={tw`h-8 w-8 mt-2`}
                  // source={
                  //   focused
                  //     ? require('../../Images/persong.png')
                  //     : require('../../Images/person.png')
                  // }
                  source={require('../../Images/userc.png')}
                />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
}

export default Tabbar;
