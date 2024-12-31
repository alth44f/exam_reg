const db = require("../connection/connection")

module.exports = {
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
                        if (data[0].type === "hod") {
                            resolve({ err: false, hod: data })
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
    getAllStudents: () => {
        return new Promise((resolve, reject) => {
            db.query('select * from login_data where type="student"', (err, data) => {
                resolve(data)
            })
        })
    },
    changeStatus: (data) => {
        return new Promise((resolve, reject) => {
            db.query('update login_data set status=? where email = ?', [data.status, data.email], (err, data) => {
                resolve()
            })
        })
    },
    addAttandance: (data) => {
        return new Promise((resolve, reject) => {
            db.query('update login_data set attandance=? where email =?', [data.attandance,data.email], (err, data) => {
                resolve()
            })
        })
    },
    getDashboardData:()=>{
        return new Promise((resolve, reject) => {
            db.query("SELECT COUNT(*) AS total_students,COUNT(DISTINCT course) AS total_departments FROM login_data WHERE type = 'student'",(err,data)=>{
                console.log(data);
                resolve(data[0])
            })
        })
    }
}