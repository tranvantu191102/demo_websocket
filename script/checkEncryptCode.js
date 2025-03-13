import { ENCRYPT_PASSWORD } from "./constants/encryptPassword.js";

const IV = 'c29tZS1yYW5kb20taXY';
const SALT = 'cmFuZG9tLXNhbHQxMjM';
const TEXT = 'On a warm summer morning, Emily decided to explore the dense forest near her village. She packed a small bag with water, a sandwich, and her favorite book—a worn copy of "The Hobbit." As she ventured deeper, the sunlight filtered through the towering oaks, casting playful shadows on the mossy ground. Birds chirped overhead, and a gentle breeze rustled the leaves. After hours of walking, she stumbled upon an ancient stone well, its edges carved with mysterious runes. Curious, she leaned in, wondering what secrets it held from a time long forgotten.';

const data = {
    "iv": "c29tZS1yYW5kb20taXY",
    "salt": "cmFuZG9tLXNhbHQxMjM",
    "encrypted": "yzcGu8R11J0xNhP6Mmc9kR7j06IVHVGmOhaMeVcHThGxR4QGkld7+93mtyxNjOd5Fxx3aDEROZ3Fge64L7vlxRqpOcZyfnsMk85XYfS9tns5jpJmaz2BPRXwxm9k+aVr0CBdzAdHvkY6UVPYe1dIkLgC6bvia+Ut+UGU3M1uIZoyo4nZe3qKbTzXxXLADrcbwpRJOzmmY4yblxcac9kD/7OiXI3v012d+f8ii95BXaeaBHyeCAuXV/ueCsekZAM8N+2lVnymlr8Ky8D2BhbsWsWedAJ+nB3uU7uTpl0OUYjWbwnOyl1HHfhmobWqlf1Gk8VT2ZHl7j/348iQXEK8bVhN7sd6swEPJbv7AwxJEOCBDbIPQDDRUUu2QYIRt6IMFAk0QBPpVFYOln8EJcIcdLnz+yrjxkPr/Yqyf/P6wwrU+0fSFGcYq5bwFTlGRJgREiMY3Na56oYVR1vpzVmS0IaWTHHbqN7znTQ9qzlj2qjFyUWpB1+RwZEBRpiitnIfiSRUgz3LxFl3zkz84Ib7yhx3r3uk8xpyLSXBBgsOrwrBseNDoP9ZcGpg2ZT9hBkAg5AwzimpVqgvZ2W5aulz/M4PHFsNUhT6JmT4+i1+6E5MEqLyOG3mf4NGaoSkuzdyWX2YXOTRJcvGH2BtwOupLsXVGo2/Fn2qwAb/eDwYKIYvKZcjG9LS3ejnu8gVb3TXyEOF8eBe35Db1DrqKFhOVlJflKBH1y8m78otfp5T5fV10T2y4Z86fGsAqw=="
}

export async function checkEncryptCode() {

    const encryptedData = await encryptAES256(TEXT, ENCRYPT_PASSWORD);

    console.log("[Test case - CheckEncryptCode] encryptedData: ", encryptedData);
    console.log("[Test case - CheckEncryptCode] data sample: ", data);
    return new Promise((resolve) => {
        try {
            resolve(
                {
                    status: encryptedData.encrypted === data.encrypted ? 'Passed' : 'Failed',
                    note: 'Check encrypt code'
                });
        } catch (error) {
            resolve(
                {
                    status: 'Failed',
                    note: error
                });
        }
    });
}

export async function checkDecryptCode() {

    const decryptedText = await decryptAES256(data, ENCRYPT_PASSWORD);

    console.log("[Test case - CheckDecryptCode] decryptedText: ", decryptedText);
    console.log("[Test case - CheckDecryptCode] data sample: ", TEXT);

    return new Promise((resolve) => {
        try {
            resolve(
                {
                    status: decryptedText === TEXT ? 'Passed' : 'Failed',
                    note: 'Check decrypt code'
                });
        } catch (error) {
            resolve(
                {
                    status: 'Failed',
                    note: error
                });
        }
    });
}

async function encryptAES256(plainText, password) {
    try {
        const encoder = new TextEncoder();

        const iv = new Uint8Array([...atob(IV)].map(ch => ch.charCodeAt(0)));
        const salt = new Uint8Array([...atob(SALT)].map(ch => ch.charCodeAt(0)));

        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );


        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encoder.encode(plainText)
        );

        return {
            iv: btoa(String.fromCharCode(...iv)),
            salt: btoa(String.fromCharCode(...salt)),
            encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw error;
    }
}


async function decryptAES256(encryptedData, password) {
    try {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const iv = new Uint8Array([...atob(encryptedData.iv)].map(ch => ch.charCodeAt(0)));
        const salt = new Uint8Array([...atob(encryptedData.salt)].map(ch => ch.charCodeAt(0)));
        const encrypted = new Uint8Array([...atob(encryptedData.encrypted)].map(ch => ch.charCodeAt(0)));

        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encrypted
        );

        return decoder.decode(decrypted);
    } catch (error) {
        console.error("Decryption error:", error);
        throw error;
    }
}