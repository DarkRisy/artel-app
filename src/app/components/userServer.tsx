


  export async function getStage() {
    const res = await fetch('http://localhost:3000/api/user/stage');
    return res.json();
  }
export async function getData() {
    const res = await fetch('http://localhost:3000/api/user');
    return res.json();
}

export async function getOrder() {
    const res = await fetch('http://localhost:3000/api/user/orders');
    return res.json();
}

export async function UpdateUser(user) {
    const res = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return res.json();
}

export async function DeleteUser(user) {
    const res = await fetch('http://localhost:3000/api/admin/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return res.json();
}
