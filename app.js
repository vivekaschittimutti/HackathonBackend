const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const cors = require('cors');
const app = express()
app.use(cors()); 
app.use(express.json())
const dbPath = path.join(__dirname, 'schoolDetails.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

// Students Endpoints

app.get('/students/', async (request, response) => {
  const getStudentsQuery = `SELECT * FROM students;`
  const students = await db.all(getStudentsQuery)
  response.send({students})
})

app.get('/students/:studentId/', async (request, response) => {
  const {studentId} = request.params
  const getStudentQuery = `SELECT * FROM students WHERE id = ${studentId};`
  const student = await db.get(getStudentQuery)
  response.send(student)
})

app.post('/students/', async (request, response) => {
  const {id, name, department, enrolledCourses} = request.body
  const insertStudent = `
    INSERT INTO students (id, name, department, enrolledCourses)
    VALUES (${id}, '${name}', '${department}', '${enrolledCourses}');`
  await db.run(insertStudent)
  response.send('Student Successfully Added')
})

app.delete('/students/:studentId/', async (request, response) => {
  const {studentId} = request.params
  const deleteStudentQuery = `DELETE FROM students WHERE id = ${studentId};`
  await db.run(deleteStudentQuery)
  response.send('Student Deleted')
})

app.put('/students/:studentId/', async (request, response) => {
  const {studentId} = request.params
  const {name, department, enrolledCourses} = request.body
  const updateStudentQuery = `
    UPDATE students
    SET name = '${name}', department = '${department}', enrolledCourses = '${enrolledCourses}'
    WHERE id = ${studentId};`
  await db.run(updateStudentQuery)
  response.send('Student Details Updated')
})

// Courses Endpoints

app.get('/courses/', async (request, response) => {
  const getCoursesQuery = `SELECT * FROM courses;`
  const courses = await db.all(getCoursesQuery)
  response.send({courses})
})

app.post('/courses/', async (request, response) => {
  const {id, name, type, prerequisites, semesterOffered} = request.body
  const insertCourse = `
    INSERT INTO courses (id, name, type, prerequisites, semesterOffered)
    VALUES (${id}, '${name}', '${type}', '${prerequisites}', '${semesterOffered}');`
  await db.run(insertCourse)
  response.send('Course Successfully Added')
})

// Teachers Endpoints

app.get('/teachers/', async (request, response) => {
  const getTeachersQuery = `SELECT * FROM teachers;`
  const teachers = await db.all(getTeachersQuery)
  response.send({teachers})
})

app.post('/teachers/', async (request, response) => {
  const {
    id,
    name,
    department,
    ratings,
    researchProjects,
    patents,
    academicBackground,
  } = request.body
  const insertTeacher = `
    INSERT INTO teachers (id, name, department, ratings, researchProjects, patents, academicBackground)
    VALUES (${id}, '${name}', '${department}', ${ratings}, '${researchProjects}', '${patents}', '${academicBackground}');`
  await db.run(insertTeacher)
  response.send('Teacher Successfully Added')
})

// Teacher Ratings Endpoints

app.get('/teacher-ratings/', async (request, response) => {
  const getRatingsQuery = `SELECT * FROM teacher_rating;`
  const ratings = await db.all(getRatingsQuery)
  response.send({ratings})
})

app.post('/teacher-ratings/', async (request, response) => {
  const {teacherId, rating, feedback} = request.body
  const insertRating = `
    INSERT INTO teacher_rating (teacherId, rating, feedback)
    VALUES (${teacherId}, ${rating}, '${feedback}');`
  await db.run(insertRating)
  response.send('Rating Successfully Added')
})

// Student-Course Endpoints

app.get('/student-courses/', async (request, response) => {
  const getStudentCoursesQuery = `SELECT * FROM student_course;`
  const studentCourses = await db.all(getStudentCoursesQuery)
  response.send({studentCourses})
})

app.post('/student-courses/', async (request, response) => {
  const {studentId, courseId, teacherId} = request.body
  const insertStudentCourse = `
    INSERT INTO student_course (studentId, courseId, teacherId)
    VALUES (${studentId}, ${courseId}, ${teacherId});`
  await db.run(insertStudentCourse)
  response.send('Student-Course Successfully Linked')
})

module.exports = app
