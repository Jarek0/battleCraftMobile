import React, { Component } from 'react';
import {
    View,
    Button,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../redux/actions';

import {serverName} from "../../main/consts/serverName";
import axios from 'axios';

import MainStyles from '../../Styles/UniversalStyles/MainStyles'
import DrawerStyles from '../../Styles/CollectionPanelStyles/DrawerStyles'
import BaseColours from 'battleCraftMobile/App/main/consts/BaseColours'

import Drawer from 'react-native-drawer'

import SearchDrawer from './searchPanel/SearchPanel'
import PageDrawer from './pagePanel/PagePanel'
import PanelOptions from './optionPanel/OptionPanel'
import CollectionList from './table/CollectionList'

import possibleOperationsForCollections from "../../main/functions/possibleOperationsForCollections";
import compareArrays from "../../main/functions/compareArrays";

import OpenOperationsButton from "./buttons/OpenOperationsButton";
import InviteButton from "./buttons/InviteButton";
import CancelInviteButton from "./buttons/CancelInviteButton";

const drawerMap = {
    'page':PageDrawer,
    'search':SearchDrawer
};

class CollectionPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collectionType:"tournaments",
            formDrawer: "",
            optionsVisible: false,
            isFiltered: false,
        }
    }

    async componentDidMount() {
        console.log(this.props.entityPanel.mode );
        if (this.props.entityPanel.mode !== 'disabled') {
            await this.setState({collectionType: this.props.collectionType});
            this.createPageRequestForEntityPanel(this.props.entityPanel.relatedEntity.relatedEntityCriteria);
            this.setElementsToCheckForEntityPanel(this.props.entityPanel.relatedEntity.relatedEntities);
            await this.getPage(this.state.collectionType);
        }
        else{
            this.setState({isFiltered:false});
            this.setPossibleOperations(this.props.collectionType);
            this.createPageRequest(this.props.collectionType);
            await this.setState({collectionType: this.props.collectionType});
            await this.getPage(this.props.collectionType);
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.entityPanel.hidden === true &&
            this.props.entityPanel.hidden === false &&
            nextProps.entityPanel.mode !== 'disabled') {
            await this.setState({collectionType: nextProps.collectionType});
            this.createPageRequestForEntityPanel(nextProps.entityPanel.relatedEntity.relatedEntityCriteria);
            this.setElementsToCheckForEntityPanel(nextProps.entityPanel.relatedEntity.relatedEntities);
            await this.getPage(this.state.collectionType);
        }
        else if (nextProps.collectionType !== this.state.collectionType ||
            (nextProps.entityPanel.hidden === false &&
                this.props.entityPanel.hidden === true &&
                this.props.entityPanel.mode !== 'disabled')) {
            this.setState({isFiltered:false});
            this.createPageRequest(nextProps.collectionType);
            this.setPossibleOperations(nextProps.collectionType);
            await this.setState({collectionType: nextProps.collectionType});
            await this.getPage(this.state.collectionType);
        }
    }

    setElementsToCheckForEntityPanel(relatedEntities){
        if(this.props.entityPanel.relatedEntity.relatedEntityType==="participatedTournaments"){
            let relatedEntitiesNames = relatedEntities.map(
                relatedEntity => relatedEntity.name
            );
            this.props.setElementsToCheck(relatedEntitiesNames);
        }
        else{
            this.props.setElementsToCheck(relatedEntities);
        }
    }

    createPageRequestForEntityPanel(relatedEntityCriteria){
        this.props.setPageRequest({
            searchCriteria:relatedEntityCriteria,
            pageRequest:{
                direction : "ASC",
                property : "name",
                size : 10,
                page : 0
            }
        });
    }

    createPageRequest(collectionType){
        if(collectionType==='ranking') {
            this.props.setPageRequest({
                searchCriteria:[{
                    "keys": ["tour", "tournament", "game","name"],
                    "operation":":",
                    "value":["Warhammer"]
                }],
                pageRequest:{
                    direction : "DESC",
                    property : "points",
                    size : 10,
                    page : 0
                }
            });
        }
        else {
            this.props.setPageRequest({
                searchCriteria:[],
                pageRequest:{
                    direction : "ASC",
                    property : "name",
                    size : 10,
                    page : 0
                }
            });
        }
    }

    setPossibleOperations(collectionType){
        this.props.setOperations(possibleOperationsForCollections(collectionType,this.props.security.role))
    }

    async getPage(collectionType){
        console.log("page request:");
        console.log(this.props.pageRequest);
        let getPageOfDataOperation=async () => {
            this.props.startLoading("Fetching page of data...");
            await axios.post(serverName+`page/`+collectionType,this.props.pageRequest,
                {
                    headers: {
                        "X-Auth-Token":this.props.security.token
                    }
                })
                .then(async (res) => {
                    console.log("page of data:");
                    console.log(res.data);
                    this.props.checkPreviouslyCheckedElements(res.data);
                    this.props.setPageRequest({
                        searchCriteria:this.props.pageRequest.searchCriteria,
                        pageRequest:{
                            direction : this.props.pageRequest.pageRequest.direction,
                            property : this.props.pageRequest.pageRequest.property,
                            size : this.props.page.numberOfElements,
                            page : this.props.page.number
                        }
                    });
                    this.props.stopLoading();
                })
                .catch(async (error) => {
                    this.props.stopLoading();

                    this.props.setEmptyPage();
                    this.props.showNetworkErrorMessage(error,getPageOfDataOperation);
                    this.props.setPageRequest({
                        searchCriteria:this.props.pageRequest.searchCriteria,
                        pageRequest:{
                            direction : this.props.pageRequest.pageRequest.direction,
                            property : this.props.pageRequest.pageRequest.property,
                            size : 0,
                            page : 0
                        }
                    });

                });
        };
        await getPageOfDataOperation();
    }

    createDrawer(){
        let formDrawer = <View/>;
        if(this.state.formDrawer!=='')
            formDrawer = React.createElement(
                drawerMap[this.state.formDrawer],
                {
                    getPage:this.getPage.bind(this),
                    collectionType:this.props.collectionType,
                    onClosePanel:() => {this._drawer.close()},
                    changeFilterColour:(value) => this.setState({isFiltered: value})
                },
                null
            );
        return formDrawer;
    }


    createButtons(){
        let buttons = [];
        if(compareArrays(this.props.possibleOperations,["Invite"])){
            buttons = [
                <InviteButton key="invite"/>,
                <CancelInviteButton key="cancelInvite"/>
            ]
        }
        else if(this.props.collectionType!=='ranking' && this.props.security.role!=="") {
            buttons.push(<OpenOperationsButton key="openOperations" action={() => this.setState({optionsVisible:true})}/>);
        }
        return buttons;
    }


    render(){
        let formDrawer = this.createDrawer();
        let buttons = this.createButtons();

        return(<Drawer
            ref={(ref) => this._drawer = ref}
            type="overlay"
            tapToClose={true}
            openDrawerOffset={0.2}
            panCloseMask={0.2}
            styles={DrawerStyles}
            closedDrawerOffset={0}
            tweenHandler={(ratio) => ({main: { opacity:(2-ratio)/2 }})}
            content={formDrawer}
        >
            <View style={[MainStyles.contentStyle]}>
                <View style={{marginBottom:3, flexDirection:'row'}}>
                    <View style={{flex:1, marginRight: 3}}>
                        <Button title="Open page tab" color='#4b371b'
                                onPress={()=>{
                                    this.props.playSound('toggle');
                                    this.setState({formDrawer:'page'});
                                    this._drawer.open()}}/>
                    </View>
                    <View style={{flex:1}}>
                        <Button title="Open search tab" color={this.state.isFiltered?BaseColours.border.bottom:BaseColours.background.darkBrown}
                                onPress={()=>{
                                    this.props.playSound('toggle');
                                    this.setState({formDrawer:'search'});
                                    this._drawer.open()}}/>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <View style={[DrawerStyles.pageWindow, MainStyles.borderStyle]}>
                        <Button
                            title={(this.props.pageRequest.pageRequest.page+1) +"/"+
                            (this.props.page.totalPages===undefined?0:this.props.page.totalPages)}
                            color='#721515'
                            onPress={() => {}}
                        />
                    </View>
                    <CollectionList getPage={this.getPage.bind(this)}
                                    collectionType={this.props.collectionType}/>
                </View>
                <View style={MainStyles.buttonsPanelStyle}>
                    {buttons}
                </View>
            </View>
            <PanelOptions
                collectionType={this.props.collectionType}
                onClosePanel={(isVisible) => this.setState({optionsVisible:isVisible})}
                isVisible={this.state.optionsVisible}/>
        </Drawer>)
    }
}

function mapDispatchToProps( dispatch ) {
    return bindActionCreators( ActionCreators, dispatch );
}

function mapStateToProps( state ) {
    return {
        page: state.page,
        pageRequest: state.pageRequest,
        entityPanel: state.entityPanel,
        possibleOperations: state.possibleOperations,
        security: state.security
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( CollectionPanel );