import { supabase } from "../../config/supabase.js";

/*========================
GET COURSE ID
========================*/
let params;
let courseId;
 params = new URLSearchParams(window.location.search);
 courseId = params.get("id");

/*========================
HTML ELEMENTS
========================*/

const courseCode = document.getElementById("courseCode");
const courseTitle = document.getElementById("courseTitle");
const department = document.getElementById("department");
const level = document.getElementById("level");
const semester = document.getElementById("semester");
const status = document.getElementById("status");

/*========================
LOAD COURSE
========================*/

async function loadCourse() {

    if (!courseId) {
        alert("Course ID not found.");
        return;
    }

    const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

    if (error) {
        alert(error.message);
        return;
    }

    courseCode.textContent = course.course_code;
    courseTitle.textContent = course.course_title;
    department.textContent = course.department;
    level.textContent = course.level;
    semester.textContent = course.semester;
    status.textContent = course.status;
}

 params = new URLSearchParams(window.location.search);
 courseId = params.get("id");

document
.getElementById("assessmentBtn")
.addEventListener("click", () => {

    window.location.href =
    `assessment-management.html?id=${courseId}`;

});

/*========================
START
========================*/

loadCourse();