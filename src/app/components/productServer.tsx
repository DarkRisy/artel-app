export async function isAuthenticated() {
    const res = await fetch('http://localhost:3000/api/isAuthenticated');
    return res.json();
  }
  
  export async function getData() {
    const res = await fetch('http://localhost:3000/api/products');
    return res.json();
  }
  
  export async function postData(product: any) {
    const res = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    return res.json();
  }