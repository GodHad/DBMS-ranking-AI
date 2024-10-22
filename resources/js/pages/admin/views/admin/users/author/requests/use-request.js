import axios from "../../../../../variables/axiosConfig";

const getAuthors = async () => {
    const { data } = await axios.get('/api/get-authors');
    return data.authors.map(author => ({ ...author.user, approved: author.approved, userRoleId: author.id }));
}

const getAuthor = async (id) => {
    const { data } = await axios.get(`/api/get-author?id=${id}`);
    return data.author;
}

const createAuthor = async ({ author }) => {
    const { data } = await axios.post('/api/create-author', author);
    return data;
}

const updateAuthor = async ({ author }) => {
    const { data } = await axios.post(`/api/update-author?id=${author.id}`, author);
    return data;
}

const deleteAuthor = async (id) => {
    await axios.delete(`/api/delete-author?id=${id}`);
}

export {
    getAuthor,
    getAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor
}