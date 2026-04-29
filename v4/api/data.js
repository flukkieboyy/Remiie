// ไฟล์ api/data.js
export default async function handler(req, res) {
    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (!KV_URL || !KV_TOKEN) {
        return res.status(500).json({ error: "Database setup missing! กรุณาเปิด KV Database ใน Vercel" });
    }

    // 1. ส่งข้อมูลให้หน้าเว็บแสดงผล (GET)
    if (req.method === 'GET') {
        try {
            const response = await fetch(`${KV_URL}/get/remie_os_data`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
            const data = await response.json();
            return res.status(200).json(data.result ? JSON.parse(data.result) : null);
        } catch (e) { return res.status(500).json({ error: "Read Error" }); }
    }

    // 2. เช็ครหัสผ่าน และ บันทึกข้อมูล (POST)
    if (req.method === 'POST') {
        const { token, action, payload } = req.body;

        // เช็ครหัสผ่าน (หัวใจสำคัญ!)
        if (token !== ADMIN_PASS) {
            return res.status(401).json({ error: "รหัสผ่านผิด! กรุณาลองใหม่" });
        }

        if (action === "login") return res.status(200).json({ success: true });

        if (payload) {
            try {
                await fetch(`${KV_URL}/set/remie_os_data`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${KV_TOKEN}` },
                    body: JSON.stringify(JSON.stringify(payload))
                });
                return res.status(200).json({ success: true });
            } catch (e) { return res.status(500).json({ error: "Save Error" }); }
        }
    }

    res.status(405).json({ error: "Method not allowed" });
}
