import axios from 'axios';

// const csrfToken = document.querySelector('meta[name="csrf-token"]');

// if (csrfToken) {
//     axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.getAttribute('content');
// } else {
//     console.error('CSRF token not found');
// }

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default axios;