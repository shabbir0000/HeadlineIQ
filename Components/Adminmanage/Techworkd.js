import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import tw from 'twrnc';
import Screensheader from '../Universal/Screensheader';
// import Companycities from './Companycities';
// import Company from './Company';
// import Manageplans from '../../Components/Plans/Manageplans';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Writers from './Writers';
// import HeadlineBar from '../Tabbar/HeadlineBar';
// import Others from './Others';
// import { t } from 'i18next';
import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import Companycities from './Companycities';
import Manageplans from './Manageplans';
import Manageriders from './Manageriders';
import Managepromotion from './Managepromotion';
import Areas from './Areas';
import Othercharges from './Othercharges';
import Discount from './Discount';

const Techworkd = ({ navigation }) => {
  const Tab = createMaterialTopTabNavigator();
  const { darkMode } = useContext(AppContext);
  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'Manage'}
        left={5}
        // onPress={() => navigation.goBack()}
      />
      <Tab.Navigator
        initialRouteName="Manage Category"
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: 'grey',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarPressColor: 'transparent',
        }}
      >
        <Tab.Screen
          name="Manage Category"
          component={Companycities}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Manage Category' }}
        />

        <Tab.Screen
          name="Manage Areas"
          component={Areas}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Manage Areas' }}
        />

        <Tab.Screen
          name="Other Charges"
          component={Othercharges}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Other Charges' }}
        />

        <Tab.Screen
          name="Discount"
          component={Discount}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Discount' }}
        />

        {/* <Tab.Screen
          name="Manage Sub-Category "
          component={Company}
          // initialParams={{email:email}}
          options={{tabBarLabel: 'Manage Sub-Category'}}
        />

        <Tab.Screen
          name="Manage Writers"
          component={Writers}
          // initialParams={{email:email}}
          options={{tabBarLabel: 'Manage Writers'}}
        /> */}

        <Tab.Screen
          name="Manage Products"
          component={Manageplans}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Manage Products' }}
        />

        <Tab.Screen
          name="Manage Riders"
          component={Manageriders}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Manage Riders' }}
        />

        <Tab.Screen
          name="Manage Promotion"
          component={Managepromotion}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Manage Promotion' }}
        />

        
      </Tab.Navigator>
      {/* <HeadlineBar /> */}
    </View>
  );
};

export default Techworkd;
