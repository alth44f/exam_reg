let db = require('../connection/connection')

module.exports = {
    doSignup: (userData) => {
        return new Promise((resolve, reject) => {
            userData.type = "student"
            db.query('insert ignore into login_data values(?,?,?,?,?,?,?,?,?,?,?) ', [userData.name, userData.type, userData.course, userData.email, userData.phone, userData.aadhar, userData.gender, userData.dob, userData.password, 0, 0], (err, data) => {
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
                // console.log(data);
                if (data.length == 0) {
                    resolve({ err: 'Email not exist.' })
                    // console.log("email not exist");
                } else {
                    if (loginData.password === data[0].password) {
                        // console.log("success");
                        if (data[0].type === "student") {
                            if (data[0].status) {
                                resolve({ err: false, data })
                            } else {
                                resolve({ err: 'Account is inactive.' })
                            }
                        } else {
                            resolve({ err: 'Email not exist.' })
                        }
                    }
                    else {
                        resolve({ err: 'Password incorrect.' })
                        // console.log('password incorrect.')
                    }
                }
            })

        })
    },
    SetStudentRegister: (email, sslc, plustwo) => {
        return new Promise((resolve, reject) => {
            db.query('insert into students values(?,?,?)', [email, sslc, plustwo], (err, data) => {
                console.log(err, data)
                resolve()
            })
        })
    },
    checkUpload: (email) => {
        return new Promise((resolve, reject) => {
            db.query('select * from students where email=?', email, (err, data) => {
                if (data.length == 0) {
                    resolve({ status: false })
                } else {
                    resolve({ status: true })
                }
            })
        })
    },
    getStudentDetails: () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT login_data.aadhar, students.register_number
                         FROM login
                         INNER JOIN students ON login.email_id = students.email_id;`;
            db.query('select * from students ', (err, data) => {

            })
        })
    }
}