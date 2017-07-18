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
            <View style={styles.contentStyle}>
                <Image
                    style={{width: Dimensions.get('window').width}}
                    source={require('../img/logoBig.png')} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    mainStyle: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentStyle: {
        flex: 0.9,
        padding: 5,
        marginTop: 1,
        justifyContent: 'center',
        borderColor: '#c1af6e',
        borderWidth: 5,
        backgroundColor: '#7f5136',
    },
    bigWhiteStyle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 26,
    },
    smallWhiteStyle: {
        color: '#fff',
        fontSize: 20,
    },
});

module.export = SplashScreen;