import router from "./router.js"
import NavBar from "./components/NavBar.js"  //local component remember
const isAuthenticated=localStorage.getItem("auth-token") ? true :false //if authentication token is present in local storage then user is authenticated
console.log(isAuthenticated)
router.beforeEach((to, from, next)=>{ //next in case the to route doesn't work, eg, when not authenticated
    console.log(isAuthenticated+" inside before each")
    console.log((to.name!='login' || to.name!="register"))
    if((to.name!='login') && !isAuthenticated) {  //if user is not autheticated, route him to login
        console.log(to.name!="register", "not going to register")
        if (to.name=="register"){  //if not authenticated, see if he is going to register, and route him there
            next()
        }
        else{  //if not authenticated and not going to register, then take him to login
            next({name:"login"})
        }
        
    
    }  //check router.js name attribute, if user is not autheticated and going to any other route except login, redirect to login
    else next()

})  //similaryly we can store the role in local storage and check what is up, i think for token based authentication,
//we can use fetch on an @auth_required() function and check the response and proceed according

new Vue({
    el:"#app", 
    template: `
    <div> 
    <NavBar/>

    <router-view class="m-3" />
    </div>
    `, 
    router, 
    components:{
        NavBar,
    }
}) 