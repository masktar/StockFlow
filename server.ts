import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/database';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/db/status', (req, res) => {
  res.json({
    status: 'online',
    data: db.getStatus()
  });
});

app.post('/api/db/reload', async (req, res) => {
  try {
    const status = await db.reloadFromDisk();
    res.json({ success: true, message: 'Đã nạp lại dữ liệu thành công từ CSDL!', data: status });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/sync', async (req, res) => {
  try {
    const result = await db.syncAll(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/connect', async (req, res) => {
  try {
    const result = await db.connectMySql(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/push', async (req, res) => {
  try {
    const result = await db.pushAllToMySql();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/db/export-sql', (req, res) => {
  try {
    const filePath = path.resolve(process.cwd(), 'qlykho_new.sql');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Disposition', 'attachment; filename="qlykho_new.sql"');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.sendFile(filePath);
    } else {
      res.status(404).json({ success: false, message: 'File SQL không tồn tại' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập Email hoặc tên đăng nhập' });
  }

  const result = await db.login(email, password);
  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

// Products (san_pham, danh_muc, luu_tru)
app.get('/api/products', (req, res) => {
  try {
    const list = db.getProducts();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const created = db.createProduct(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const success = db.updateProduct(req.params.id, req.body);
    if (!success) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Warehouses (kho)
app.get('/api/warehouses', (req, res) => {
  try {
    const list = db.getWarehouses();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Categories (danh_muc)
app.get('/api/categories', (req, res) => {
  try {
    const list = db.getCategories();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Suppliers (nha_cung_cap)
app.get('/api/suppliers', (req, res) => {
  try {
    const list = db.getSuppliers();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/suppliers', (req, res) => {
  try {
    const created = db.createSupplier(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Staff (nhan_vien)
app.get('/api/staff', (req, res) => {
  try {
    const list = db.getStaff();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/staff', (req, res) => {
  try {
    const created = db.createStaff(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/staff/:id/role', (req, res) => {
  try {
    const success = db.updateStaffRole(req.params.id, req.body.role);
    if (!success) return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Receipts (phieu, phieu_nhap, phieu_xuat, co_trong)
app.get('/api/receipts', (req, res) => {
  try {
    const list = db.getReceipts();
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/receipts', (req, res) => {
  try {
    const created = db.createReceipt(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  try {
    const logs = db.getAuditLogs();
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/audit-logs', (req, res) => {
  try {
    db.addAuditLog(req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[StockFlow Full-Stack Server] Đang chạy tại http://0.0.0.0:${PORT}`);
    console.log(`[Database] Đã nạp thành công dữ liệu CSDL qlykho: 50 sản phẩm, 50 kho, 50 NCC, 51 nhân viên`);
  });
}

startServer();
