import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import tabs from '../constants/tabs';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = '#F3F3F3';
const SECONDARY_COLOR = '#222222';

const CustomNavBar = ({ state, descriptors, navigation }) => {
  return (
    // <View className="absolute bottom-6 left-12 right-12 bg-transparent">
    //   <View className="flex-row justify-around items-center bg-[#F3F3F3] py-2 rounded-full mt-2 "></View>
    <View className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[300px] bg-transparent">
      <View className="flex-row justify-around items-center bg-[#F3F3F3] py-2 rounded-full">
        {state.routes.map((route, index) => {
          if (['_sitemap', '+not-found'].includes(route.name)) return null;

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <AnimatedTouchableOpacity
              layout={LinearTransition.springify().mass(0.5)}
              disabled={isFocused}
              key={route.key}
              onPress={onPress}
              className={`${
                isFocused
                  ? `flex-row items-center bg-[#222222] ${
                      route.name === 'user-representative'
                        ? 'py-2 px-8'
                        : 'py-3 px-10'
                    } rounded-full`
                  : 'bg-transparent p-2'
              }`}
            >
              {getIconByRouteName(route.name, isFocused)}
              {isFocused && (
                <Animated.Text
                  className="text-white font-semibold ml-2"
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                >
                  {label}
                </Animated.Text>
              )}
            </AnimatedTouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  function getIconByRouteName(routeName, isFocused) {
    if (routeName === 'user-representative') {
      if (isFocused) {
        return <Image source={tabs.rep_nav_white} resizeMode="contain" />;
      }
      return <Image source={tabs.rep_nav_black} resizeMode="contain" />;
    }

    if (routeName === 'user-parliament') {
      if (isFocused) {
        return <Image source={tabs.pal_nav_white} resizeMode="contain" />;
      }
      return <Image source={tabs.pal_nav_black} resizeMode="contain" />;
    }

    if (routeName === 'user-profile') {
      if (isFocused) {
        return <Image source={tabs.profile_nav_white} resizeMode="contain" />;
      }
      return <Image source={tabs.profile_nav_black} resizeMode="contain" />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    width: '80%',
    alignSelf: 'center',
    bottom: 20,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default CustomNavBar;
