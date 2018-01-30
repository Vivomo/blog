import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Screen, {px, Theme} from "../utils/ScreenTool";

export const Row = props => <View style={Screen.mergeStyle(props.style, styles.row)}>{props.children}</View>;
export const VCenter = props => {
    const style = {
        alignItems: 'center'
    };
    if (typeof props.height === 'number') {
        style.height = props.height;
    }
    if (props.row) {
        style.flexDirection = 'row';
    }
    return <View style={Screen.mergeStyle( props.style, style)}>{props.children}</View>
};

export const CenterBox = props => {
    const style = {};
    if (typeof props.height === 'number') {
        style.height = props.height;
    }
    if (typeof props.width === 'number') {
        style.width = props.width;
    }
    if (props.row) {
        style.flexDirection = 'row';
    }
    return <View style={Screen.mergeStyle( props.style, styles.center, style)}>{props.children}</View>;
};

export const Title = props => {
    const style = {
        color: Theme.titleColor
    };
    if (props.size) {
        style.fontSize = props.size;
    }
    if (props.color) {
        style.color = props.color;
    }
    return <Text style={Screen.mergeStyle(props.style, style)}>{props.children}</Text>;
};

export const P = props => {
    const style = {
        color: Theme.contentColor
    };
    if (props.size) {
        style.fontSize = props.size;
    }
    if (props.color) {
        style.color = props.color;
    }
    return <Text style={Screen.mergeStyle(props.style, style)}>{props.children}</Text>;
}

export const Input = props => {
    const {
        value,
        onChange,
        placeholder,
        multiline = false,
        style
    } = props;

    if (multiline) {
        console.log(Screen.mergeStyle(styles.textInput, style));
    }

    let _style = {};
    if (multiline) {
        _style.textAlignVertical = 'top'
    }


    return <TextInput
        value={value}
        onFocus={()=>{

        }}
        multiline={multiline}
        onChangeText={onChange}
        style={Screen.mergeStyle(styles.textInput, style, _style)}
        placeholderTextColor={Theme.placeholderColor}
        placeholder={placeholder}
        underlineColorAndroid="transparent"
    />
};

/**
 * 空心按钮
 * @param props
 * @constructor
 */
export const ButtonHollow = props => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={props.onClick}
        >
            <CenterBox style={[styles.defaultBtn, {borderWidth: px(1), borderColor: Theme.blue}]}>
                <Text style={{color: Theme.blue}}>{props.value}</Text>
            </CenterBox>
        </TouchableOpacity>
    )
};
/**
 * 实心按钮
 * @param props
 * @constructor
 */
export const ButtonSolid = props => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={props.onClick}
        >
            <CenterBox style={[styles.defaultBtn, {backgroundColor: '#2e6be6'}]}>
                <Text style={{color: '#fff'}}>{props.value}</Text>
            </CenterBox>
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: px(40),
        flex: 1,
        fontSize: 14,
        color: Theme.contentColor,
        backgroundColor: 'transparent',
        paddingVertical: 0,
    },
    defaultBtn: {
        margin: px(12),
        width: px(320),
        height: px(46),
        borderRadius: px(23),
    }
});