let db = require('../connection/connection')

module.exports = {
    doSignup: (userData) => {
        return new Promise((resolve, reject) => {
            db.query('insert ignore into students values(?,?,?,?,?,?,?,?) ', [userData.name, userData.course, userData.email, userData.phone, userData.aadhar, userData.gender, userData.dob, userData.password], (err, data) => {
                if (err) {
                    throw err
                }
                resolve()
            })
        })
    },
    doLogin: (loginData) => {
        return new Promise((resolve, reject) => {
            db.query('select * from students where email = ?',loginData.email,(err,data)=>{
                console.log(data[0].password);
                
                if(data.length ==0){
                    console.log("email not exist");
                }else{
                    // if(loginData.password===data)
                }
            })
            
        })
    }
}