import React, { Component } from 'react';
import {
    View,
    Button,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../Redux/actions';

import {serverName} from "../../Main/consts/serverName";

import axios from 'axios';

import MainStyles from '../../Styles/MainStyles'
import DrawerStyles from '../../Styles/DrawerStyles'

import Drawer from 'react-native-drawer'

import SearchDrawer from './SearchPanel/SearchPanel'
import PageDrawer from './PagePanel/PageDrawer'
import PanelOptions from './PanelOptions/PanelOptions'
import PanelAdd from './PanelAdd/PanelAdd'
import CollectionList from './Table/CollectionList'

class CollectionPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collectionType:"tournaments",
            formDrawer: "",
            optionsVisible: false,
            addVisible: false
        }
    }

    getRankingRequest(pageRequest){
        pageRequest.pageRequest.direction = "DESC";
        pageRequest.pageRequest.property = "points";
        pageRequest.searchCriteria = [];
        pageRequest.searchCriteria.push(
            {
                "keys": ["tour", "tournament", "game","name"],
                "operation":":",
                "value":"Warhammer"
            }
        );
    }

    async componentDidMount() {
        if(this.props.collectionType==='ranking'){
            let pageRequest = this.props.pageRequest;
            this.getRankingRequest(pageRequest);
            this.props.setPageRequest(pageRequest);
        }
        this.setState({collectionType: this.props.collectionType});
        await this.getPageRequest(this.props.collectionType);
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.collectionType !== undefined &&
            nextProps.collectionType !== this.props.collectionType) {
            this.setState({formDrawer:""})
            this.setState({collectionType: nextProps.collectionType});

            let pageRequest = this.props.pageRequest;
            pageRequest.pageRequest.page = 0;
            pageRequest.pageRequest.size = 10;
            if(nextProps.collectionType==='ranking'){
                this.getRankingRequest(pageRequest);
            }
            else{
                pageRequest.pageRequest.direction = "ASC";
                pageRequest.pageRequest.property = "name";
                pageRequest.searchCriteria = [];
            }
            this.props.setPageRequest(pageRequest);
            await this.getPageRequest(nextProps.collectionType);

        }
    }

    async getPageRequest(collectionType){
        console.log(this.props.pageRequest);
        let getPageOfDataOperation=async () => {
            this.props.startLoading("Fetching page of data...");
            await axios.post(serverName+`page/`+collectionType,this.props.pageRequest)
                .then(async (res) => {
                    await this.props.setPage(res.data);

                    let pageRequest = this.props.pageRequest;
                    pageRequest.pageRequest.page=this.props.page.number;
                    pageRequest.pageRequest.size=this.props.page.numberOfElements;
                    this.props.setPageRequest(pageRequest);
                    this.props.stopLoading();
                })
                .catch(async (error) => {
                    this.props.stopLoading();
                    await this.props.showErrorMessageBox(error,getPageOfDataOperation);
                });
        };
        await getPageOfDataOperation();
    }

    createDrawer(){
        let formDrawer = <View/>;
        if(this.state.formDrawer==='page')
            formDrawer = React.createElement(
                PageDrawer,
                {
                    getPage:this.getPageRequest.bind(this),
                    collectionType:this.props.collectionType,
                    onClosePanel:() => this._drawer.close()
                },
                null
            );
        else if(this.state.formDrawer==='search')
            formDrawer = React.createElement(
                SearchDrawer,
                {
                    getPage:this.getPageRequest.bind(this),
                    collectionType:this.props.collectionType,
                    onClosePanel:() => this._drawer.close()
                },
                null
            );
        return formDrawer;
    }

    createOptionsButton(){
        let optionsButton = <View/>;
        if(this.props.collectionType!=='ranking'){
            optionsButton = <View style={{flex:1, marginRight: 3}}><Button title={"Options"} color='#4b371b' onPress={()=>this.setState({optionsVisible:true})}/></View>;
        }
        return optionsButton;
    }

    createAddElementButton(){
        let addButton = <View/>;
        if(this.props.collectionType!=='ranking'&&this.props.collectionType!=='users'){
            addButton = <View style={{flex:1}}><Button title={"Add "+this.props.collectionType.slice(0, -1)} color='#4b371b' onPress={()=>this.setState({addVisible:true})}/></View>;
        }
        return addButton;
    }


    render(){
        let formDrawer = this.createDrawer();
        let optionsButton = this.createOptionsButton();
        let addElementButton = this.createAddElementButton();

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
            <View style={[MainStyles.contentStyle, MainStyles.centering, {flex: 1}]}>
                <View style={{marginBottom:3, flexDirection:'row'}}>
                    <View style={{flex:1, marginRight: 3}}>
                        <Button title="Open page tab" color='#4b371b'
                                onPress={()=>{
                                    this.setState({formDrawer:'page'});
                                    this._drawer.open()}}/>
                    </View>
                    <View style={{flex:1}}>
                        <Button title="Open search tab" color='#4b371b'
                                onPress={()=>{
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
                    <CollectionList getPage={this.getPageRequest.bind(this)}
                                    collectionType={this.props.collectionType}/>
                </View>
                <View style={{marginTop:3, flexDirection:'row'}}>
                    {optionsButton}
                    {addElementButton}
                </View>
            </View>
            <PanelOptions
                collectionType={this.props.collectionType}
                onClosePanel={(isVisible) => this.setState({optionsVisible:isVisible})}
                isVisible={this.state.optionsVisible}/>
            <PanelAdd
                onClosePanel={(isVisible) => this.setState({addVisible:isVisible})}
                isVisible={this.state.addVisible}
                collectionType={this.state.collectionType}
                action="Add"/>
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
        message: state.message,
        loading: state.loading
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( CollectionPanel );