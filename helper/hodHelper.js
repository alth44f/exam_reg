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
    getAllStudents: (department) => {
        return new Promise((resolve, reject) => {
            db.query('select * from login_data where type="student" and course=?', [department], (err, data) => {
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
            db.query('update login_data set attandance=? where email =?', [data.attandance, data.email], (err, data) => {
                resolve()
            })
        })
    },
    getDashboardData: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT COUNT(*) AS total_students,COUNT(DISTINCT course) AS total_departments FROM login_data WHERE type = 'student'", (err, data) => {
                // console.log(data);
                resolve(data[0])
            })
        })
    },
    // getExamDetails: () => {
    //     return new Promise((resolve, reject) => {
    //         const sql = `SELECT login_data.name, exam.email,login_data.course,exam.sem
    //                      FROM login_data
    //                      INNER JOIN exam ON login_data.email = exam.email;`;
    //         db.query(sql,(err,data)=>{
    //             resolve()
    //         })
    //     })
    // },
    searchStudent: (student_data) => {
        return new Promise((resolve, reject) => {
            // console.log(student_data);
            const sql = `SELECT login_data.aadhar,login_data.gender,login_data.attandance, login_data.name,exam.second_lang,exam.paper1,exam.paper2,exam.paper3,exam.paper4,exam.paper5,exam.paper6,exam.paper7,exam.paper8
                         FROM login_data
                         INNER JOIN exam ON login_data.email = exam.email
                         where exam.reg_no=? and exam.sem=?`;
            db.query(sql, [student_data.reg_no, student_data.sem], (err, data) => {
                resolve(data)
            })
        })
    },
    addPaper: (data,course) => {
        return new Promise((resolve, reject) => {
            const sql = 'insert into paper(papername,papercode,sem,course) values(?,?,?,?)';
            db.query(sql, [data.papername, data.papercode,data.sem,course], (err, data) => {
                resolve()
            })
        })
    },
    getFee: () => {
        return new Promise((resolve, reject) => {
            db.query('select sum(price) as price,count(*) as count from exam where payment_status = "paid"', (err, data) => {
                resolve(data[0])
            })
        })
    }
}