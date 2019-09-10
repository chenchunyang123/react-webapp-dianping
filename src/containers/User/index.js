import React, { Component } from 'react';
import UserMain from './components/UserMain';
import UserHeader from './components/UserHeader';

export class User extends Component {

    handleBack = () => {

    }

    handleLogout = () => {

    }

    render() {
        return (
            <div>
                <UserHeader 
                    onBack={this.handleBack}
                    onLogout={this.handleLogout}
                />
                <UserMain />
            </div>
        );
    }
}

export default User;
