import React, { Component } from 'react';
import userMG               from '../../js/user.js';

class UpdateComponent extends Component {
    setValue(){
        document.getElementById('update-user-name-field')    .value  = this.props.data.name;
        document.getElementById('update-user-andress-field') .value  = this.props.data.andress;
        document.getElementById('update-user-phone-field')   .value  = this.props.data.number;
        document.getElementById('update-user-birtday-field') .value  = this.props.data.birthday;
        document.getElementById('update-user-gender-field')  .value  = this.props.data.gender;
        document.getElementById('update-user-language-field').value  = this.props.data.language;
        document.getElementById('update-user-status-field')  .value  = this.props.data.status;
    }

    update_handler(){
        const nameUpdated     = document.getElementById('update-user-name-field')    .value;
        const andressUpdated  = document.getElementById('update-user-andress-field') .value;
        const phoneUpdated    = document.getElementById('update-user-phone-field')   .value;
        const birtdayUpdated  = document.getElementById('update-user-birtday-field') .value;
        const genderUpdated   = document.getElementById('update-user-gender-field')  .value;
        const languageUpdated = document.getElementById('update-user-language-field').value;
        const statusUpdated   = document.getElementById('update-user-status-field')  .value;

        if(nameUpdated){
            const updateInfo = {
                name: nameUpdated, 
                andress: andressUpdated,
                phone: phoneUpdated,
                birthday: birtdayUpdated,
                gender: genderUpdated,
                language: languageUpdated,
                status: statusUpdated
            };

            userMG.updateClientInfo(updateInfo, result => {
                window.location.reload();
            })
        }else{
            alert(`Thông tin về tên không được bỏ trống !`);
        }
    }

    render() {
        return (
            <div className='update-user-info-group row'>
                <input 
                    type="text"
                    className="update-info-field"
                    id="update-user-name-field"
                    placeholder="Type user name here"
                    onChange={() => {return true}}/>
                <br />
                <input 
                    type="text"
                    className="update-info-field"
                    id="update-user-andress-field"
                    placeholder="Type user andress here"/>
                <br />
                <input 
                    type="number"
                    className="update-info-field"
                    id="update-user-phone-field"
                    placeholder="Type user phone here"/>
                <br />
                <input 
                    type="text"
                    className="update-info-field"
                    id="update-user-birtday-field"
                    placeholder="Type user birthday here"/>
                <br />
                <select 
                    name="update-info-gender-field" 
                    id="update-user-gender-field"
                    onChange={() => console.log(document.getElementById('update-user-gender-field').value)}>
                        <option value="Male">Male</option>    
                        <option value="Female">Female</option>    
                </select>
                <br />
                <input 
                    type="text"
                    className="update-info-field"
                    id="update-user-language-field"
                    placeholder="Type user name here"/>
                <br />
                <input 
                    type="text"
                    className="update-info-field"
                    id="update-user-status-field"
                    placeholder="Type your status here"/>
                <input 
                    type="button"
                    className="btn btn-primary"
                    value="Cancel"
                    onClick={() => this.props.backIndexScreen()}
                    style={{float: 'right'}}/>
                <input 
                    type="button" 
                    className="btn btn-danger"
                    value="Update"
                    onClick={() => this.update_handler()}
                    style={{float: 'right', marginRight: '10px'}}/>
            </div>
        );
    }

    componentDidMount() {
        this.setValue(); 
        console.log(document.getElementById('update-user-gender-field').value)   
    }
}

export default UpdateComponent;