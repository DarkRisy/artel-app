
const BASE_URL = process.env.BASE_URL

export async function isAuthenticated() {
    const res = await fetch(`/api/isAuthenticated`);
    return res.json();
  }
  
  export async function getData() {
    const res = await fetch(`/api/products`);
    return res.json();
  }
