/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ahmadou Sy Student ID: 138005236 Date: March 24 2024
*
*  Online (Cycliic) Link: https://good-red-perch-shoe.cyclic.app/
*
********************************************************************************/ 



var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
const exphbs = require('express-handlebars');

// // Set up handlebars view engine
// app.engine('.hbs', exphbs.engine({
//     extname: '.hbs',
//     defaultLayout: 'main',
//     layoutsDir: path.join(__dirname, 'views/layouts/')

// }));


// NEW
// Set up handlebars view engine with custom helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    helpers: {
        navLink: function(url, options){
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (options.fn) {
                if (lvalue === rvalue) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
            return lvalue === rvalue;
        }
    
    }
});

//NEW
app.engine('.hbs', hbs.engine);

app.set('view engine', '.hbs');

app.use(express.static('public'));
// Add the express.urlencoded({ extended: true }) middleware (using app.use())
app.use(express.urlencoded({ extended: true }));

// Require the collegeData module from the modules folder
var collegeData = require("./modules/collegeData.js");
// NEWWWWWWWWWWWWWWWWWW

// Add middleware to set activeRoute in app.locals
app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = '/' + (route == '/' ? '' : route);
    next();
});
// Call the initialize function before setting up the routes
collegeData.initialize().then(() => {
    console.log("Data initialized. Setting up the routes.");

    // Serve static files from the 'views' directory
    app.use(express.static(path.join(__dirname, 'views')));

    // Serve the home page directly from the views directory (remove the redirect)
    // app.get("/", (req, res) => {
    //     res.sendFile(path.join(__dirname, 'views', 'home.html'));
    // });
    app.get("/", (req, res) => {
        res.render("home", {
            title: "Home Page"
        });
    });

    // Route for GET /students
    // app.get("/students", (req, res) => {
    //     if (req.query.course) {
    //         collegeData.getStudentsByCourse(req.query.course)
    //             .then((students) => res.json(students))
    //             .catch(() => res.json({message: "no results"}));
    //     } else {
    //         collegeData.getAllStudents()
    //             .then((students) => res.json(students))
    //             .catch(() => res.json({message: "no results"}));
    //     }
    // });

    // NEWW *********************
    // app.get("/students", (req, res) => {
    //     collegeData.getAllStudents()
    //         .then(students => {
    //             if(students.length > 0){
    //                 res.render("students", { students: students });
    //             } else {
    //                 res.render("students", { message: "No students found." });
    //             }
    //         })
    //         .catch(err => {
    //             res.render("students", { message: "Error retrieving students." });
    //         });
    // });
    app.get("/students", (req, res) => {
        if (req.query.course) {
            collegeData.getStudentsByCourse(req.query.course)
                .then(students => {
                    if(students.length > 0){
                        res.render("students", { students: students });
                    } else {
                        res.render("students", { message: "No students found for this course." });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.render("students", { message: "Error retrieving students." });
                });
        } else {
            collegeData.getAllStudents()
                .then(students => {
                    res.render("students", { students: students });
                })
                .catch(err => {
                    console.log(err);
                    res.render("students", { message: "Error retrieving students." });
                });
        }
    });
    

    // app.get("/tas", (req, res) => {
    //     collegeData.getTAs().then(data => {
    //         res.render("tas", { tas: data });
    //     }).catch(err => {
    //         res.render("tas", { message: "no results" });
    //     });
    // });

    // Route for GET /courses
    // app.get("/courses", (req, res) => {
    //     collegeData.getCourses()
    //         .then((courses) => res.json(courses))
    //         .catch(() => res.json({message: "no results"}));
    // });

    app.get("/courses", (req, res) => {
        collegeData.getCourses()
            .then(courses => {
                if(courses.length > 0){
                    res.render("courses", { courses: courses });
                } else {
                    res.render("courses", { message: "No courses available." });
                }
            })
            .catch(error => {
                res.render("courses", { message: "Unable to retrieve courses." });
            });
    });
    
// ******************************************************************* //

    // // Route for GET /student/num
    // app.get("/student/:num", (req, res) => {
    //     const studentNum = req.params.num;
    //     collegeData.getStudentByNum(studentNum)
    //         .then((student) => res.json(student))
    //         .catch(() => res.json({message: "no results"}));
    // });
// ******************************************************************* //

    // Route for GET /about
    // app.get("/about", (req, res) => {
    //     res.sendFile(path.join(__dirname, 'views', 'about.html'));
    // });
    app.get("/about", (req, res) => {
        res.render("about")
    });

    // Route for GET /htmlDemo
    // app.get("/htmlDemo", (req, res) => {
    //     res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
    // });


    app.get("/htmlDemo", (req, res) => {
        res.render('htmlDemo');
    });

    // // Route for GET /students/add
    // app.get("/students/add", (req, res) => {
    //     res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
    // });
        
    app.get("/students/add", (req, res) => {
        res.render('addStudent');
    });
        

    // POST route for adding a new student
    app.post("/students/add", (req, res) => {
        collegeData.addStudent(req.body) // Assuming addStudent accepts a student object
            .then(() => {
                res.redirect("/students"); // Redirect to the students list upon successful addition
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to add student"); // Handle errors appropriately
            });
    });
    // NEWWW
    // app.get("/course/:id", (req, res) => {
    //     collegeData.getCourseById(req.params.id)
    //         .then((course) => {
    //             console.log(course); // Log the course data to see its structure
    //             res.render("course", { course: course });
    //         })
    //         .catch((err) => {
    //             res.render("course", { message: "This course does not exist." });
    //         });
    // });
    
    // app.get("/course/:id", (req, res) => {
    //     collegeData.getCourseById(req.params.id)
    //         .then((course) => {
    //             console.log(course); // Log the course data to see its structure
    //             res.render("course", { course: course });
    //         })
    //         .catch((err) => {
    //             console.error(err); // Log the error to the console
    //             res.render("course", { message: "This course does not exist." });
    //         });
    // });
    app.get("/course/:id", (req, res) => {
        collegeData.getCourseById(req.params.id)
            .then((course) => {
                console.log(course); // Log the course data to see its structure
                res.render("course", { course: course });
            })
            .catch((err) => {
                console.error(err); // Use console.error to log the error
                res.render("course", { message: "This course does not exist." });
            });
    });
    
    

    // GET route for editing a specific student **************************************************************
// app.get("/student/:studentNum", (req, res) => {
//     const studentNum = req.params.studentNum;
//     collegeData.getStudentByNum(studentNum)
//         .then((studentData) => {
//             res.render("student", { student: studentData });
//         })
//         .catch(() => {
//             res.redirect("/students");
//         });
// });

app.get('/student/:studentNum', (req, res) => {
    Promise.all([
        collegeData.getStudentByNum(req.params.studentNum),
        collegeData.getCourses()
    ])
    .then(([studentData, coursesData]) => {
        console.log('Courses data:', coursesData); // Check what courses data you're getting here.
        res.render('student', {
            student: studentData,
            courses: coursesData // Make sure this is an array
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error loading student edit form');
    });
});



// POST route for updating a specific student
// app.post('/student/update', (req, res) => {
//     console.log(req.body);
//     collegeData.updateStudent(req.body)
//         .then(() => {
//             res.redirect('/students');
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send("Unable to update student information.");
//         });
// });

        
    app.post('/student/update', (req, res) => {
        collegeData.updateStudent(req.body)
            .then(() => {
                res.redirect('/students');
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Unable to update student.");
            });
    });

        

    // Catch-all route for handling unmatched routes
    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    // Start the server after the data has been initialized
    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });

}).catch(err => {
    console.error("Failed to initialize data:", err);
});



