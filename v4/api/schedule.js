// ไฟล์นี้คือ Backend สำหรับดึงและบันทึกตารางงาน
export default async function handler(req, res) {
    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;
    const ADMIN_PASS = process.env.ADMIN_PASS; // รหัสผ่านความลับของคุณ

    if (!KV_URL || !KV_TOKEN) {
        return res.status(500).json({ error: "Database not connected" });
    }

    // 1. ถ้าเป็นการ "ดึงข้อมูล" ไปโชว์หน้าเว็บ (ใครก็ดูได้)
    if (req.method === 'GET') {
        try {
            const response = await fetch(`${KV_URL}/get/remie_schedule`, {
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });
            const data = await response.json();
            
            // ถ้ามีข้อมูลให้ส่งกลับไป ถ้าไม่มีให้ส่ง Array ว่าง
            const schedules = data.result ? JSON.parse(data.result) : [];
            return res.status(200).json(schedules);
        } catch (error) {
            return res.status(500).json({ error: "Failed to load schedule" });
        }
    }

    // 2. ถ้าเป็นการ "บันทึก/แก้ไขข้อมูล" (ต้องมีรหัสผ่าน)
    if (req.method === 'POST') {
        const { scheduleData, token } = req.body;

        // เช็คว่ารหัสผ่านตรงกับที่คุณตั้งไว้ใน Vercel ไหม
        if (token !== ADMIN_PASS) {
            return res.status(401).json({ error: "ACCESS DENIED: Wrong Password" });
        }

        try {
            // บันทึกลงฐานข้อมูล
            await fetch(`${KV_URL}/set/remie_schedule`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${KV_TOKEN}` },
                body: JSON.stringify(JSON.stringify(scheduleData))
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: "Failed to save schedule" });
        }
    }

    res.status(405).json({ error: "Method not allowed" });
}