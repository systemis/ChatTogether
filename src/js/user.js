import $                    from 'jquery';
import socketMG             from './socket.js';

class userMG {
    register(name, email, password, fn){
        $.ajax({
            url: '/sign-up', type: 'POST', data: {name: name, email: email, password: password},
            success: data => {
                fn(data.err, data.message);
            },

            error: err => fn(true, err)
        })
    }


    getClientInfo(fn){
        $.ajax({
            url: `/get/client-info`, type: `POST`,
            success: data => {
                switch(data){
                    case `NOT_LOGIN`:
                        return fn(true, "Chua dang nhap");
                    case `ERROR`: 
                        return fn(true, "Co loi xay ra");
                    default :
                        return fn(false, data);
                }
            }, error: err => fn(true, "Co loi xay ra")
        })
    }

    getUserInfo(id, fn){
        $.ajax({
            url: `/get/user-info/:${id}`, type: 'POST', 
            success: data => {
                switch(data.result){
                    case "NOT_REGISTER":
                        return fn(false, "Tai khoan khong ton tai");
                    case "ERROR":
                        return fn(true, "Co loi xay ra");
                    default:
                        return fn(false, data);
                }
            }, error: err => fn(true, "Co loi xay ra")
        })
    }

    searchUser(key, fn){
        $.ajax({
            url: `/find/users-by-name/${key}`, type: `POST`,
            success: data => {
                console.log(`Error when search user by username ${data.err}`);
                console.log(data.result);
                
                return fn(data.err, data.result);
            },
            error: err => fn(err, null)
        })
    }

    disConnect(userId){
        console.log(`Client id: ${userId}`);
        console.log(`You're logouting server`);
        $.ajax({
            url: `/logout`, type: `GET`, 
            success: data => {
                socketMG.disConnect(userId);

                window.location.href = '/sign-in';
            }
        })
    }

    getUserLists(clientId, fn){
        $.ajax({
            url: `/get/users/list/${clientId}`, type: `POST`,
            success: data => {
                console.log(data);

                fn(data.err, data.result);
            },
            error: fn(null, [])
        })
    }

    addFriend(clientId, friendId){
        $.ajax({
            url: `/add/friend`, type: `POST`, data: {clientId, friendId},
            success: data => {
                console.log(`Add friend is ${JSON.stringify(data)}`);
            },
            error: err => console.log(`Add friend fault `)
        })
    }
}

export default new userMG();