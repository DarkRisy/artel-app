const API_BASE_URL = process.env.BASE_URL;


export async function getStage() {
    const res = await fetch(`/api/user/stage`);
    return res.json();
  }

export async function getData() {
  const res = await fetch(`/api/user`);
  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }
  return res.json();
}

export async function getOrder() {
    const res = await fetch(`/api/user/orders`);
    return res.json();
}

export async function UpdateUser(user) {
    const res = await fetch(`/api/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return res.json();
}

export async function DeleteUser(user) {
    const res = await fetch(`/api/admin/deleteUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return res.json();
}
