import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    Button,
} from 'react-native';
import { Form,
    InputField,
    PickerField
} from 'react-native-form-generator';
import MainStyles from '../../../../Styles/MainStyles'
import {tournamentFields} from '../../../../Main/consts/fieldsOfObject'
import {kindOfSort} from '../../../../Main/consts/kindsOfSort'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../../../Redux/actions';

class FormDrawer extends Component {
    constructor(props) {
        super(props);
        console.log("debug");
        this.state = {
            pageFormData:{}
        }
    }

    componentWillMount(){
        let pageFormData = this.state.pageFormData;

        pageFormData.pageNumber = this.props.pageRequest.pageRequest.page+1;
        pageFormData.pageSize = this.props.pageRequest.pageRequest.size;
        pageFormData.sortField = this.props.pageRequest.pageRequest.property;
        pageFormData.sortType = this.props.pageRequest.pageRequest.direction;

        this.setState({pageFormData:pageFormData});
    }

    handlePageFormChanges(pageFormData){

        pageFormData.pageNumber = pageFormData.pageNumber===undefined?this.props.pageRequest.pageRequest.page+1:pageFormData.pageNumber;
        pageFormData.pageSize = pageFormData.pageSize===undefined?this.props.pageRequest.pageRequest.size:pageFormData.pageSize;
        pageFormData.sortField = pageFormData.sortField===undefined?this.props.pageRequest.pageRequest.property:pageFormData.sortField;
        pageFormData.sortType = pageFormData.sortType===undefined?this.props.pageRequest.pageRequest.direction:pageFormData.sortType;

        this.setState({pageFormData:pageFormData});
    }

    submitForm(){
        let pageNumber = parseInt(this.state.pageFormData.pageNumber)-1;
        let pageSize = parseInt(this.state.pageFormData.pageSize);
        let sortField = this.state.pageFormData.sortField;
        let sortType = this.state.pageFormData.sortType;

        let validationErrors = [];

        if(isNaN(pageNumber)){
            validationErrors.push("Page number must be numeric value");
        }
        else if(!(pageNumber<this.props.page.totalPages && pageNumber>=0))
        {
            validationErrors.push("Page "+this.state.pageFormData.pageNumber+" don't exist");
        }

        if(isNaN(pageSize)){
            validationErrors.push("Page size must be numeric value");
        }
        else if(!(pageSize<=10 && pageSize>=1))
        {
            validationErrors.push("Page size must be between 1 and 10");
        }

        if(!tournamentFields.hasOwnProperty(sortField))
        {
            validationErrors.push("Sort field has not valid value");
        }

        if(!kindOfSort.hasOwnProperty(sortType))
        {
            validationErrors.push("Sort type has not valid value");
        }

        if(validationErrors.length>0)
        {
            this.props.showFailMessageBox({
                messageText: validationErrors.join('\r\n')
            });
            this.props.onClosePanel();
        }
        else
        {
            let pageRequest=this.props.pageRequest;
            pageRequest.pageRequest.size=pageSize;
            pageRequest.pageRequest.page=pageNumber;
            pageRequest.pageRequest.property=sortField;
            pageRequest.pageRequest.direction=sortType;
            this.props.setPageRequest(pageRequest);

            this.props.getPageOfData();

            this.props.onClosePanel();
        }
    }

    render() {
        return (
            <View style={[MainStyles.contentStyle, MainStyles.centering]}>
                <ScrollView keyboardShouldPersistTaps='always' style={{paddingLeft:10,paddingRight:10}}>
                    <View>
                        <Text style={[MainStyles.textStyle, {fontSize: 26,}]}>Get Tournaments Page</Text>
                    </View>
                    <Form
                        ref='pageFormData'
                        onChange={(pageFormData) => {this.handlePageFormChanges(pageFormData)}}>
                        <InputField
                            ref="pageNumber"
                            value={this.state.pageFormData.pageNumber.toString()}
                            keyboardType = 'numeric'
                            placeholder='Page number'
                        />
                        <InputField
                            ref="pageSize"
                            value={this.state.pageFormData.pageSize.toString()}
                            keyboardType = 'numeric'
                            placeholder='Page size'
                        />
                        <PickerField
                            ref="sortField"
                            value={this.state.pageFormData.sortField}
                            label='Sort by field'
                            options={tournamentFields}/>
                        <PickerField
                            ref="sortType"
                            value={this.state.pageFormData.sortType}
                            label='Sort type'
                            options={kindOfSort}/>
                        <Button title="Get page"  color='#4b371b' onPress={this.submitForm.bind(this)}/>
                    </Form>
                </ScrollView>
            </View>
        );
    }
}


function mapDispatchToProps( dispatch ) {
    return bindActionCreators( ActionCreators, dispatch );
}

function mapStateToProps( state ) {
    return {
        page: state.page,
        pageRequest: state.pageRequest,
        message: state.message
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( FormDrawer );


