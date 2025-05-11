
const BASE_URL = process.env.BASE_URL

export async function isAuthenticated() {
    const res = await fetch(`http://92.242.60.192/api/isAuthenticated`);
    return res.json();
  }
  
  export async function getData() {
    const res = await fetch(`http://92.242.60.192/api/products`);
    return res.json();
  }
