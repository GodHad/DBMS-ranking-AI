import axios from '../../../../../variables/axiosConfig';

export const sendRequest = async (form) => {
    const res = await axios.post('/api/claim-dbms', form);
    return res.data;
}