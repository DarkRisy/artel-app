
const BASE_URL = process.env.BASE_URL

export async function isAuthenticated() {
    const res = await fetch(`http://sk-artel.ru/api/isAuthenticated`);
    return res.json();
  }
  
  export async function getData() {
    const res = await fetch(`http://sk-artel.ru/api/products`);
    return res.json();
  }
