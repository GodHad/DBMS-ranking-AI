import axios from "../../../../../../variables/axiosConfig";

const getBlogs = async () => {
    const { data } = await axios.get('/api/get-blogs');
    return data.blogs;
}

const getTags = async () => {
    const { data } = await axios.get('/api/blog/get-tags');
    return data.tags;
}

const getCategories = async () => {
    const { data } = await axios.get('/api/blog/get-categories');
    return data.categories;
}

const getBlog = async (id) => {
    const { data } = await axios.get(`/api/get-blog?id=${id}`);
    return data.blog;
}

const createBlog = async ({ blog }) => {
    const { data } = await axios.post('/api/create-blog', blog);
    return data;
}

const updateBlog = async ({ id, blog }) => {
    const { data } = await axios.post(`/api/update-blog?id=${id}`, blog);
    return data;
}

const deleteBlog = async (id) => {
    await axios.delete(`/api/delete-blog?id=${id}`);
}

export {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getTags,
    getCategories
}