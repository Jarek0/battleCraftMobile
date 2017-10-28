/**
 * Created by FBegiello on 21.10.2017.
 */
import {
    StyleSheet,
} from 'react-native';
import BaseColours from "../Main/consts/BaseColours"

const styles = StyleSheet.create({
    dropdownContainerStyle:{
        position: 'absolute',
        zIndex: 10000,
        top:60,
        right:0,
        width: 250,
        height: 350,
        backgroundColor: BaseColours.background.mediumBrown,
        borderColor: BaseColours.border.top,
        borderWidth: 3
    },
    dropdownOptionStyle:{
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        marginTop:2,
        backgroundColor: BaseColours.background.darkBrown,
    },
});

export default styles;

