import axios from '../../../../../variables/axiosConfig';

export const sendRequest = async (form) => {
    const res = await axios.post('/api/send-request', form);
    return res.data;
}