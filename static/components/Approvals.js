//shows links to Category Addition, Deletion and Product deletion from the database, based on store managers recommendations
export default{
    template: `
    <div>
    <h3>Store Manager Approval Requests</h3>
    <br>
    
    <main>
            <ul class="list-group list-group-flush">
                
                <li class="list-group-item"> <router-link to='/categories_approval'>Approve Categories</router-link> </li>
                <li class="list-group-item"><router-link to="/product_approvals">Product Deletion Requests</router-link></li>
                
                
            </ul>
        </main>
    </div>`
}