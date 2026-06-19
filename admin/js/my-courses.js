/*==================================
SMARTGRADE MY COURSES
my-courses.js
==================================*/

import { supabase } from "../../config/supabase.js";

/*==================================
ELEMENTS
==================================*/

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");

const fabBtn = document.getElementById("fabBtn");
const emptyCreateBtn = document.getElementById("emptyCreateBtn");

const createModal = document.getElementById("createCourseModal");
const closeCreateModal = document.getElementById("closeCreateModal");
const cancelCreate = document.getElementById("cancelCreate");

const createCourseForm = document.getElementById("createCourseForm");

const courseModal = document.getElementById("courseModal");
const closeModal = document.getElementById("closeModal");

const courseGrid = document.getElementById("courseGrid");
const emptyState = document.getElementById("emptyState");

const refreshBtn = document.getElementById("refreshBtn");

const searchCourse = document.getElementById("searchCourse");
const semesterFilter = document.getElementById("semesterFilter");
const levelFilter = document.getElementById("levelFilter");
const statusFilter = document.getElementById("statusFilter");

const courseCount = document.getElementById("courseCount");
const studentCount = document.getElementById("studentCount");
const assessmentCount = document.getElementById("assessmentCount");
const examCount = document.getElementById("examCount");

const todayDate = document.getElementById("todayDate");
const welcomeText = document.getElementById("welcomeText");
const userName = document.getElementById("userName");

const courseDetails = document.getElementById("courseDetails");

const logoutBtn = document.getElementById("logoutBtn");

/*==================================
GLOBAL
==================================*/

let lecturer = null;
let lecturerCourses = [];

/*==================================
DATE
==================================*/

todayDate.textContent =
new Date().toLocaleDateString(
undefined,
{
weekday:"long",
year:"numeric",
month:"long",
day:"numeric"
}
);

/*==================================
SIDEBAR
==================================*/

menuBtn?.addEventListener("click",()=>{

sidebar.classList.toggle("show");

overlay.classList.toggle("show");

});

overlay?.addEventListener("click",()=>{

sidebar.classList.remove("show");

overlay.classList.remove("show");

});

/*==================================
MODALS
==================================*/

function openCreate(){

createCourseForm.reset();

createModal.classList.add("show");

document.body.style.overflow="hidden";

}

function closeCreate(){

createModal.classList.remove("show");

document.body.style.overflow="auto";

}

fabBtn?.addEventListener("click",openCreate);

emptyCreateBtn?.addEventListener("click",openCreate);

closeCreateModal?.addEventListener("click",closeCreate);

cancelCreate?.addEventListener("click",closeCreate);

createModal?.addEventListener("click",(e)=>{

if(e.target===createModal){

closeCreate();

}

});

function openCourse(){

courseModal.classList.add("show");

}

function closeCourse(){

courseModal.classList.remove("show");

}

closeModal?.addEventListener("click",closeCourse);

courseModal?.addEventListener("click",(e)=>{

if(e.target===courseModal){

closeCourse();

}

});

/*==================================
AUTH
==================================*/

async function getCurrentLecturer(){

const {
data:{user}
}

=

await supabase.auth.getUser();

if(!user){

location.href="login.html";

return;

}

lecturer=user;

welcomeText.textContent=
`Welcome ${user.email}`;

userName.textContent=
user.email.split("@")[0];

}

/*==================================
STATISTICS
==================================*/

async function loadStatistics(){

courseCount.textContent=
lecturerCourses.length;

let students=0;

lecturerCourses.forEach(course=>{

students+=course.capacity||0;

});

studentCount.textContent=
students;

assessmentCount.textContent=
0;

examCount.textContent=
0;

}

/*==================================
LOAD COURSES
==================================*/

async function loadCourses(){

courseGrid.innerHTML=`
<div class="loading-card">

<i class="fas fa-spinner fa-spin"></i>

<p>Loading Courses...</p>

</div>
`;

const {

data,
error

}

=

await supabase

.from("lecturer_courses")

.select(`
course_id,
courses(*)
`)

.eq(
"lecturer_id",
lecturer.id
);

if(error){

console.log(error);

return;

}

lecturerCourses=
data.map(x=>x.courses);

renderCourses();

loadStatistics();

}

/*==================================
RENDER
==================================*/

function renderCourses(){

courseGrid.innerHTML="";

let filtered=[...lecturerCourses];

if(searchCourse.value){

filtered=
filtered.filter(c=>

c.course_title

.toLowerCase()

.includes(

searchCourse.value.toLowerCase()

)

||

c.course_code

.toLowerCase()

.includes(

searchCourse.value.toLowerCase()

)

);

}

if(levelFilter.value){

filtered=
filtered.filter(

c=>c.level==levelFilter.value

);

}

if(semesterFilter.value){

filtered=
filtered.filter(

c=>c.semester==semesterFilter.value

);

}

if(statusFilter.value){

filtered=
filtered.filter(

c=>c.status==statusFilter.value

);

}

if(filtered.length===0){

emptyState.style.display="block";

return;

}

emptyState.style.display="none";

filtered.forEach(course=>{

const card=
document.createElement("div");

card.className=
"course-card";

card.innerHTML=`

<div class="course-top">

<h3 class="course-code">

${course.course_code}

</h3>

<span class="status">

${course.status}

</span>

</div>

<h4 class="course-title">

${course.course_title}

</h4>

<div class="course-info">

<p>

<i class="fas fa-building"></i>

${course.department}

</p>

<p>

<i class="fas fa-layer-group"></i>

Level ${course.level}

</p>

<p>

<i class="fas fa-calendar"></i>

Semester ${course.semester}

</p>

<p>

<i class="fas fa-users"></i>

${course.capacity}

Students

</p>

</div>

<div class="course-actions">

<button class="view">

View

</button>

</div>

`;

card.querySelector(".view").addEventListener("click", () => {
    window.location.href =
    `course-dashboard.html?id=${course.id}`;
});

courseGrid.appendChild(card);

});

}

/*==================================
SHOW COURSE
==================================*/



/*==================================
CREATE COURSE
==================================*/

createCourseForm?.addEventListener(

"submit",

async(e)=>{

e.preventDefault();

const courseData={

course_code:
courseCode.value.trim(),

course_title:
courseTitle.value.trim(),

department:
department.value.trim(),

level:
parseInt(level.value),

semester:
semester.value,

credit_hours:
parseInt(creditHours.value),

academic_year:
academicYear.value.trim(),

capacity:
parseInt(capacity.value)||100,

description:
description.value.trim(),

status:"active"

};

const {

data:existing

}

=

await supabase

.from("courses")

.select("id")

.eq(
"course_code",
courseData.course_code
)

.maybeSingle();

if(existing){

alert(
"Course already exists."
);

return;

}

const {

data:course,
error

}

=

await supabase

.from("courses")

.insert(courseData)

.select()

.single();

if(error){

alert(error.message);

return;

}

await supabase

.from("lecturer_courses")

.insert({

lecturer_id:
lecturer.id,

course_id:
course.id

});

alert(
"Course Created."
);

closeCreate();

await loadCourses();

});

/*==================================
FILTERS
==================================*/

searchCourse.oninput=
renderCourses;

semesterFilter.onchange=
renderCourses;

levelFilter.onchange=
renderCourses;

statusFilter.onchange=
renderCourses;

/*==================================
REFRESH
==================================*/

refreshBtn?.addEventListener(

"click",

loadCourses

);

/*==================================
LOGOUT
==================================*/

logoutBtn?.addEventListener(

"click",

async()=>{

await supabase.auth.signOut();

location.href="login.html";

}

);

/*==================================
INIT
==================================*/

async function init(){

await getCurrentLecturer();

await loadCourses();

}

init();