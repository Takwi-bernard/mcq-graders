import { supabase } from "../../config/supabase.js";

/* ==========================
   DOM
========================== */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");
const logoutBtn = document.getElementById("logoutBtn");

const studentsCount = document.getElementById("studentsCount");
const lecturersCount = document.getElementById("lecturersCount");
const coursesCount = document.getElementById("coursesCount");
const examsCount = document.getElementById("examsCount");
const assessmentCount = document.getElementById("assessmentCount");
const resultsCount = document.getElementById("resultsCount");

/* ==========================
   START
========================== */

document.addEventListener("DOMContentLoaded", async () => {
    setupMobileMenu();
    showTodayDate();

    const loggedIn = await checkAuth();

    if (!loggedIn) return;

    await loadDashboard();

    setupLogout();
});

/* ==========================
   MOBILE MENU
========================== */

function setupMobileMenu() {

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("show");
            overlay.classList.toggle("show");
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("show");
            overlay.classList.remove("show");
        });
    }
}

/* ==========================
   DATE
========================== */

function showTodayDate() {

    const today = document.getElementById("todayDate");

    if (!today) return;

    today.textContent = new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

/* ==========================
   AUTH
========================== */

async function checkAuth() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = "../index.html";
        return false;
    }

    await loadProfile(session.user.id);

    return true;
}

/* ==========================
   PROFILE
========================== */

async function loadProfile(id) {

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.log(error.message);
        return;
    }

    document.getElementById("userName").textContent =
        data.full_name || "User";

    document.getElementById("welcomeText").textContent =
        `Welcome back ${data.full_name}`;
}

/* ==========================
   LOGOUT
========================== */

function setupLogout() {

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {

        await supabase.auth.signOut();

        window.location.href = "../index.html";

    });

}

/* ==========================
   DASHBOARD
========================== */

async function loadDashboard() {

    await loadCounts();

    // Uncomment when implemented

    // await loadRecentStudents();
    // await loadRecentResults();
    // await loadNotifications();
    // await loadUpcomingExams();
    // await loadActivities();
    // await loadTasks();
    // await loadCalendar();

}

/* ==========================
   COUNTS
========================== */

async function loadCounts() {

    await Promise.all([
        loadStudentCount(),
        loadLecturerCount(),
        loadCourseCount(),
        loadExamCount(),
        loadAssessmentCount(),
        loadResultCount()
    ]);

}

/* ==========================
   SAFE COUNT
========================== */

async function getCount(table, filter = null) {

    let query = supabase
        .from(table)
        .select("*", {
            count: "exact",
            head: true
        });

    if (filter) {
        query = query.eq(filter.column, filter.value);
    }

    const { count, error } = await query;

    if (error) {
        console.log(`${table}: ${error.message}`);
        return 0;
    }

    return count || 0;
}

/* ==========================
   STUDENTS
========================== */

async function loadStudentCount() {

    studentsCount.textContent = await getCount(
        "profiles",
        {
            column: "role",
            value: "student"
        }
    );

}

/* ==========================
   LECTURERS
========================== */

async function loadLecturerCount() {

    lecturersCount.textContent = await getCount(
        "profiles",
        {
            column: "role",
            value: "lecturer"
        }
    );

}

/* ==========================
   COURSES
========================== */

async function loadCourseCount() {

    const { count, error } = await supabase
        .from("courses")
        .select("*", {
            count: "exact",
            head: true
        });

    if (error) {
        console.log("Courses table:", error.message);
        coursesCount.textContent = "N/A";
        return;
    }

    coursesCount.textContent = count || 0;
}

/* ==========================
   EXAMS
========================== */

async function loadExamCount() {

    examsCount.textContent =
        await getCount("exams");

}

/* ==========================
   ASSESSMENTS
========================== */

async function loadAssessmentCount() {

    assessmentCount.textContent =
        await getCount("assessments");

}

/* ==========================
   RESULTS
========================== */

async function loadResultCount() {

    resultsCount.textContent =
        await getCount("results");

}

