import React, { Component } from 'react';

class UserItem extends Component {
    render() {
        return (
            <div 
                className="user-item row" 
                onClick={() => {console.log(this.props.data.name)}}>
                <div className="col-md-3 col-sm-3 col-xs-3 show-image">
                    <div className="child">
                        <img src={this.props.data.avatar} />
                    </div>
                </div>
                <div className="col-md-9 col-sm-9 col-xs-9 show-user-info">
                    <p className="show-name">{this.props.data.name}</p>
                    <p className="status">{this.props.data.status}</p>
                </div>
            </div>
        );
    }
}

export default UserItem;