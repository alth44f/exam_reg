let db = require('../connection/connection')

module.exports = {
    doSignup: (userData) => {
        return new Promise((resolve, reject) => {
            userData.type = "student"
            db.query('insert ignore into login_data values(?,?,?,?,?,?,?,?,?) ', [userData.name, userData.type, userData.course, userData.email, userData.phone, userData.aadhar, userData.gender, userData.dob, userData.password], (err, data) => {
                if (err) {
                    throw err
                }
                resolve()
            })
        })
    },
    doLogin: (loginData) => {
        return new Promise((resolve, reject) => {
            db.query('select * from login_data where email = ?', loginData.email, (err, data) => {
                // console.log(err);
                if (data[0].type == 'student') {
                    if (data.length == 0) {
                        resolve({ err: 'Email not exist.' })
                        // console.log("email not exist");
                    } else {
                        if (loginData.password === data[0].password) {
                            // console.log("success");
                            resolve({ err: false, user: data })
                        }
                        else {
                            resolve({ err: 'Password incorrect.' })
                            // console.log('password incorrect.')
                        }
                    }
                } else {
                    resolve({ err: 'Email not exist' })
                    // console.log("email not exist");
                }
            })

        })
    }
}