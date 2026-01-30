import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import Screensheader from '../../Screens/Universal/Screensheader';
// import Userliveorder from './Userliveorder';
// import Usercompleteorder from './Usercompleteorder';
// import Userreturnedorder from './Userreturnedorder';
// import Customorders from './Customorders';
import Screensheader from '../Universal/Screensheader';
import Userliveorder from './Userliveorder';
import Usercompleteorder from './Usercompleteorder';
import Userreturnedorder from './Userreturnedorder.';
import Customorders from './Customorders';
import ExpiredOrders from './ExpiredOrders';

const Tab = createMaterialTopTabNavigator();

const Mainfile = ({navigation}) => {
  return (
    <View style={[tw`flex-1`, {backgroundColor: '#FEF0F0'}]}>
      <Screensheader
        name={'Your Orders'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <Tab.Navigator
        initialRouteName="Live Orders"
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          
          tabBarLabelStyle: {fontSize: 12},
          tabBarStyle: {backgroundColor: '#ffffff'},
          tabBarPressColor: 'transparent',
        }}>
        <Tab.Screen
          name="Live Orders"
          component={Userliveorder}
          options={{tabBarLabel: 'Live Orders'}}
        />

        <Tab.Screen
          name="Expired Orders"
          component={ExpiredOrders}
          options={{tabBarLabel: 'Expired Orders'}}
        />

        <Tab.Screen
          name="Complete Order"
          component={Usercompleteorder}
          options={{tabBarLabel: 'Complete Order'}}
        />

        <Tab.Screen
          name="Reject Order"
          component={Userreturnedorder}
          options={{tabBarLabel: 'Reject Order'}}
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

export default Mainfile;
