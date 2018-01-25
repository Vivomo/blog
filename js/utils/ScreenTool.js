import {Dimensions, Platform,} from 'react-native';

const {width, height} = Dimensions.get('window');
const UI_WIDTH = 375;

export const px = (elemPx, isIntType = false) => {
    let result = elemPx *  Screen.width / UI_WIDTH;
    return isIntType ? ~~result : result;
};

const Screen = {
    width,
    height,
    isIOS: () => Platform.OS === 'ios',
    isAndroid: () => Platform.OS === 'android',
    circle: (d) => ({
        width: d,
        height: d,
        borderRadius: d / 2
    }),
    mergeStyle: (...args) => {
        let styles = [];
        args.forEach((style) => {
            if (Array.isArray(style)) {
                styles = styles.concat(style);
            } else if ((typeof style === 'object' && style) || typeof style === 'number'){ // StyleSheet.create 创建的对象值为数字
                styles.push(style)
            }
        });
        return styles;
    }
};


export default Screen;