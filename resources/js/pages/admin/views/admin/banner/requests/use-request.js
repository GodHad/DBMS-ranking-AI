import axios from "../../../../../../variables/axiosConfig";

const getBanners = async () => {
    const res = await axios.get('/api/get-banners');
    return res.data.banners;
}

const createBanner = async ({ banner }) => {
    const res = await axios.post('/api/create-banner', banner)
    return res.data
}

const updateBanner = async ({ id, banner }) => {
    const res = await axios.post(`/api/update-banner?id=${id}`, banner)
    return res.data
}

const deleteBanner = async (id) => {
    const res = await axios.delete(`/api/delete-banner?id=${id}`)
    return res.data;
}

export {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner
}