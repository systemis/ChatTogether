import React, { Component } from 'react';
import {connect}            from 'react-redux';
import $                    from 'jquery';
import SearchGroup          from './search-group.js';
import SearchView           from './search-view.js';
import UsersView            from './users-view';
import userMG               from '../../js/user.js';

// Image for test ui 
import avatar1              from '../../Image/test_avatar_men.jpg';
import avatar2              from '../../Image/test_avatar_women.jpg';
import './Style/navigation-style.css';

const ProgressBar = (props) => {
    return(
        <h3 
            className="progessbar" 
            style={{textAlign: 'center'}}> 
                Loading... 
        </h3>
    )
}   

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: [{id: '0920', avatar: avatar1, name: 'Jobs', status: 'Hello'}],
            searchUser: [],
            isSearching: false,
            doneSearching: false
        }

        // Backend API 
        this.searchEvent = this.searchEvent.bind(this);
    }

    searchEvent(value){
        const searchValue = value;
        if(value){
            this.setState({isSearching: true})
            this.setState({doneSearching: false});
            var result = [];

            userMG.searchUser(value, (err, _result) => {
                if(err) {
                    alert(`Have some error, try again`);
                    result = [];
                }else{
                    result = _result;
                }

                this.setState({searchUser: result});
                this.setState({doneSearching: true});
            })
        }else{
            this.setState({isSearching: false})
        }
    }

    LeftNavi(){
        if(this.props.screenVersion === 'desktop'){
            return (
                <div id="left-navi">
                    <p>
                        <i className="fa fa-bars" 
                           aria-hidden="true" 
                           id="show-hiden-main-navi-btn"></i>
                    </p>
                </div>
            )
        }
        return ;
    }

    mainLayout(){
        if(this.state.isSearching){
            if(this.state.doneSearching){
                if(this.state.searchUser.length > 0){
                    return <SearchView data={this.state.searchUser}/>
                }else{
                    return <h3 style={{textAlign: 'center'}}> Not data </h3>
                }
            }else{
                return <ProgressBar />
            }
        }else{
            if(!this.props.usersList) return <ProgressBar />
            if(this.props.usersList.length > 0){
                return <UsersView data={this.props.usersList}/>
            }

            if(this.props.usersList.length <= 0){
                return <h2 style={{textAlign: 'center'}}>
                        Find people in top </h2>
            }
        }
    }

    render() {
        const bigGroupClassName = () => {
            if(this.props.screenVersion === 'desktop'){
                return 'desktop';
            }
            return '';}
        const childGroupClassName = () => {
            if(this.props.screenVersion === 'desktop'){
                return 'desktop';
            }
            return "";}
        return (
            <div className={bigGroupClassName()} id="navigation-show-user-online">
                <div className="row">
                    {this.LeftNavi()}
                    <div className={childGroupClassName()} id="navigation-show-user-online-main-navi">
                        <SearchGroup searchEvent={this.searchEvent} />
                        {this.mainLayout()}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        $(document).ready(() => {
            $("#show-hiden-main-navi-btn").click(function(){
                if($("#navigation-show-user-online-main-navi").hasClass('hiden')){
                    $("#navigation-show-user-online").css({width: '25%'});
                    $("#chat-group").css({width: '50%'});
                    $("#left-navi").css({width: '10%'})
                }else{
                    $("#navigation-show-user-online").css({width: '3%'});
                    $("#chat-group").css({width: '72%'});
                    $("#left-navi").css({width: '100%'})
                };
                $("#navigation-show-user-online-main-navi").toggleClass('hiden')
            })
        })
    }
}

export default connect((state) => {
    return {
        screenVersion: state.screenVersion, 
        usersList: state.usersList
    }
})(Navigation);