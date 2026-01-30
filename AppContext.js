// AppContext.js
import React, { createContext, useState, useEffect } from 'react';
// import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

// export const ThemeContext = createContext();

const AppProvider = ({ children }) => {
  const [cat, setcat] = useState('');
  const [bankname, setbankname] = useState('');
  const [banktitle, setbanktitle] = useState('');
  const [bankacc, setbankacc] = useState('');
  const [vendoremail, setvendoremail] = useState('');
  const [dadddress, setdadddress] = useState('');
  const [dphone, setdphone] = useState('');
  const [orderarea, setorderarea] = useState('');
   const [dfuel, setdfuel] = useState(0);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(value => {
      if (value !== null) {
        setDarkMode(value === 'true');
      }
    });
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', newValue.toString());
  };

  const handleCategoryChange = newCategory => {
    setcat(newCategory);
  };

  const [state, setState] = useState({
    cart: [],
    // Add other pieces of state as needed
  });

  const addToCart = product => {
    setState(prevState => {
      // prevState.cart.find(item =>  console.log("item : ",item.id));
      console.log('p id', product.id);
      const existingProduct = prevState.cart.find(
        item => item.id === product.id,
      );
      console.log('item', existingProduct);
      if (existingProduct) {
        return {
          ...prevState,
          cart: prevState.cart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      } else {
        return {
          ...prevState,
          cart: [...prevState.cart, { ...product, quantity: 1 }],
        };
      }
    });
  };

  const decreaseQuantity = productId => {
    setState(prevState => {
      const existingProduct = prevState.cart.find(
        item => item.id === productId,
      );
      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          return {
            ...prevState,
            cart: prevState.cart.map(item =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            ),
          };
        } else {
          return {
            ...prevState,
            cart: prevState.cart.filter(item => item.id !== productId),
          };
        }
      }
      return prevState;
    });
  };

  const updateCart = (productId, updatedProduct) => {
    setState(prevState => ({
      ...prevState,
      cart: prevState.cart.map(product =>
        product.id === productId ? updatedProduct : product,
      ),
    }));
  };

  const removeFromCart = productId => {
    setState(prevState => ({
      ...prevState,
      cart: prevState.cart.filter(product => product.id !== productId),
    }));
  };

  const clearCart = () => {
    setState(prevState => ({
      ...prevState,
      cart: [],
    }));
  };
  //   const [state, setState] = useState({
  //     name: '',
  //     time: '',
  //     age: null,
  //     amount: 0,
  //     picLink: '',
  //     // Add other pieces of state as needed
  //   });

  //   const updateState = (key, value) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       [key]: value,
  //     }));
  //   };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        state,
        cat,
        vendoremail,
        dadddress,
        setdadddress,
        orderarea,
        setorderarea,
        dphone,
        setdphone,
        dfuel,
        setdfuel,
        setvendoremail,
        setcat,
        setbankname,
        bankname,
        setbanktitle,
        banktitle,
        setbankacc,
        bankacc,
        addToCart,
        updateCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
