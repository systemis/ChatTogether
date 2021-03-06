const connection = require('../config/database.js');
const tablename  = `RoomsData`;
class RomMD{
    constructor(){
        connection.query("CREATE TABLE IF NOT EXISTS `RoomsData` ( `id` VARCHAR(200) NOT NULL , `users` TEXT NOT NULL , `messages` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci", (err, reult) => {
            if(err) {
                console.log(err);
                return console.log(`Create table ${tablename} failure`);
            }
            
            console.log(`Create table ${tablename} success`);
        })
    }

    newRoom(bundle, fn){
        bundle.messages = JSON.stringify([]);
        bundle.id       = bundle.id.toString();
        connection.query(`INSERT INTO ${tablename} SET ?`, bundle, (err, result) => {
            if(err){
                return fn(err, "");
            } 
            
            return fn(null, result);
        })
    }

    addMessage(id, message, fn){
        this.findChatRoomById(id, (err, result) => {
            if(err) return fn(err, "");
            var messages = result.messages;
            messages.push(message);
            messages = JSON.stringify(messages);
            connection.query(`UPDATE ${tablename} SET messages = ? WHERE id = ?`, [messages, id], (er, rs) => {
                if(er) {
                    console.log(er);
                    return fn(er, "");
                }

                return fn(null, JSON.parse(messages));
            })
        })
    }

    updateRd(chatRoomId, fn){
        this.findChatRoomById(chatRoomId, (error, result) => {
            if(error) return fn(error, null);

            var messages = result.messages;
            for(var i = 0; i < messages.length; i++){
                messages[i].rd = true;
            }

            messages = JSON.stringify(messages);
            connection.query(`UPDATE ${tablename} SET messages = ? WHERE id = ?`, [messages, chatRoomId], (er, rs) => {
                if(er) return fn(er, "");

                return fn(null, JSON.parse(messages));
            })
        })
    }

    findChatRoomById(chatRoomId, fn){
        connection.query(`SELECT * FROM ${tablename} WHERE id = ?`, [chatRoomId], (err, result) => {
            if(err) return fn(err, "");
            if(result.length <= 0) {
                return fn("NOT_REGISTER", "");
            }

            result[0].users    = JSON.parse(result[0].users);
            result[0].messages = JSON.parse(result[0].messages);

            return fn(null, result[0]);
        })
    }

    checkAlreadyId(chatRoomId, fn){
        connection.query(`SELECT * FROM ${tablename}`, (err, result) => {
            if(err) return fn(err, "");
            if(result.length <= 0) return fn(null, false);

            for(var i = 0; i < result.length; i++){
                if(result[i].id === chatRoomId){
                    return fn(null, true);
                }
            }

            fn(null, false);
        })
    }

    dropTable(fn){
        connection.query("DROP TABLE " + tablename, (err, result) => {
            if(err){
                console.log("Drop table faile");
                return fn(err, 'err');
            }

            return fn(null, 'success');
        })
    }
}

module.exports = new RomMD();