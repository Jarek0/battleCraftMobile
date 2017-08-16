import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    Button,
} from 'react-native';
import Drawer from 'react-native-drawer'
import FormDrawer from '../../SearchPanel/Game/FormDrawer'
import MainStyles from '../../../../Styles/MainStyles'
import TableStyles from '../../../../Styles/TableStyles'
import DrawerStyles from '../../../../Styles/DrawerStyles'
import Checkbox from '../../../Common/checkBox/Checkbox'
import MultiCheckbox from '../../../Common/checkBox/MultiCheckbox'
import PanelOptions from '../../PanelOptions/Tournaments/PanelOptions'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../../../Redux/actions';

import {serverName} from '../../../../Main/consts/serverName'

import dateFormat from 'dateformat';

class ListScreen extends Component {

    constructor(props) {
        super(props);

        this.closeControlPanel = this.closeControlPanel.bind(this);
        this.openControlPanel = this.openControlPanel.bind(this);
        this.renderRow = this.renderRow.bind(this);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            dataSource: ds.cloneWithRows(['Placeholder']),
            optionsVisible: false
        };
    }

    componentDidMount(){
        this.getPageOfData();
    }

    getPageOfData(){
        fetch(serverName+`page/tournaments`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.props.pageRequest)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.props.setPage(responseJson);
            })
            .catch(error => {
                this.props.showNetworkErrorMessageBox(error);
            });
    }

    changeVisibilityOptionsModal(isVisible){
        this.setState({optionsVisible:isVisible});
    }

    renderRow(rowData) {
        return (
            <View style={[TableStyles.row]}>
                <View style={[TableStyles.sectionHeader]}>
                    <Text style={[MainStyles.smallWhiteStyle, {fontSize: 24}]}> {rowData.name}</Text>
                    <Checkbox name={rowData.name}/>
                </View>
                <View style={[TableStyles.row]}>
                    <Text style={[MainStyles.smallWhiteStyle]}> province: {rowData.province}</Text>
                </View>
                <View style={[TableStyles.row]}>
                    <Text style={[MainStyles.smallWhiteStyle]}> city: {rowData.city}</Text>
                </View>
                <View style={[TableStyles.row]}>
                    <Text style={[MainStyles.smallWhiteStyle]}> game: {rowData.game}</Text>
                </View>
                <View style={[TableStyles.row]}>
                    <Text style={[MainStyles.smallWhiteStyle]}> players: {rowData.playersNumber}/{rowData.maxPlayers}</Text>
                </View>
                <View style={[TableStyles.row]}>
                    <Text style={[MainStyles.smallWhiteStyle]}> date: {dateFormat(rowData.dateOfStart,"dd-MM-yyyy hh:mm")}</Text>
                </View>
            </View>);
    }

    closeControlPanel(){
        this._drawer.close()
    }
    openControlPanel(){
        this._drawer.open()
    }

    render() {

        return (

            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                styles={DrawerStyles}
                closedDrawerOffset={0}
                tweenHandler={(ratio) => ({main: { opacity:(2-ratio)/2 }})}

                content={<FormDrawer onClosePanel={this.closeControlPanel}/>}
            >
                <View style={[MainStyles.contentStyle, MainStyles.centering, {flex: 1}]}>
                    <Button title="Open filters tab" color='#4b371b' onPress={()=>this.openControlPanel()}/>

                    <ListView styles={TableStyles.table}
                              dataSource={this.state.dataSource.cloneWithRows(this.props.page.content)}
                              renderHeader={(headerData) => <View style={TableStyles.header}>
                                  <Text style={MainStyles.bigWhiteStyle}>Tournaments List</Text>
                                  <MultiCheckbox/>
                              </View>}
                              renderRow={this.renderRow}/>
                    <Button title={"Options"} color='#4b371b' onPress={()=>this.setState({optionsVisible:true})}/>
                </View>
                <PanelOptions
                    changeVisibility={this.changeVisibilityOptionsModal.bind(this)}
                    isVisible={this.state.optionsVisible}
                    getPage={this.getPageOfData.bind(this)}
                />
            </Drawer>
        );
    }
};

function mapDispatchToProps( dispatch ) {
    return bindActionCreators( ActionCreators, dispatch );
}

function mapStateToProps( state ) {
    return {
        page: state.page,
        pageRequest: state.pageRequest,
        message: state.message,
        confirmation: state.confirmation
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( ListScreen );