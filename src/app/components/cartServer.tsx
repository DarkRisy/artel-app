export interface CartItem {
    Description: string;
    id: number;
    Name: string;
    Price: number;
    Image: string;
  }
  
  export interface GetDataResponse {
    data: CartItem[];
  }
  
  export async function getData(): Promise<GetDataResponse> {
    const res = await fetch('http://localhost:3000/api/cart');
    return res.json();
  }
  
  export async function deleteItem(item: CartItem): Promise<any> {
    const res = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  }
  
  export async function createOrder(item: CartItem): Promise<any> {
    const res = await fetch('http://localhost:3000/api/cart/AddOrder', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  }