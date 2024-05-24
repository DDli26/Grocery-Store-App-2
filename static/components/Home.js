import AdminDashboard from "./AdminDashboard.js"
import InstructorDashboard from "./InstructorHome.js"
import StudentDashboard from "./StudentDashboard.js"
/* <StudentDashboard v-if="userRole=='stud'" />
    <AdminDashboard v-if="userRole=='admin'" />
    <InstructorHome v-if="userRole=='inst'" />*/
export default{   //for normal user 
    template: `
    <div>
    <StudentDashboard v-if="userRole=='stud'" />
    <AdminDashboard v-if="userRole=='admin'" />
    <InstructorDashboard v-if="userRole=='inst'" />
    </div>`,

    data(){
        return {
            userRole: localStorage.getItem("role")
        }
    }, 
    components:{
        StudentDashboard, 
        InstructorDashboard, 
        AdminDashboard
    }

}



// this.$route.query.role also works