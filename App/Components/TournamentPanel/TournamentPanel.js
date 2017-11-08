/**
 * Created by FBegiello on 29.10.2017.
 */


import React, { Component } from 'react';
import {
    View,
    Text,
    Button,

} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import Battle from './Battle1x1/BattleRow'
import BattleInspector from './Battle1x1/BattleInspector'
import Battle2x2 from './Battle2x2/BattleRow'
import BattleInspector2x2 from './Battle2x2/BattleInspector'

import MainStyles from '../../Styles/MainStyles'
import TournamentStyles from '../../Styles/TournamentStyles'

export default class TournamentPanel extends Component {


    constructor(props) {
        super(props);
        this.state = {
            inspectVisible: false,
            inspectorBattleId: 'someID',

            battleType: 2,

            tournamentName: "Temptemptemptemp",
            turnMax: 4,
            currentTab: 1,
        };
    }

    battlesContent = {
        battle1:{
            player1:{
                nick:'Temp1',
                name:'Temp1',
                surname:'Temptemp1',
                score: 0,
                total: 34,
            },
            player2:{
                nick:'Temp2',
                name:'Temp2',
                surname:'Temptemp2',
                score: 20,
                total: 42,
            },
            table:1
        },
        battle2:{
            player1:{
                nick:'Temp1',
                name:'Temp1',
                surname:'Temptemp1',
                score: 16,
                total: 56,
            },
            player2:{
                nick:'Temp2',
                name:'Temp2',
                surname:'Temptemp2',
                score: 4,
                total: 42,
            },
            table:2
        },
        battle3:{
            player1:{
                nick:'Temp1',
                name:'Temp1',
                surname:'Temptemp1',
                score: 10,
                total: 42,
            },
            player2:{
                nick:'Temp2',
                name:'Temp2',
                surname:'Temptemp2',
                score: 10,
                total: 42,
            },
            table:3
        },
        battle4:{
            player1:{
                nick:'Temp1',
                name:'Temp1',
                surname:'Temptemp1',
                score: 13,
                total: 34,
            },
            player2:{
                nick:'Temp2',
                name:'Temp2',
                surname:'Temptemp2',
                score: 7,
                total: 76,
            },
            table:4
        },
    }

    onSwipeLeft(gestureState) {
        if(this.state.currentTab>1) this.setState({currentTab: this.state.currentTab-1});
    }

    onSwipeRight(gestureState) {
        if(this.state.currentTab<this.state.turnMax) this.setState({currentTab: this.state.currentTab+1});
    }

    openInspector(battleId){
        this.setState({
            inspectVisible: true,
            inspectorBattleId: battleId})
    }

    makeBattle(){
        if(this.state.battleType===1) {
            return (<Battle currentTab={this.state.currentTab} content={this.battlesContent}/>)
        }
        else {
            return (<Battle2x2 currentTab={this.state.currentTab} content={this.battlesContent}/>)
        }
    }
    makeBattleInspector(){
        if(this.state.battleType===1) {
            return (<BattleInspector
                    onClosePanel={(isVisible) => this.setState({inspectVisible: isVisible})}
                    isVisible={this.state.inspectVisible}
                    battleData={this.battlesContent.battle1}/>)
        }
        else {
            return (<BattleInspector2x2
                    onClosePanel={(isVisible) => this.setState({inspectVisible: isVisible})}
                    isVisible={this.state.inspectVisible}
                    battleData={this.battlesContent.battle1}/>)
        }
    }

    render() {

        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 30
        };

        return (
            <View style={MainStyles.contentStyle}>
                <View style={[TournamentStyles.tournamentHeader,MainStyles.borderStyle]}>
                    <Text style={MainStyles.bigWhiteStyle}>{this.state.tournamentName}</Text>
                </View>
                <View style={{marginBottom: 3}}><Button title={"My battle"} color='#4b371b' onPress={()=>{this.openInspector("MyBattleID")}}/></View>
                <GestureRecognizer
                    onSwipeLeft={(event) => this.onSwipeLeft(event)}
                    onSwipeRight={(event) => this.onSwipeRight(event)}
                    config={config}
                    style={{flex: 1, alignItems:'center'}}>
                    <View style={{flex: 1}}>
                        <View style={[TournamentStyles.pageWindow, MainStyles.borderStyle]}>
                            <Text style={MainStyles.smallWhiteStyle}>{this.state.currentTab}/{this.state.turnMax}</Text>
                        </View>
                        {this.makeBattle()}
                    </View>
                </GestureRecognizer>
                <View><Button title={"Return"} color='#4b371b' onPress={()=>{}}/></View>
                {this.makeBattleInspector()}
            </View>
        );
    }
}