import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserMain from './containers/UserMain';
import UserHeader from './components/UserHeader';
import { actions as userActions, getOrders, getCurrentTab } from '../../redux/modules/user';
import { actions as loginActions } from '../../redux/modules/login';

export class User extends Component {

    componentDidMount() {
        this.props.userActions.loadOrders();
    }

    handleBack = () => {
        this.props.history.push('/');
    }

    handleLogout = () => {
        this.props.loginActions.logout();
    }

    render() {
        const { orders } = this.props;
        return (
            <div>
                <UserHeader 
                    onBack={this.handleBack}
                    onLogout={this.handleLogout}
                />
                <UserMain 
                    data={orders}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        orders: getOrders(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        loginActions: bindActionCreators(loginActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
