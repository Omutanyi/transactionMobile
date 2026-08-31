import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  image: any;
  title: string;
  description: string;
}

interface CarouselProps {
  data?: CarouselItem[];
  autoSlide?: boolean;
  slideInterval?: number;
  height?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  data = [],
  autoSlide = true,
  slideInterval = 3000,
  height = 200,
}) => {
  const theme = useTheme() as any;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || data.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, data.length]);

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      // Fade animation for smooth transition
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollToIndex(index);
  };

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {data.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              styles.slide,
              { width: screenWidth, opacity: fadeAnim },
            ]}
          >
            <Image source={item.image} style={styles.image} />
            
            {/* Overlay gradient */}
            <View style={styles.overlay} />
            
            {/* Text content */}
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: '#fff' }]}>{item.title}</Text>
              <Text style={[styles.description, { color: '#fff' }]}>
                {item.description}
              </Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Navigation arrows */}
      {/* <TouchableOpacity style={styles.leftArrow} onPress={goToPrevious}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.rightArrow} onPress={goToNext}>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity> */}

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.primary : 'rgba(255, 255, 255, 0.5)',
              },
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 10,
    width: '100%',
    overflow: 'hidden',
    marginTop: 20,
    // marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  leftArrow: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  rightArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Carousel;
