/**
 * Created by FBegiello on 17.07.2017.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    Dimensions,
} from 'react-native';

export default class SplashScreen extends Component {

    constructor() {
        super()
    }

    render() {
        return (
            <View style={[styles.contentStyle, styles.borderStyle]}>
                <Image
                    style={{width: Dimensions.get('window').width}}
                    source={require('../img/logoBig.png')} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    textStyle:{
        fontFamily:'arial, helvetica, sans-serif',
        textShadowColor: '#000000',
        textShadowOffset: {width: -1, height: -1},
        color: '#fff',
    },

    borderStyle:{
        borderTopColor: '#e3ca86',
        borderRightColor: '#4b371b',
        borderBottomColor: '#E0BA51',
        borderLeftColor: '#ecdbac',
    },
    contentStyle: {
        flex: 0.9,
        padding: 5,
        marginTop: 1,
        justifyContent: 'center',
        borderColor: '#c1af6e',
        borderWidth: 5,
        backgroundColor: '#805D2C',
    },
    bigWhiteStyle: {
        fontFamily:'arial, helvetica, sans-serif',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 26,
    },
    smallWhiteStyle: {
        fontFamily:'arial, helvetica, sans-serif',
        color: '#fff',
        fontSize: 20,
    },
});

module.export = SplashScreen;
