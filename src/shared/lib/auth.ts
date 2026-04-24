    
export async function login(username: string, senha: string){
    const response = await fetch('http://localhost:8000/login/', {
            method:"POST",
            credentials: "include",
            headers: {  
                "Content-Type": "application/json"
            },
            body:JSON.stringify({username, senha}),
        })
        const data = await response.json()
        return{status: response.status, data}
}

export async function getMe() {
  const res = await fetch("http://localhost:8000/me/", {
    credentials: "include",
  });

  return res.json();
}

