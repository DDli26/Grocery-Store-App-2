export default{
    template:`
    

<nav class="navbar navbar-expand-lg navbar-light bg-light">
<a class="navbar-brand" href="#">Navbar</a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>

<div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item active">
      <router-link class="nav-link" to="/" >Home</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link active" aria-current="page" to="/users">Users</router-link>
    </li>
    <li class="nav-item">
    <a class="nav-link" @click="logout" v-if="is_logged_in">Logout</a>
    </li>

    <li class="nav-item">
      <router-link class="nav-link" to="/cart" >Cart</router-link>
    </li> 
    
      
  </ul>
  <form class="form-inline my-2 my-lg-0">
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="search_query">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit" style="position:absolute; left: 40%; bottom:14%;" @click="search">Search</button>
  </form>
</div>
</nav>`, 

  data(){
    return {
      role: localStorage.getItem("role"),
      search_query:null,
      id:localStorage.getItem("id"),
      token:localStorage.getItem("auth-token")
    }
  }, 
  computed:{
    is_logged_in(){
      if( localStorage.getItem("auth-token")){
        return true
      return false //to show login or logout, it has to be a computed property otherwise it won't refresh on its own
  }}
},

  methods:{
    async logout(){
      localStorage.removeItem("role")
      localStorage.removeItem("auth-token")
      localStorage.removeItem("id")
      //update logout time to send email remainder
      const res=await fetch(`/logout/${this.id}`,{
        headers:{
          "Authentication-Token":this.token
        }
      })

      if(res.ok){
        this.$router.push("/login")  //will be 
      }
      else{
        console.log("There was an error while logging out")
      }
    }, 

    search(){
      //redirect to search page and pass the query String along, and there in mounted function, make a request to the search api
      this.$router.push(`/search/${this.search_query}`)
      console.log("redirect to search page ") 
    }
  }
}