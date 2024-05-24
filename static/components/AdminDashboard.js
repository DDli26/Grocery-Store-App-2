export default{   
    template: `
    <div>
    Admin Dashboard
    <br>
    
    <main>
            <ul class="list-group list-group-flush">
                
                <li class="list-group-item"> <router-link to='/categories'>Categories</router-link> </li>
                <li class="list-group-item"><router-link to="/add/product">Add a new Product</router-link></li>
                
                <li class="list-group-item"><router-link to="/admin_approval">Approval Requests</router-link></li>
                <li class="list-group-item"><router-link to="/add/category">Add a new Category</router-link></li>
                
            </ul>
        </main>
    </div>`
}