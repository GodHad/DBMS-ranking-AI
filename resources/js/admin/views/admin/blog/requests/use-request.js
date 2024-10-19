import axios from 'axios';

const getEncyclopedias = async () => {
    const { data } = await axios.get('/api/get-encyclopedias');
    return data.encyclopedias;
}

const getEncyclopedia = async (id) => {
    const { data } = await axios.get(`/api/get-encyclopedia?id=${id}`);
    return data.encyclopedia;
}

const createEncyclopedia = async ({ encyclopedia }) => {
    const { data } = await axios.post('/api/create-encyclopedia', encyclopedia);
    return data;
}

const updateEncyclopedia = async ({ encyclopedia }) => {
    const { data } = await axios.put(`/api/update-encyclopedia?id=${encyclopedia.id}`, encyclopedia);
    return data;
}

const deleteEncyclopedia = async (id) => {
    await axios.delete(`/api/delete-encyclopedia?id=${id}`);
}

export {
    getEncyclopedia,
    getEncyclopedias,
    createEncyclopedia,
    updateEncyclopedia,
    deleteEncyclopedia
}