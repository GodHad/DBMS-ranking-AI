import axios from "../../../../../variables/axiosConfig";

const getVendors = async () => {
    const { data } = await axios.get('/api/get-vendor-managers');
    return data.vendors.map(vendor => ({ ...vendor.user, approved: vendor.approved, userRoleId: vendor.id }));
}

const getVendor = async (id) => {
    const { data } = await axios.get(`/api/get-vendor-manager?id=${id}`);
    return data.vendor;
}

const createVendor = async ({ vendor }) => {
    const { data } = await axios.post('/api/create-vendor-manager', vendor);
    return data;
}

const updateVendor = async ({ vendor }) => {
    const { data } = await axios.post(`/api/update-vendor-manager?id=${vendor.id}`, vendor);
    return data;
}

const deleteVendor = async (id) => {
    await axios.delete(`/api/delete-vendor-manager?id=${id}`);
}

export {
    getVendor,
    getVendors,
    createVendor,
    updateVendor,
    deleteVendor
}