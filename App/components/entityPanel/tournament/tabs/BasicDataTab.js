/**
 * Created by FBegiello on 20.10.2017.
 */

import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Button
} from 'react-native';

import SelectInput from '../../inputs/SelectInput'
import SelectTournamentTypeInput from '../../inputs/SelectTournamentTypeInput'
import NumberInput from '../../inputs/NumberInput'
import TextInput from '../../inputs/TextInput'
import DateInput from '../../inputs/DateInput'

import NumberOutput from '../../outputs/NumberOutput'
import TextOutput from '../../outputs/TextOutput'

import {serverName} from '../../../../main/consts/serverName';
import axios from 'axios';

import MainStyles from "../../../../Styles/UniversalStyles/MainStyles";
import EntityPanelStyle from "../../../../Styles/CollectionPanelStyles/EntityPanelStyle";
import InputStyles from "../../../../Styles/UniversalStyles/InputStyles";

import convertArrayToObject from "../../../../main/functions/convertArrayToObjectWithoutEmptyField";
import {type} from "../../../../main/consts/tournamentTypeWithoutEmptyOption";
import ValidationErrorMessage from '../../outputs/ValidationErrorMessage'

import { ActionCreators } from '../../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class BasicDataTab extends Component{
    constructor(props) {
        super(props);

        this.state = {
            gameNames:{}
        };
    }

    async componentDidMount(){
        await this.getGameSelectData();
    }

    async getGameSelectData(){
        let getGameOperation = async () => {
            this.props.startLoading("Fetching games...");
            await axios.get(serverName + `get/allGames/names`,
                {
                    headers: {
                        "X-Auth-Token":this.props.security.token
                    }
                })
                .then(res => {
                    console.log("games: ");
                    console.log(res.data);
                    this.setState({gameNames: convertArrayToObject(res.data)});
                    this.props.stopLoading();
                })
                .catch(error => {
                    this.props.showNetworkErrorMessage(error,getGameOperation);
                });
        };
        await getGameOperation();
    }

    calculateTournamentType(maxPlayers){
        if(maxPlayers<=8){
            return "Local";
        }
        else if(maxPlayers<=16){
            return "Challenger";
        }
        else
            return "Master";
    }

    calculateHeight(inputsDisabled){
        return this.props.orientation === 'portrait'?
            this.props.height*0.80-225 : this.props.height*0.77-180;
    }

    render(){
        let height = this.calculateHeight(this.props.inputsDisabled);
        let maxPlayers = this.props.entity["tablesCount"]*this.props.entity["playersOnTableCount"];
        return(
            <View>
                <ScrollView
                    style={{height:height}}
                    contentContainerStyle={EntityPanelStyle.scrollView}>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Name:</Text></View>
                        <TextInput
                            value={this.props.entity["nameChange"]}
                            fieldName="nameChange"
                            changeEntity={this.props.changeEntity}
                            disabled = {this.props.inputsDisabled}
                            placeholder = "Tournament 2017"/>
                        <ValidationErrorMessage
                            validationErrorMessage={this.props.validationErrors["nameChange"]}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Tournament status:</Text></View>
                        <TextOutput
                            value={this.props.entity["status"].replace("_"," ")}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Game:</Text></View>
                        <SelectInput
                            value={this.props.entity["game"]}
                            fieldName="game"
                            changeEntity={this.props.changeEntity}
                            options={this.state.gameNames}
                            disabled = {this.props.inputsDisabled}/>
                        <ValidationErrorMessage
                            validationErrorMessage={this.props.validationErrors["game"]}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Tables count:</Text></View>
                        <NumberInput
                            value={this.props.entity["tablesCount"]}
                            fieldName="tablesCount"
                            changeEntity={this.props.changeEntity}
                            disabled = {this.props.inputsDisabled}
                            placeholder = "Tables count"/>
                        <ValidationErrorMessage
                            validationErrorMessage={this.props.validationErrors["tablesCount"]}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Type:</Text></View>
                        <SelectTournamentTypeInput
                            value={this.props.entity["playersOnTableCount"]}
                            fieldName="playersOnTableCount"
                            changeEntity={this.props.changeEntity}
                            options={type}
                            disabled = {this.props.inputsDisabled || this.props.mode === 'edit'}/>
                        <ValidationErrorMessage
                            validationErrorMessage={this.props.validationErrors["playersOnTableCount"]}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Turns count:</Text></View>
                        <NumberInput
                            value={this.props.entity["turnsCount"]}
                            fieldName="turnsCount"
                            changeEntity={this.props.changeEntity}
                            disabled = {this.props.inputsDisabled}/>
                        <ValidationErrorMessage
                            validationErrorMessage={this.props.validationErrors["turnsCount"]}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Max players:</Text></View>
                        <NumberOutput
                            value={maxPlayers}/>
                        <View style={EntityPanelStyle.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Tournament class:</Text></View>
                        <TextOutput
                            value={this.calculateTournamentType(maxPlayers)}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Start at:</Text></View>
                        <DateInput
                            value={this.props.entity["dateOfStart"]}
                            fieldName="dateOfStart"
                            changeEntity={this.props.changeEntity}
                            disabled = {this.props.inputsDisabled}/>
                        <ValidationErrorMessage
                            validationErrorMessage={this.props.validationErrors["dateOfStart"]}/>
                    </View>

                    <View style={InputStyles.inputCard}>
                        <View style={InputStyles.inputText}><Text style={[MainStyles.smallWhiteStyle, {fontWeight:'bold'}]}>Ends at:</Text></View>
                        <DateInput
                            value={this.props.entity["dateOfEnd"]}
                            fieldName="dateOfEnd"
                            changeEntity={this.props.changeEntity}
                            disabled = {this.props.inputsDisabled}/>
                        <ValidationErrorMessage
                            validationErrorMessage={this.props.validationErrors["dateOfEnd"]}/>
                    </View>

                </ScrollView>
                {
                    this.props.entity.canCurrentUserEdit ||
                    this.props.entity.status === 'IN_PROGRESS' ||
                    this.props.entity.status === 'FINISHED' &&
                    <Button title={"Progress"} color='#4b371b'
                            disabled={this.props.mode==='add'}
                            onPress={()=>{
                                this.props.navigate('Progress/'+this.props.entity["name"]);
                                this.props.disable();
                            }}/>
                }
            </View>
        );
    }
}

function mapDispatchToProps( dispatch ) {
    return bindActionCreators( ActionCreators, dispatch );
}

function mapStateToProps( state ) {
    return {
        security: state.security
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( BasicDataTab );