export const APP_URL = import.meta.env.VITE_APP_URL;

export const generateSlug = (title) => {
    return title
        .toLowerCase()                  
        .trim()                         
        .replace(/[\s\W-]+/g, '-')      
        .replace(/^-+|-+$/g, '');       
}