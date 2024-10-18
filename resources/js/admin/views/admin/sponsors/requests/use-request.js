import axios from 'axios';

const getSponsors = async () => {
    const { data } = await axios.get('/api/get-sponsors');
    return data.sponsors;
}

const getSponsor = async (id) => {
    const { data } = await axios.get(`/api/get-sponsor?id=${id}`);
    return data.sponsor;
}

const createSponsor = async ({ sponsor }) => {
    const { data } = await axios.post('/api/create-sponsor', sponsor);
    return data;
}

const updateSponsor = async ({ sponsor }) => {
    const { data } = await axios.post(`/api/update-sponsor`, sponsor);
    return data;
}

const deleteSponsor = async (id) => {
    await axios.delete(`/api/delete-sponsor?id=${id}`);
}

export {
    getSponsors,
    getSponsor,
    createSponsor,
    updateSponsor,
    deleteSponsor
}