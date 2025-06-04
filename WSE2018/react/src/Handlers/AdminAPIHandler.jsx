import axios from "axios";

export const BASE_URL = "http://localhost:8000";

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

export function getUserData(callback = (data) => { }) {
    const AdminLoginToken = localStorage.getItem('AdminLoginToken');
    if (!AdminLoginToken) {
        callback(false);
        return;
    };

    axios.defaults.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${AdminLoginToken}`,
    }

    axios.get('/api/user').then(res => {
        if (res.status === 200) callback(res.data);
    }).catch((e) => {
        localStorage.removeItem('AdminLoginToken');
        callback(false);
    });
}

export function loginUser(formData, callback = (data, err) => {}) {
    axios.post('/api/login', formData).then(res => {
        if (res.status === 200) {
            localStorage.setItem('AdminLoginToken', res.data.token);
            getUserData(callback);
        } else {
            callback(null, res.data);
        }
    }).catch(e => {
        callback(false, ["Invalid credentials"]);
        console.error(e);
    });
}

export function getAdminData(callback = (data) => {}) {
    axios.get('/api/admindata').then(res => {
        callback(res.data);
    }).catch(e => {
        console.error(e);
    });
}

export function updateOrderStatus(orderId, status, remark, callback = () => {}) {
    axios.post('/api/updateorderstatus', {
        orderId: orderId,
        status: status,
        remark: remark
    }).then(() => {
        callback();
    });
}