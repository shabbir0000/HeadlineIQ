import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Screensheader from '../../Screens/Universal/Screensheader';
// import Userliveorder from './Userliveorder';
// import Usercompleteorder from './Usercompleteorder';
// import Userreturnedorder from './Userreturnedorder';
// import Customorders from './Customorders';
import Screensheader from '../Universal/Screensheader';
// import Userliveorder from './Adminliveorder';
// import Usercompleteorder from './Admincompleteorder';
// import Userreturnedorder from './Adminreturnedorder.';
// import Customorders from './Customorders';
// import Adminliveorder from './Adminliveorder';
// import Admincompleteorder from './Admincompleteorder';
// import Adminreturnedorder from './Adminreturnedorder.';
import Riderliveorder from './Riderliveorder';
import Ridercompleteorder from './Ridercompleteorder';
import Riderreturnedorder from './Riderreturnedorder.';

const Tab = createMaterialTopTabNavigator();

const Ridermain = ({ navigation }) => {
  return (
    <View style={[tw`flex-1`, { backgroundColor: '#FEF0F0' }]}>
      <Screensheader
        name={'Your Orders'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <Tab.Navigator
        initialRouteName="Assign Order"
        screenOptions={{
          // tabBarScrollEnabled: true,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',

          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: '#ffffff' },
          tabBarPressColor: 'transparent',
        }}
      >
        <Tab.Screen
          name="Assign Order"
          component={Ridercompleteorder}
          options={{ tabBarLabel: 'Assign Order' }}
        />

        <Tab.Screen
          name="Expire Orders"
          component={Riderliveorder}
          options={{ tabBarLabel: 'Expire Orders' }}
        />
        
        <Tab.Screen
          name="Reject Order"
          component={Riderreturnedorder}
          options={{ tabBarLabel: 'Complete Order' }}
        />

        {/* <Tab.Screen
          name="Custom Orders"
          component={Customorders}
          options={{tabBarLabel: 'Techworker Booking'}}
        /> */}
      </Tab.Navigator>
    </View>
  );
};

export default Ridermain;
