import {
requireStudent,
getProfile
}
from "../../../shared/js/services/profileService.js";

import {
supabase
}
from "../../../config/supabase.js";

document.addEventListener(
"DOMContentLoaded",
init
);

async function init(){

await requireStudent();

loadProfile();
document
.getElementById("uploadBtn")
.addEventListener(
"click",
uploadAvatar
);

document
.getElementById("saveProfile")
.addEventListener(
"click",
saveProfile
);

document
.getElementById("logoutBtn")
.addEventListener(
"click",
logout
);

}

async function loadProfile(){

const profile=
await getProfile();

if(!profile)return;

studentName.textContent=
profile.full_name||"Student";

email.textContent=
profile.email||"";

fullName.value=
profile.full_name||"";

phone.value=
profile.phone||"";

gender.value=
profile.gender||"Male";

dob.value=
profile.date_of_birth||"";

address.value=
profile.address||"";

programme.textContent=
profile.programme||"";

faculty.textContent=
profile.faculty||"";

department.textContent=
profile.department||"";

level.textContent=
profile.level||"";

matricule.textContent=
profile.student_number||"";

academicYear.textContent=
profile.academic_year||"";

semester.textContent=
profile.semester||"";

guardianName.value=
profile.guardian_name||"";

guardianPhone.value=
profile.guardian_phone||"";

guardianRelation.value=
profile.guardian_relationship||"";

if(profile.avatar_url){

avatar.src=
profile.avatar_url;

}

}

async function saveProfile(){

const user=
(await supabase.auth.getUser())
.data.user;

if(!user)return;

const updates={

full_name:
fullName.value,

phone:
phone.value,

gender:
gender.value,

date_of_birth:
dob.value,

address:
address.value,

guardian_name:
guardianName.value,

guardian_phone:
guardianPhone.value,

guardian_relationship:
guardianRelation.value

};

const{
error
}=await supabase

.from("profiles")

.update(updates)

.eq("id",user.id);

if(error){

alert(error.message);

return;

}

alert(
"Profile updated successfully."
);

loadProfile();

}

async function logout(){

await supabase.auth.signOut();

window.location.href=
"../../auth/login.html";

}
async function uploadAvatar(){

    const file =
    document.getElementById("avatarInput").files[0];

    console.log("File:", file);

    if(!file){
        alert("Select an image.");
        return;
    }

    const {
        data:{user}
    } = await supabase.auth.getUser();

    console.log("User:", user);

    const fileName =
    `${user.id}-${Date.now()}`;

    const {
        error: uploadError
    } = await supabase.storage
    .from("avatars")
    .upload(fileName,file,{
        upsert:true
    });

    console.log("Upload Error:", uploadError);

    if(uploadError){
        alert(uploadError.message);
        return;
    }

    const {
        data
    } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

    console.log("Public URL:", data.publicUrl);

    const {
        error
    } = await supabase
    .from("profiles")
    .update({
        avatar_url:data.publicUrl
    })
    .eq("id",user.id);

    console.log("DB Error:", error);

    if(error){
        alert(error.message);
        return;
    }

    document.getElementById("avatar").src =
    data.publicUrl + "?t=" + Date.now();

    alert("Profile picture updated!");
}