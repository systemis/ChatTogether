const connection = require('../config/database.js');
const tableName  = "UserData";
class UserMD {
    constructor(){
        connection.query("CREATE TABLE IF NOT EXISTS `UserData` ( `id` VARCHAR(200) NOT NULL , `name` TEXT NOT NULL , `email` TEXT NOT NULL , `password` TEXT NULL , `andress` TEXT NULL , `phone` TEXT NULL , `birthday` TEXT NULL , `gender` TEXT NULL , `language` TEXT NULL , `avatar` TEXT NULL , `rooms_request` TEXT NULL , `friends` TEXT NULL , `status` TEXT NULL , `notifications` TEXT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci", (err, result) => {
            if(err) {
                console.log(err);
                return console.log("Create user table fail");
            }

            return console.log("Create user table success");
        })
    }

    newUser(bundle, fn){
        var b = true;
        do{
            bundle.id = Math.random().toString().replace(".", "");
            this.checkAlreadyExistsId(bundle.id, bool => {
                if(bool){
                    this.checkAlreadyExistsEmail(bundle.email, rs => {
                        bundle.rooms_request = JSON.stringify([]);
                        bundle.friends       = JSON.stringify([]);
                        bundle.notifications = JSON.stringify([]);
                        if(bundle.avatar === null || !bundle.avatar){
                            bundle.avatar = 'https://www.ihh.org.tr/resource/svg/user-shape.svg';
                        }

                        if(rs){
                            connection.query("INSERT INTO " + tableName + " SET ?", bundle, (err, result, field) => {
                                if(err){
                                    return fn(true, err, null);
                                }

                                fn(false, "success", bundle);
                            })
                        }else{
                            fn(true, "exists", null);
                        }
                    })
                }else{
                    b = bool;
                }
            })
        }while(b === false);
    }

    findUserById(id, fn){
        connection.query(`SELECT * FROM ${tableName} WHERE id = ?`,[id], (err, result) => {
            if(err) return fn(true, JSON.stringify(err));
            if(result.length < 0) return fn(false, "NOT_REGISTER");

            return fn(false, result[0]);
        })
    }

    findUserByEmail(email, fn){
        connection.query(`SELECT * FROM ${tableName}`, (err, result) => {
            result.map((item, index) => {
                if(item.email === email){
                    return fn(false, item)
                }
            })
        })
    }

    addToRomsRequest(userId, roomId, fn){
        connection.query(`SELECT * FROM ${tableName} WHERE id = ?`, [userId], (err, result) => {
            if(err){
                return fn(err, "");
            }

            if(result.length <= 0) return fn("Error", "");

            var rooms_requested = JSON.parse(result[0].rooms_request);

            if(rooms_requested.indexOf(roomId) < 0){
                rooms_requested.push(roomId);
                rooms_requested     = JSON.stringify(rooms_requested);
                connection.query(`UPDATE ${tableName} SET rooms_request = ? WHERE id = ?`, [rooms_requested, userId], (er, rs) => {
                    if(er) {
                        return fn(er, "");
                    }
                    
                    return fn(null, "success");
                })
            }else{
                return fn(null, 'success');
            } 
        })
    }

    addFriend(userId, friendId, fn){
        this.findUserById(userId, (err, result) => {
            if(!err && result !== 'NOT_REGISTER'){
                var friends = JSON.parse(result.friends);
                if(friends.indexOf(friendId) < 0){
                    friends.push(friendId);
                }

                friends = JSON.stringify(friends);

                connection.query(`UPDATE ${tableName} SET friends = ? WHERE id = ?`, [friends, userId], (err, result) => {
                    return fn(null, 'success');
                })
            }
        })
    }

    checkLogin(email, password, fn){
        connection.query("SELECT * FROM " + tableName + " WHERE email = ?", [email], (err, result, field) => {
            if(err) {
                return fn(true, JSON.stringify(result));
            }

            if(result.length > 0){
                if(password === result[0].password){
                    return fn(true, "OK", result[0]);
                }else{
                    return fn(true, "CORRECT", null);
                }
            }else{
                return fn(true, "NOT_REGISTER", null);
            }
        })
    }

    checkAlreadyExistsEmail(email, fn){
        connection.query("SELECT * FROM " + tableName, (err, result) => {
            var rs = true;
            if(err){
                return console.log(err);
            }

            for(var i = 0; i < result.length; i++){
                if(result[i].email === email){
                    rs = false;
                }
            }

            return fn(rs);
        })
    }

    checkAlreadyExistsId(id, fn){
        connection.query("SELECT * FROM " + tableName, (err, result) => {
            var rs = true;
            if(err){
                return console.log(err);
            }

            for(var i = 0; i < result.length; i++){
                if(result[i].id === id){
                    rs = false;
                }
            }

            return fn(rs);
        })
    }

    getUserlist(fn){
        connection.query(`SELECT * FROM ${tableName} `, (err, result) => {
            if(err){
                return fn(true, "");
            }

            return fn(false, result);
        })
    }

    getRoomsRequested(userId, fn){
        this.findUserById(userId, (err, result) => {
            if(err) return fn(err, null);
            if(result === 'NOT_REGISTER') return fn( "NOT_REGISTER", null);

            result.rooms_request = JSON.parse(result.rooms_request);
            return fn(null, result.rooms_request);
        })
    }

    getFriends(userId, fn){
        this.findUserById(userId, (err, result) => {
            if(!err && result !== 'NOT_REGISTER'){
                return fn(null, JSON.parse(result.friends));
            }else{
                return fn("Error", null);
            }
        })
    }

    updateUserInfo(userId, bundle, fn){
        connection.query(`UPDATE ${tableName} SET name = ?, andress = ?, phone = ?, birthday = ?, gender = ?, language = ?, status = ? WHERE id = ?`, 
        [bundle.name, bundle.andress, bundle.phone, bundle.birthday, bundle.gender, bundle.language, bundle.status, userId], 
        (err, result) => {
            if(err){
                console.log(err);
                return fn(err, null);
            }

            return fn(null, 'success');
        })
    }

    updateAvatar(userId, imgLink, fn){
        connection.query(`UPDATE ${tableName} SET avatar = ? WHERE id = ?`, [imgLink, userId], (err, result) => {
            if (err )return fn(err, null);

            return fn(null, 'success');
        })
    }

    getNotifications(userId, fn){
        this.findUserById(userId, (err, result) => {
            if(err || result === 'NOT_REGISTER') return fn("error", null);

            return fn(null, JSON.parse(result.notifications));
        })
    }

    addNotification(userId, notifi, fn){
        this.findUserById(userId, (err, result) => {
            if(err || result === 'NOT_REGISTER') return fn(err, null);

            var notifications = JSON.parse(result.notifications);
            var checkAlreadyExistsId = id => {
                var bool = false;
                for(var i = 0; i < notifications.length; i++){
                    if(notifications[i].id === parseInt(id)){
                        bool = true;
                    }
                }

                return bool;
            }
            
            do{
                notifi.id = Math.floor((Math.random() * 1000) + 1).toString();
            }while(checkAlreadyExistsId(notifi.id))

            notifications.push(notifi);
            notifications = JSON.stringify(notifications);

            connection.query(`UPDATE ${tableName} SET notifications = ? WHERE id = ?`, [notifications, userId], (error, rs) => {
                if(error) return fn(true, null);

                return fn(null, 'success');
            })
        })
    }

    rvNotification(userId, sendId, fn){
        this.findUserById(userId, (err, rs) => {
            if(err || rs === 'NOT_REGISTER') return fn(true, null);
            if(userId === sendId) return fn('equals', null);
            var notifications = JSON.parse(rs.notifications);
            var updateNotifs  = [];
            
            for(var i = 0; i < notifications.length; i ++){
                if(notifications[i].message.sendId !== sendId){
                    updateNotifs.push(notifications[i]);
                }

                if(i === notifications.length - 1){
                    updateNotifs = JSON.stringify(updateNotifs);
                    connection.query(`UPDATE ${tableName} SET notifications = ? WHERE id = ?`, [updateNotifs, userId], (error, result) => {
                        if(error) return fn(true, null);
                        return fn(null, 'success');
                    })
                }
            }
        })
    }

    dropTable(fn){
        connection.query("DROP TABLE " + tableName, (err, result) => {
            if(err){
                console.log("Drop table fautl");
                return fn(err, 'err');
            }

            return fn(null, 'success');
        })
    }
}

module.exports = new UserMD();