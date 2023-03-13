export interface User {
    signature: string;
    name?: string;
    userAgent?: string;
}


if (localStorage.getItem("user") === null) {
    let signature = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("user", JSON.stringify({
        name: "Anonymous",
        signature: signature,
        userAgent: navigator.userAgent
    }));
}

export const currUser: User = JSON.parse(localStorage.getItem("user") as string);
