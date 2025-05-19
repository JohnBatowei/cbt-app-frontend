import axios from "axios";

export default axios.create({
    baseURL : '/api/st'
})
// export default axios.create({
//     baseURL : 'http://localhost:3800/api/st'
// })