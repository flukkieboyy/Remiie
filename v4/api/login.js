export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // ดึงรหัสผ่านลับมาจาก Vercel Environment Variables
    const correctUser = process.env.ADMIN_USER; 
    const correctPass = process.env.ADMIN_PASS;

    if (username === correctUser && password === correctPass) {
        // ถ้ารหัสตรงกัน ให้ผ่าน
        res.status(200).json({ success: true });
    } else {
        // ถ้ารหัสผิด
        res.status(401).json({ error: "Invalid credentials" });
    }
}