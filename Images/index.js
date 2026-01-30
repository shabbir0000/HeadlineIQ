import React from 'react';
import {View} from 'react-native';
import Swiper from 'react-native-swiper';
import {Image} from 'react-native';
import {styles} from './style.css';
import images from '../../../utils/images/images';
import {windowHeight, windowWidth} from '../../../theme/appConstant';

const HomeScreenSlider = () => {
  const image = [
    {image: images.HomeBanner},
    {image: images.HomeBannerTwo},
    {image: images.HomeBannerThree},
  ];

  return (
    <View style={styles.container}>
      <Swiper
        autoplay={true}
        key={image.length}
        height={windowHeight(165)}
        width={windowWidth(800)}
        removeClippedSubviews={true}
        bounces={true}
        dotStyle={styles.inActiveDot}
        activeDot={<View style={styles.activeDot} />}>
        {image.map(item => (
          <Image style={styles.image} source={item.image} />
        ))}
      </Swiper>
    </View>
  );
};

export default HomeScreenSlider;
