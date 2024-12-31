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
            db.query('insert into students(email,sslc_cer_no,plustwo_cer_no) values(?,?,?)', [email, sslc, plustwo], (err, data) => {
                // console.log(err, data)
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
    getStudentDetails: (email) => {
        return new Promise((resolve, reject) => {
            // console.log(email);

            const sql = `SELECT login_data.aadhar, students.reg_no, login_data.name,login_data.course
                         FROM login_data
                         INNER JOIN students ON login_data.email = students.email
                         where login_data.email=?;`;
            db.query(sql, email, (err, data) => {
                data[0].email = email;
                console.log(data);
                resolve(data[0])
            })
        })
    },
    registerExam: (data) => {
        return new Promise((resolve, reject) => {
            db.query('select * from exam where email=? and sem = ?', [data.email,data.sem], (err, resp)=>{
                if (data.length == 0) {
                    const query = 'INSERT INTO exam (email, second_lang, sem, papercode1, papername1, papercode2, papername2, papercode3, papername3, papercode4, papername4, papercode5, papername5, papercode6, papername6, papercode7, papername7, papercode8, papername8) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)';

                    db.query(query, [data.email, data.second_lang, data.sem, data.papercode1, data.papername1, data.papercode2, data.papername2, data.papercode3, data.papername3, data.papercode4, data.papername4, data.papercode5, data.papername5, data.papercode6, data.papername6, data.papercode7, data.papername7, data.papercode8, data.papername8], (err, data) => {
                        resolve({status: true})
                    })
                }else{
                    resolve({status: false})
                }
            })
        })
    }
}