let db = require('../connection/connection')
const Razorpay = require('razorpay')
const crypto = require("crypto");
var instance = new Razorpay({
    key_id: 'rzp_test_AUJDHrGiSHGnEE',
    key_secret: '8uZAis7DKR5IzFbPPyp7uG8V',
});

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

            const sql = `SELECT login_data.aadhar, students.reg_no, login_data.name,login_data.course,login_data.attandance
                         FROM login_data
                         INNER JOIN students ON login_data.email = students.email
                         where login_data.email=?;`;
            db.query(sql, email, (err, data) => {
                data[0].email = email;
                resolve(data[0])
            })
        })
    },
    checkReg: (data) => {
        return new Promise((resolve, reject) => {
            db.query('select * from exam where email=? and sem = ?', [data.email, data.sem], (err, resp) => {
                // console.log(resp,data.reg_no);
                data.payment_status = 'Pending'

                if (resp.length > 0) {
                    resolve({ status: true })
                } else {
                    resolve({ status: false })
                }
            })
        })
    },
    RegisterExam: (data, payment_id) => {
        return new Promise((resolve, reject) => {
            data.payment_status = 'Pending'
            const query = 'INSERT INTO exam (email,reg_no, second_lang, sem,paper1,paper2,paper3,paper4,paper5,paper6,paper7,paper8,payment_status,payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?,?,?,?)';

            db.query(query, [data.email, data.reg_no, data.second_lang, data.sem, data.paper1, data.paper2, data.paper3, data.paper4, data.paper5, data.paper6, data.paper7, data.paper8, data.payment_status, payment_id], (err, data) => {
                console.log(err);

                resolve({ status: false })

            })
        })
    },
    getAllPaper: () => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from paper'
            db.query(sql, (err, data) => {
                // console.log(data);

                resolve(data)
            })
        })
    },
    generateRaszorpay: () => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: 12000 * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "reg_ex"
            };
            instance.orders.create(options, function (err, order) {
                console.log(err);
                // console.log(order);
                resolve(order)
            });
        })
    },
    confirmPayment: (data) => {
        return new Promise((resolve, reject) => {
            var payment = {
                payment_id: data.payment_id,
                order_id: data.order_id,
                signature: data.signature
            }
            // console.log(payment);
            const hmac = crypto.createHmac('sha256', "8uZAis7DKR5IzFbPPyp7uG8V");

            hmac.update(payment.order_id + "|" + payment.payment_id);
            let generatedSignature = hmac.digest('hex');

            let isSignatureValid = generatedSignature == payment.signature;
            console.log(isSignatureValid);
            if (isSignatureValid) {
                resolve({ status: true })
            } else {
                resolve({ status: false })
            }
        })
    },
    changeStatus: (order_id) => {
        return new Promise((resolve, reject) => {
            const sql = 'update exam set payment_status = ? where payment_id = ?';
            db.query(sql, ["Paid", order_id], (err, data) => {
                resolve()
            })
        })
    }
}