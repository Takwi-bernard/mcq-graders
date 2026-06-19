import { supabase } from "../../config/supabase.js";

const params = new URLSearchParams(window.location.search);

const courseId = params.get("id");

const courseName =
document.getElementById("courseName");

const container =
document.getElementById("assessmentContainer");

const createBtn =
document.getElementById("createAssessmentBtn");

createBtn.onclick=()=>{

location.href=
`assessment-builder.html?course=${courseId}`;

};

async function loadCourse(){

const {data}
=
await supabase

.from("courses")

.select("*")

.eq("id",courseId)

.single();

if(data){

courseName.textContent=
data.course_title;

}

}

async function loadAssessments(){

container.innerHTML="";

const {

data,
error

}

=

await supabase

.from("assessments")

.select("*")

.eq("course_id",courseId)

.order("created_at");

if(error){

console.log(error);

return;

}

if(data.length===0){

container.innerHTML=`

<div class="empty">

<h2>

No Assessments

</h2>

<p>

Create your first assessment.

</p>

<button id="emptyCreate">

Create Assessment

</button>

</div>

`;

document

.getElementById("emptyCreate")

.onclick=()=>{

createBtn.click();

};

return;

}

data.forEach(item=>{

const card=
document.createElement("div");

card.className=
"assessment-card";

card.innerHTML=`

<h2>

${item.title}

</h2>

<p>

Type:
${item.assessment_type}

</p>

<p>

Marks:
${item.total_marks}

</p>

<p>

Duration:
${item.duration} mins

</p>

<p>

Status:
${item.status}

</p>

<div class="actions">

<button class="manage">

Manage

</button>

<button class="edit">

Edit

</button>

<button class="delete">

Delete

</button>

</div>

`;

card.querySelector(".manage")

.onclick=()=>{

location.href=
`assessment-builder.html?id=${item.id}`;

};

card.querySelector(".edit")

.onclick=()=>{

location.href=
`assessment-builder.html?id=${item.id}`;

};

card.querySelector(".delete")

.onclick=()=>{

deleteAssessment(item.id);

};

container.appendChild(card);

});

}

const params = new URLSearchParams(window.location.search);

const courseId = params.get("id");

console.log(courseId);

async function deleteAssessment(id){

if(!confirm(

"Delete assessment?"

)){

return;

}

await supabase

.from("assessments")

.delete()

.eq("id",id);

loadAssessments();

}

await loadCourse();

await loadAssessments();