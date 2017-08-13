/**
 * Created by FBegiello on 17.07.2017.
 */

import React, { Component } from 'react';
import {
    Image,
    View,
    Dimensions,
} from 'react-native';
import FadeView from './Components/FadeView'

export default class SplashScreen extends Component {

    constructor() {
        super()
    }

    render() {
        return (
            <FadeView style={{flex:1}}>
                <View style={{flex: 1}}>
                    <Image
                        style={{flex:1, width: Dimensions.get('window').width}}
                        source={require('../img/logoBig.png')} />
                </View>
            </FadeView>
        );
    }
}

module.export = SplashScreen;
