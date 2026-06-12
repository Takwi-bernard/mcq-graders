import {
    requireStudent,
    getProfile
}
from "../../shared/js/services/profileService.js";

import {
    supabase
}
from "../../config/supabase.js";

const menuBtn =
document.querySelector(".menu-btn");

const sidebar =
document.querySelector(".sidebar");

menuBtn.addEventListener("click",()=>{

sidebar.classList.toggle("active");

});

await requireStudent();

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadDashboard();

    }
);

// async function loadDashboard(){

//     await loadWelcome();

//     await loadStatistics();

//     await loadRecentResults();
//     await loadNotifications();

// await loadProgress();

// }

async function loadWelcome(){

    const profile =
    await getProfile();

    if(!profile) return;

    const hour =
    new Date().getHours();

    let greeting;

    if(hour < 12){

        greeting =
        "Good Morning";

    }

    else if(hour < 18){

        greeting =
        "Good Afternoon";

    }

    else{

        greeting =
        "Good Evening";

    }

    document.getElementById(
        "studentName"
    ).textContent =
    profile.full_name;

    document.getElementById(
        "greeting"
    ).textContent =
    greeting;

}

async function loadDashboard(){

    const profile =
    await getProfile();

    if(!profile) return;

    document
    .getElementById("studentName")
    .textContent=

    profile.full_name ||
    "Student";

    document
    .getElementById("studentInfo")
    .textContent=

    `${profile.department || "Department"} | ${
    profile.level || "Level"
    }`;


 await loadWelcome();

    await loadStatistics();

    await loadRecentResults();
    await loadNotifications();

await loadProgress();
}

loadDashboard();
// Load statistics
async function loadStatistics(){

    const {
        data:{ user }
    } =
    await supabase.auth.getUser();

    if(!user) return;

    const subjects =
    await supabase

    .from("subjects")

    .select("*",{
        count:"exact",
        head:true
    })

    .eq("student_id",user.id);

    document.getElementById(
        "subjectCount"
    ).textContent =
    subjects.count || 0;

    const results =
    await supabase

    .from("results")

    .select("*",{
        count:"exact",
        head:true
    })

    .eq("student_id",user.id);

    document.getElementById(
        "resultCount"
    ).textContent =
    results.count || 0;

}
// Load recent results
async function loadRecentResults(){

    const {
        data:{ user }
    } =
    await supabase.auth.getUser();

    const {
        data,
        error
    } =
    await supabase

    .from("results")

    .select("*")

    .eq(
        "student_id",
        user.id
    )

    .limit(5)

    .order(
        "created_at",
        {
            ascending:false
        }
    );

    if(error){

        console.log(error);

        return;

    }

    renderResults(data);

}
 
// Render results in table
function renderResults(results){

    const tbody =
    document.getElementById(
        "resultTable"
    );

    tbody.innerHTML="";

    if(results.length===0){

        tbody.innerHTML=

        `
        <tr>

        <td colspan="5">

        No results found.

        </td>

        </tr>
        `;

        return;

    }

    results.forEach(result=>{

        tbody.innerHTML+=`

        <tr>

        <td>${result.subject}</td>

        <td>${result.ca}</td>

        <td>${result.exam}</td>

        <td>${result.grade}</td>

        <td>${result.status}</td>

        </tr>

        `;

    });

}

// Logout functionality

import {
logoutUser
}
from "../../shared/js/services/authService.js";

document

.getElementById(
"logoutBtn"
)

.addEventListener(

"click",

logoutUser

);


async function loadNotifications(){

console.log("Notifications loaded");

}

async function loadProgress(){

console.log("Progress loaded");

}

// async function loadProgress(){

//     document
//     .getElementById(
//     "progressBar"
//     )
//     .style.width="75%";

//     document
//     .getElementById(
//     "progressBar"
//     )
//     .innerHTML="75%";

//     document
//     .getElementById(
//     "progressText"
//     )
//     .innerHTML=

//     "You have completed 75% of this semester.";

// }

// async function loadNotifications(){

//     const list=
//     document.getElementById(
//     "notificationList"
//     );

//     list.innerHTML="";

//     const notifications=[

//         "New result uploaded.",

//         "Course registration is open.",

//         "Semester timetable updated."

//     ];

//     notifications.forEach(item=>{

//         list.innerHTML+=`

//         <li class="list-group-item">

//         ${item}

//         </li>

//         `;

//     });

// }