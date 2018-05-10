import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import Index from "../compoents/indexCom"
import * as actions from "../actions/indexAction";
import Loading from "../common/Loading"

function mapStateToProps(state) {
    return {
        _i_data: state.indexReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

class indexCon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        console.log(this)
        this.props.actions.initPage()
    }

    render() {
        const {_i_data} = this.props;
        if (_i_data.isFetching) {
            return <Loading/>
        } else {
            return <Index hotwords={_i_data.hotwords} recwords={_i_data.recwords}/>
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(indexCon));
