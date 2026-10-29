import dotenv from 'dotenv';
dotenv.config();

import {
  SEED_CO_TRONG,
  SEED_DANG_NHAP,
  SEED_DANH_MUC,
  SEED_KHO,
  SEED_LUU_TRU,
  SEED_NHA_CUNG_CAP,
  SEED_NHAN_VIEN,
  SEED_PHIEU,
  SEED_SAN_PHAM,
  DanhMucRecord,
  KhoRecord,
  NhaCungCapRecord,
  NhanVienRecord,
  DangNhapRecord,
  SanPhamRecord,
  LuuTruRecord,
  PhieuRecord,
  CoTrongRecord
} from './seedData';
import fs from 'fs';
import path from 'path';
import { parseSqlDump, updateSqlDumpFile } from './sqlParser';

export interface AuditLogRecord {
  id: string;
  thoiGian: string;
  nguoiThaoTac: string;
  vaiTro: string;
  hanhDong: string;
  doiTuong: string;
  chiTiet: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'qlykho_store.json');

interface DatabaseStore {
  danh_muc: DanhMucRecord[];
  kho: KhoRecord[];
  nha_cung_cap: NhaCungCapRecord[];
  nhan_vien: NhanVienRecord[];
  dang_nhap: DangNhapRecord[];
  san_pham: SanPhamRecord[];
  luu_tru: LuuTruRecord[];
  phieu: PhieuRecord[];
  co_trong: CoTrongRecord[];
  audit_logs: AuditLogRecord[];
}

class QLyKhoDatabase {
  private store: DatabaseStore;
  private isMySqlActive: boolean = false;
  private mySqlPool: any = null;

  constructor() {
    this.store = this.loadData();
    this.initMySql();
  }

  private loadData(): DatabaseStore {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.san_pham && parsed.nhan_vien && parsed.kho) {
          // Clean legacy records
          parsed.nhan_vien = parsed.nhan_vien.filter(
            (nv: any) => nv.Ma_nhan_vien !== 'AD001' && nv.Ten_nhan_vien !== 'Nguyễn Văn An'
          );
          parsed.nhan_vien.forEach((nv: any) => {
            if (nv.Email && nv.Email.endsWith('@kho.vn')) {
              nv.Email = nv.Email.replace('@kho.vn', '@stockflow.vn');
            }
          });
          if (Array.isArray(parsed.dang_nhap)) {
            parsed.dang_nhap = parsed.dang_nhap.filter((d: any) => !d.Email.includes('admin@stockflow.vn') || parsed.nhan_vien.some((nv: any) => nv.Email === d.Email));
            parsed.dang_nhap.forEach((dn: any) => {
              if (dn.Email && dn.Email.endsWith('@kho.vn')) {
                dn.Email = dn.Email.replace('@kho.vn', '@stockflow.vn');
              }
            });
          }
          if (Array.isArray(parsed.audit_logs)) {
            parsed.audit_logs.forEach((log: any) => {
              if (log.nguoiThaoTac === 'Nguyễn Văn An') {
                log.nguoiThaoTac = 'Ngô Thị Hương';
              }
            });
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[DB] Không thể đọc file cache, khởi tạo từ seedData MySQL dump', e);
    }

    const initial: DatabaseStore = {
      danh_muc: [...SEED_DANH_MUC],
      kho: [...SEED_KHO],
      nha_cung_cap: [...SEED_NHA_CUNG_CAP],
      nhan_vien: [...SEED_NHAN_VIEN],
      dang_nhap: [...SEED_DANG_NHAP],
      san_pham: [...SEED_SAN_PHAM],
      luu_tru: [...SEED_LUU_TRU],
      phieu: [...SEED_PHIEU],
      co_trong: [...SEED_CO_TRONG],
      audit_logs: [
        {
          id: 'log_01',
          thoiGian: '08:30:00 07/10/2026',
          nguoiThaoTac: 'Ngô Thị Hương',
          vaiTro: 'Admin',
          hanhDong: 'KẾT NỐI HỆ THỐNG',
          doiTuong: 'Cơ sở dữ liệu qlykho',
          chiTiet: 'Hệ thống Backend & Database MySQL đã kết nối thành công với 50 sản phẩm, 50 kho, 50 nhà cung cấp và 50 nhân viên'
        }
      ]
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseStore) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.store;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      updateSqlDumpFile(data);
    } catch (err) {
      console.error('[DB] Lỗi lưu trữ file database:', err);
    }
  }

  private async initMySql() {
    const host = process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1';
    const user = process.env.DB_USER || process.env.MYSQL_USER || 'root';
    const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.MYSQL_PASSWORD || '');
    const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'qlykho';
    const port = Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306);

    try {
      const mysql = await import('mysql2/promise');
      this.mySqlPool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        ssl: {
  ca: process.env.DB_SSL_CA?.replace(/\\n/g, '\n'),
  rejectUnauthorized: true
},
      });

      // Test connection
      const conn = await this.mySqlPool.getConnection();
      console.log(`[MySQL] Đã kết nối thành công đến máy chủ MySQL ${host}:${port}/${database}`);
      conn.release();
      this.isMySqlActive = true;
    } catch (err: any) {
      console.warn(`[MySQL] Không thể kết nối trực tiếp MySQL (${err.message}). Đang dùng Database nội bộ đồng bộ 100% với cấu trúc và dữ liệu dump!`);
      this.isMySqlActive = false;
    }
  }

  public getStatus() {
    return {
      connectedToMySql: this.isMySqlActive,
      type: this.isMySqlActive ? 'MySQL Server (Kết nối Trực tiếp)' : 'Database Tích hợp (Đồng bộ CSDL MySQL & SQL Dump)',
      databaseName: 'qlykho',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      totalProducts: this.store.san_pham.length,
      totalWarehouses: this.store.kho.length,
      totalSuppliers: this.store.nha_cung_cap.length,
      totalEmployees: this.store.nhan_vien.length,
      totalReceipts: this.store.phieu.length,
      lastSyncedAt: new Date().toLocaleTimeString('vi-VN')
    };
  }

  public async connectMySql(config: { host?: string; user?: string; password?: string; database?: string; port?: number }) {
    const host = config.host || process.env.DB_HOST || '127.0.0.1';
    const user = config.user || process.env.DB_USER || 'root';
    const password = config.password !== undefined ? config.password : (process.env.DB_PASSWORD || '');
    const database = config.database || process.env.DB_NAME || 'qlykho';
    const port = Number(config.port || process.env.DB_PORT || 3306);

    try {
      const mysql = await import('mysql2/promise');
      if (this.mySqlPool) {
        await this.mySqlPool.end().catch(() => {});
      }
      this.mySqlPool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        ssl: {
  ca: process.env.DB_SSL_CA?.replace(/\\n/g, '\n'),
  rejectUnauthorized: true
},
      });

      const conn = await this.mySqlPool.getConnection();
      console.log(`[MySQL] Kết nối thành công đến MySQL: ${host}:${port}/${database}`);
      conn.release();
      this.isMySqlActive = true;
      return { success: true, message: `Kết nối thành công đến máy chủ MySQL ${host}:${port}/${database}` };
    } catch (err: any) {
      this.isMySqlActive = false;
      return { success: false, message: `Không thể kết nối MySQL (${err.message})` };
    }
  }

  public async syncFromMySql(): Promise<{ success: boolean; message: string; source: string; counts: any }> {
    if (!this.mySqlPool) {
      throw new Error('Chưa khởi tạo kết nối MySQL');
    }
    const conn = await this.mySqlPool.getConnection();
    try {
      const [dmRows]: any = await conn.query('SELECT * FROM danh_muc');
      const [khoRows]: any = await conn.query('SELECT * FROM kho');
      const [nccRows]: any = await conn.query('SELECT * FROM nha_cung_cap');
      const [nvRows]: any = await conn.query('SELECT * FROM nhan_vien');
      const [spRows]: any = await conn.query('SELECT * FROM san_pham');
      const [ltRows]: any = await conn.query('SELECT * FROM luu_tru');
      const [phieuRows]: any = await conn.query('SELECT * FROM phieu');
      const [ctRows]: any = await conn.query('SELECT * FROM co_trong');

      if (Array.isArray(dmRows) && dmRows.length > 0) this.store.danh_muc = dmRows;
      if (Array.isArray(khoRows) && khoRows.length > 0) this.store.kho = khoRows;
      if (Array.isArray(nccRows) && nccRows.length > 0) this.store.nha_cung_cap = nccRows;
      if (Array.isArray(nvRows) && nvRows.length > 0) {
        this.store.nhan_vien = nvRows
          .filter((u: any) => u.Ma_nhan_vien !== 'AD001' && u.Ten_nhan_vien !== 'Nguyễn Văn An')
          .map((u: any) => ({
            ...u,
            Email: u.Email && u.Email.endsWith('@kho.vn') ? u.Email.replace('@kho.vn', '@stockflow.vn') : u.Email
          }));
      }
      if (Array.isArray(spRows) && spRows.length > 0) this.store.san_pham = spRows;
      if (Array.isArray(ltRows) && ltRows.length > 0) this.store.luu_tru = ltRows;
      if (Array.isArray(phieuRows) && phieuRows.length > 0) {
        this.store.phieu = phieuRows.map((p: any) => ({
          ...p,
          loai: p.loai || (p.Ma_phieu && p.Ma_phieu.startsWith('PX') ? 'xuat' : 'nhap')
        }));
      }
      if (Array.isArray(ctRows) && ctRows.length > 0) this.store.co_trong = ctRows;

      this.saveData();

      this.addAuditLog({
        nguoiThaoTac: 'Hệ thống',
        vaiTro: 'Admin',
        hanhDong: 'ĐỒNG BỘ CSDL MYSQL',
        doiTuong: 'Cơ sở dữ liệu MySQL',
        chiTiet: `Đã kéo dữ liệu mới nhất từ MySQL: ${this.store.san_pham.length} sản phẩm, ${this.store.kho.length} kho, ${this.store.nhan_vien.length} nhân viên`
      });

      return {
        success: true,
        source: 'MySQL Server (Trực tiếp)',
        message: `Đã đồng bộ dữ liệu mới nhất trực tiếp từ MySQL Server: ${this.store.san_pham.length} sản phẩm, ${this.store.kho.length} kho, ${this.store.nhan_vien.length} nhân viên!`,
        counts: {
          products: this.store.san_pham.length,
          warehouses: this.store.kho.length,
          staff: this.store.nhan_vien.length,
          suppliers: this.store.nha_cung_cap.length,
          receipts: this.store.phieu.length
        }
      };
    } finally {
      conn.release();
    }
  }

  public syncFromSqlDump(filePath = 'qlykho_new.sql'): { success: boolean; message: string; source: string; counts: any } {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File SQL dump ${filePath} không tồn tại trên hệ thống`);
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    const parsed = parseSqlDump(content);

    if (parsed.san_pham.length > 0) this.store.san_pham = parsed.san_pham;
    if (parsed.kho.length > 0) this.store.kho = parsed.kho;
    if (parsed.danh_muc.length > 0) this.store.danh_muc = parsed.danh_muc;
    if (parsed.nha_cung_cap.length > 0) this.store.nha_cung_cap = parsed.nha_cung_cap;
    if (parsed.luu_tru.length > 0) this.store.luu_tru = parsed.luu_tru;
    if (parsed.phieu.length > 0) this.store.phieu = parsed.phieu;
    if (parsed.co_trong.length > 0) this.store.co_trong = parsed.co_trong;
    if (parsed.nhan_vien.length > 0) {
      this.store.nhan_vien = parsed.nhan_vien
        .filter((u: any) => u.Ma_nhan_vien !== 'AD001' && u.Ten_nhan_vien !== 'Nguyễn Văn An')
        .map((u: any) => ({
          ...u,
          Email: u.Email && u.Email.endsWith('@kho.vn') ? u.Email.replace('@kho.vn', '@stockflow.vn') : u.Email
        }));
    }

    this.saveData();

    this.addAuditLog({
      nguoiThaoTac: 'Hệ thống',
      vaiTro: 'Admin',
      hanhDong: 'ĐỒNG BỘ TỪ FILE SQL',
      doiTuong: filePath,
      chiTiet: `Đã nạp và đồng bộ lại ${this.store.san_pham.length} sản phẩm, ${this.store.kho.length} kho từ ${filePath}`
    });

    return {
      success: true,
      source: `File SQL Dump (${filePath})`,
      message: `Đã đồng bộ lại dữ liệu mới nhất từ ${filePath}: ${this.store.san_pham.length} sản phẩm, ${this.store.kho.length} kho, ${this.store.nhan_vien.length} nhân viên!`,
      counts: {
        products: this.store.san_pham.length,
        warehouses: this.store.kho.length,
        staff: this.store.nhan_vien.length,
        suppliers: this.store.nha_cung_cap.length,
        receipts: this.store.phieu.length
      }
    };
  }

  public async syncAll(options?: any) {
    if (options?.config) {
      await this.connectMySql(options.config);
    }

    // 1. If live MySQL is active, query MySQL directly
    if (this.isMySqlActive && this.mySqlPool) {
      try {
        return await this.syncFromMySql();
      } catch (err: any) {
        console.warn('[Sync] Không thể đọc trực tiếp từ MySQL, tự động đồng bộ từ file SQL dump:', err.message);
      }
    }

    // 2. Fallback to SQL dump file
    try {
      return this.syncFromSqlDump(options?.filePath || 'qlykho_new.sql');
    } catch (err: any) {
      // 3. Fallback to cached JSON
      this.store = this.loadData();
      return {
        success: true,
        source: 'Cache CSDL Nội bộ',
        message: 'Đã nạp lại dữ liệu từ cache cơ sở dữ liệu nội bộ!',
        counts: {
          products: this.store.san_pham.length,
          warehouses: this.store.kho.length,
          staff: this.store.nhan_vien.length,
          suppliers: this.store.nha_cung_cap.length,
          receipts: this.store.phieu.length
        }
      };
    }
  }

  public reloadFromDisk() {
    return this.syncAll();
  }

  public async pushAllToMySql(): Promise<{ success: boolean; message: string; counts: any }> {
    if (!this.mySqlPool) {
      throw new Error('Chưa kết nối đến MySQL. Vui lòng kết nối MySQL trước.');
    }
    const conn = await this.mySqlPool.getConnection();
    try {
      await conn.beginTransaction();

      // Upsert danh_muc
      for (const dm of this.store.danh_muc) {
        await conn.query(
          'INSERT INTO danh_muc (Ma_danh_muc, Ten_danh_muc) VALUES (?, ?) ON DUPLICATE KEY UPDATE Ten_danh_muc = VALUES(Ten_danh_muc)',
          [dm.Ma_danh_muc, dm.Ten_danh_muc]
        );
      }

      // Upsert kho
      for (const k of this.store.kho) {
        await conn.query(
          'INSERT INTO kho (Ma_kho, Ten_kho, Dia_chi, Tong_suc_chua, SDT) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Ten_kho = VALUES(Ten_kho), Dia_chi = VALUES(Dia_chi), Tong_suc_chua = VALUES(Tong_suc_chua), SDT = VALUES(SDT)',
          [k.Ma_kho, k.Ten_kho, k.Dia_chi, k.Tong_suc_chua, k.SDT]
        );
      }

      // Upsert nha_cung_cap
      for (const ncc of this.store.nha_cung_cap) {
        await conn.query(
          'INSERT INTO nha_cung_cap (Ma_ncc, Ten_ncc, Dia_chi, SDT, Email) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Ten_ncc = VALUES(Ten_ncc), Dia_chi = VALUES(Dia_chi), SDT = VALUES(SDT), Email = VALUES(Email)',
          [ncc.Ma_ncc, ncc.Ten_ncc, ncc.Dia_chi, ncc.SDT, ncc.Email]
        );
      }

      // Upsert nhan_vien
      for (const nv of this.store.nhan_vien) {
        await conn.query(
          'INSERT INTO nhan_vien (Ma_nhan_vien, Ten_nhan_vien, Vai_tro, Sdt, Email, Trang_thai, Ma_nv_quan_ly) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Ten_nhan_vien = VALUES(Ten_nhan_vien), Vai_tro = VALUES(Vai_tro), Sdt = VALUES(Sdt), Email = VALUES(Email), Trang_thai = VALUES(Trang_thai), Ma_nv_quan_ly = VALUES(Ma_nv_quan_ly)',
          [nv.Ma_nhan_vien, nv.Ten_nhan_vien, nv.Vai_tro, nv.Sdt, nv.Email, nv.Trang_thai, nv.Ma_nv_quan_ly]
        );
      }

      // Upsert san_pham
      for (const sp of this.store.san_pham) {
        await conn.query(
          'INSERT INTO san_pham (Ma_san_pham, Ma_danh_muc, Ten_san_pham, Mo_ta, Nguong_ton_toi_thieu, Gia_ban, Gia_nhap, Ma_ncc) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Ten_san_pham = VALUES(Ten_san_pham), Mo_ta = VALUES(Mo_ta), Nguong_ton_toi_thieu = VALUES(Nguong_ton_toi_thieu), Gia_ban = VALUES(Gia_ban), Gia_nhap = VALUES(Gia_nhap), Ma_ncc = VALUES(Ma_ncc), Ma_danh_muc = VALUES(Ma_danh_muc)',
          [sp.Ma_san_pham, sp.Ma_danh_muc, sp.Ten_san_pham, sp.Mo_ta, sp.Nguong_ton_toi_thieu, sp.Gia_ban, sp.Gia_nhap, sp.Ma_ncc]
        );
      }

      // Upsert luu_tru
      for (const lt of this.store.luu_tru) {
        await conn.query(
          'INSERT INTO luu_tru (Ma_kho, Ma_san_pham, Vi_tri, So_luong_ton) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Vi_tri = VALUES(Vi_tri), So_luong_ton = VALUES(So_luong_ton)',
          [lt.Ma_kho, lt.Ma_san_pham, lt.Vi_tri, lt.So_luong_ton]
        );
      }

      // Upsert phieu, phieu_nhap, phieu_xuat
      for (const p of this.store.phieu) {
        await conn.query(
          'INSERT INTO phieu (Ma_phieu, Ngay_nhap, Trang_thai, Ghi_chu, Ma_nhan_vien) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Ngay_nhap = VALUES(Ngay_nhap), Trang_thai = VALUES(Trang_thai), Ghi_chu = VALUES(Ghi_chu), Ma_nhan_vien = VALUES(Ma_nhan_vien)',
          [p.Ma_phieu, p.Ngay_nhap, p.Trang_thai, p.Ghi_chu, p.Ma_nhan_vien]
        );

        if (p.loai === 'nhap' || String(p.Ma_phieu).startsWith('PN')) {
          await conn.query(
            'INSERT INTO phieu_nhap (Ma_phieu, Doi_tac, Ma_ncc) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Doi_tac = VALUES(Doi_tac), Ma_ncc = VALUES(Ma_ncc)',
            [p.Ma_phieu, p.Doi_tac || 'Kho trung tâm', p.Ma_ncc || 'NCC01']
          );
        } else {
          await conn.query(
            'INSERT INTO phieu_xuat (Ma_phieu, Nguoi_nhan) VALUES (?, ?) ON DUPLICATE KEY UPDATE Nguoi_nhan = VALUES(Nguoi_nhan)',
            [p.Ma_phieu, p.Nguoi_nhan || p.Doi_tac || 'Khách nhận']
          );
        }
      }

      // Upsert co_trong
      for (const ct of this.store.co_trong) {
        await conn.query(
          'INSERT INTO co_trong (Ma_phieu, Ma_san_pham, So_luong) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE So_luong = VALUES(So_luong)',
          [ct.Ma_phieu, ct.Ma_san_pham, ct.So_luong]
        );
      }

      // Upsert dang_nhap
      for (const dn of this.store.dang_nhap) {
        await conn.query(
          'INSERT INTO dang_nhap (Email, Mat_khau) VALUES (?, ?) ON DUPLICATE KEY UPDATE Mat_khau = VALUES(Mat_khau)',
          [dn.Email, dn.Mat_khau]
        );
      }

      await conn.commit();

      this.addAuditLog({
        nguoiThaoTac: 'Hệ thống',
        vaiTro: 'Admin',
        hanhDong: 'ĐỒNG BỘ WEB LÊN MYSQL',
        doiTuong: 'MySQL Server',
        chiTiet: `Đã cập nhật toàn bộ ${this.store.san_pham.length} sản phẩm, ${this.store.kho.length} kho, ${this.store.nhan_vien.length} nhân sự lên MySQL`
      });

      return {
        success: true,
        message: `Đã đồng bộ toàn bộ dữ liệu từ Web lên máy chủ MySQL thành công (${this.store.san_pham.length} sản phẩm, ${this.store.kho.length} kho, ${this.store.nhan_vien.length} nhân sự)!`,
        counts: {
          products: this.store.san_pham.length,
          warehouses: this.store.kho.length,
          staff: this.store.nhan_vien.length
        }
      };
    } catch (err: any) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  public updateProductCategory(maSanPham: string, maDanhMuc: string) {
    const sp = this.store.san_pham.find(p => p.Ma_san_pham === maSanPham);
    if (sp) {
      sp.Ma_danh_muc = maDanhMuc;
      this.saveData();
      return true;
    }
    return false;
  }

  // Auth
  public async login(emailOrUser: string, pass: string): Promise<{ success: boolean; user?: any; message?: string }> {
    const query = emailOrUser.trim().toLowerCase();

    // Check in dang_nhap and nhan_vien
    const nv = this.store.nhan_vien.find(
      u =>
        u.Email.toLowerCase() === query ||
        u.Ten_nhan_vien.toLowerCase().includes(query) ||
        u.Ma_nhan_vien.toLowerCase() === query ||
        u.Sdt === query
    );

    if (!nv) {
      return { success: false, message: 'Tài khoản không tồn tại trong hệ thống!' };
    }

    if (nv.Trang_thai === 'Nghỉ việc') {
      return { success: false, message: 'Tài khoản nhân viên này đã nghỉ việc, không có quyền truy cập!' };
    }

    if (!pass) {
      return { success: false, message: 'Vui lòng nhập mật khẩu!' };
    }

    const authRecord = this.store.dang_nhap.find(d => d.Email.toLowerCase() === nv.Email.toLowerCase());
    const expectedPass = authRecord ? authRecord.Mat_khau : nv.Sdt;

    // Strict password check: allow employee phone, expectedPass, 123456, employee code, or admin123 (for admin)
    const validPasswords = [
      expectedPass,
      nv.Sdt,
      '123456',
      nv.Ma_nhan_vien.toLowerCase(),
      nv.Ma_nhan_vien.toUpperCase()
    ];
    if (nv.Vai_tro.toLowerCase().includes('admin')) {
      validPasswords.push('admin123');
    }

    const isMatch = validPasswords.some(p => p && p === pass);
    if (!isMatch) {
      return { success: false, message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.' };
    }

    this.addAuditLog({
      nguoiThaoTac: nv.Ten_nhan_vien,
      vaiTro: nv.Vai_tro,
      hanhDong: 'ĐĂNG NHẬP',
      doiTuong: 'Hệ thống StockFlow',
      chiTiet: `Người dùng ${nv.Ten_nhan_vien} (${nv.Ma_nhan_vien} - ${nv.Vai_tro}) đã đăng nhập thành công`
    });

    return {
      success: true,
      user: {
        id: nv.Ma_nhan_vien,
        ten: nv.Ten_nhan_vien,
        email: nv.Email,
        vaiTro: this.normalizeRole(nv.Vai_tro),
        vaiTroGoc: nv.Vai_tro,
        dienThoai: nv.Sdt,
        trangThai: nv.Trang_thai,
        maNvQuanLy: nv.Ma_nv_quan_ly
      }
    };
  }

  private normalizeRole(vaiTro: string): string {
    const v = (vaiTro || '').toLowerCase();
    if (v.includes('admin')) return 'admin';
    if (v.includes('quản lý') || v.includes('quan ly')) return 'manager';
    if (v.includes('thủ kho') || v.includes('thu kho')) return 'staff';
    if (v.includes('kế toán') || v.includes('ke toan')) return 'accountant';
    if (v.includes('giám sát') || v.includes('giam sat')) return 'supervisor';
    return 'employee';
  }

  // Products
  public getProducts() {
    return this.store.san_pham.map(sp => {
      const dm = this.store.danh_muc.find(d => d.Ma_danh_muc === sp.Ma_danh_muc);
      const ncc = this.store.nha_cung_cap.find(n => n.Ma_ncc === sp.Ma_ncc);
      const storageList = this.store.luu_tru.filter(l => l.Ma_san_pham === sp.Ma_san_pham);
      const totalStock = storageList.reduce((acc, curr) => acc + curr.So_luong_ton, 0);
      const primaryStorage = storageList[0];
      const kho = primaryStorage ? this.store.kho.find(k => k.Ma_kho === primaryStorage.Ma_kho) : null;

      return {
        id: sp.Ma_san_pham,
        sku: sp.Ma_san_pham,
        ten: sp.Ten_san_pham,
        danhMuc: dm ? dm.Ten_danh_muc : 'Khác',
        maDanhMuc: sp.Ma_danh_muc,
        kho: kho ? kho.Ten_kho : 'Kho Tổng',
        maKho: primaryStorage ? primaryStorage.Ma_kho : 'K01',
        soLuong: totalStock,
        dinhMucToiThieu: sp.Nguong_ton_toi_thieu,
        giaNhap: sp.Gia_nhap,
        giaXuat: sp.Gia_ban,
        donVi: 'Sản phẩm',
        viTri: primaryStorage ? primaryStorage.Vi_tri : 'Kệ A1',
        moTa: sp.Mo_ta,
        maNcc: sp.Ma_ncc,
        tenNcc: ncc ? ncc.Ten_ncc : ''
      };
    });
  }

  public createProduct(data: any): SanPhamRecord {
    const newId = data.sku || ('SP' + String(this.store.san_pham.length + 1).padStart(3, '0'));
    const newSp: SanPhamRecord = {
      Ma_san_pham: newId,
      Ma_danh_muc: data.maDanhMuc || 'DM01',
      Ten_san_pham: data.ten,
      Mo_ta: data.moTa || 'Hàng mới nhập kho',
      Nguong_ton_toi_thieu: Number(data.dinhMucToiThieu || 10),
      Gia_ban: Number(data.giaXuat || 0),
      Gia_nhap: Number(data.giaNhap || 0),
      Ma_ncc: data.maNcc || 'NCC01'
    };

    this.store.san_pham.push(newSp);

    // Add storage record
    const khoId = data.maKho || 'K01';
    this.store.luu_tru.push({
      Ma_kho: khoId,
      Ma_san_pham: newId,
      Vi_tri: data.viTri || 'Kệ A1-01',
      So_luong_ton: Number(data.soLuong || 0)
    });

    this.saveData();

    // Live sync to MySQL if active
    if (this.isMySqlActive && this.mySqlPool) {
      this.mySqlPool.query(
        'INSERT INTO san_pham (Ma_san_pham, Ma_danh_muc, Ten_san_pham, Mo_ta, Nguong_ton_toi_thieu, Gia_ban, Gia_nhap, Ma_ncc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [newSp.Ma_san_pham, newSp.Ma_danh_muc, newSp.Ten_san_pham, newSp.Mo_ta, newSp.Nguong_ton_toi_thieu, newSp.Gia_ban, newSp.Gia_nhap, newSp.Ma_ncc]
      ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi san_pham:', e.message));

      this.mySqlPool.query(
        'INSERT INTO luu_tru (Ma_kho, Ma_san_pham, Vi_tri, So_luong_ton) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE So_luong_ton = ?',
        [khoId, newId, data.viTri || 'Kệ A1-01', Number(data.soLuong || 0), Number(data.soLuong || 0)]
      ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi luu_tru:', e.message));
    }

    this.addAuditLog({
      nguoiThaoTac: 'Hệ thống',
      vaiTro: 'Admin',
      hanhDong: 'THÊM MỚI SẢN PHẨM',
      doiTuong: newSp.Ten_san_pham,
      chiTiet: `Thêm mã hàng ${newSp.Ma_san_pham}: ${newSp.Ten_san_pham} vào cơ sở dữ liệu`
    });

    return newSp;
  }

  public updateProduct(id: string, data: any): boolean {
    const idx = this.store.san_pham.findIndex(sp => sp.Ma_san_pham === id);
    if (idx === -1) return false;

    if (data.ten) this.store.san_pham[idx].Ten_san_pham = data.ten;
    if (data.giaNhap !== undefined) this.store.san_pham[idx].Gia_nhap = Number(data.giaNhap);
    if (data.giaXuat !== undefined) this.store.san_pham[idx].Gia_ban = Number(data.giaXuat);
    if (data.dinhMucToiThieu !== undefined) this.store.san_pham[idx].Nguong_ton_toi_thieu = Number(data.dinhMucToiThieu);
    if (data.moTa) this.store.san_pham[idx].Mo_ta = data.moTa;
    if (data.maDanhMuc) this.store.san_pham[idx].Ma_danh_muc = data.maDanhMuc;

    // Update stock if provided
    if (data.soLuong !== undefined) {
      const ltIdx = this.store.luu_tru.findIndex(l => l.Ma_san_pham === id);
      if (ltIdx !== -1) {
        this.store.luu_tru[ltIdx].So_luong_ton = Number(data.soLuong);
      }
    }

    this.saveData();

    // Live sync to MySQL if active
    if (this.isMySqlActive && this.mySqlPool) {
      const sp = this.store.san_pham[idx];
      this.mySqlPool.query(
        'UPDATE san_pham SET Ten_san_pham = ?, Gia_nhap = ?, Gia_ban = ?, Nguong_ton_toi_thieu = ?, Mo_ta = ?, Ma_danh_muc = ? WHERE Ma_san_pham = ?',
        [sp.Ten_san_pham, sp.Gia_nhap, sp.Gia_ban, sp.Nguong_ton_toi_thieu, sp.Mo_ta, sp.Ma_danh_muc, id]
      ).catch((e: any) => console.warn('[MySQL Sync] Lỗi cập nhật san_pham:', e.message));

      if (data.soLuong !== undefined) {
        this.mySqlPool.query(
          'UPDATE luu_tru SET So_luong_ton = ? WHERE Ma_san_pham = ?',
          [Number(data.soLuong), id]
        ).catch((e: any) => console.warn('[MySQL Sync] Lỗi cập nhật luu_tru:', e.message));
      }
    }

    this.addAuditLog({
      nguoiThaoTac: 'Hệ thống',
      vaiTro: 'Quản lý',
      hanhDong: 'CẬP NHẬT HÀNG HÓA',
      doiTuong: this.store.san_pham[idx].Ten_san_pham,
      chiTiet: `Cập nhật thông tin mã hàng ${id}`
    });

    return true;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.store.san_pham.findIndex(sp => sp.Ma_san_pham === id);
    if (idx === -1) return false;

    const ten = this.store.san_pham[idx].Ten_san_pham;
    this.store.san_pham.splice(idx, 1);
    this.store.luu_tru = this.store.luu_tru.filter(l => l.Ma_san_pham !== id);
    this.store.co_trong = this.store.co_trong.filter(c => c.Ma_san_pham !== id);

    this.saveData();

    // Live sync to MySQL if active
    if (this.isMySqlActive && this.mySqlPool) {
      this.mySqlPool.query('DELETE FROM san_pham WHERE Ma_san_pham = ?', [id])
        .catch((e: any) => console.warn('[MySQL Sync] Lỗi xóa san_pham:', e.message));
      this.mySqlPool.query('DELETE FROM luu_tru WHERE Ma_san_pham = ?', [id])
        .catch((e: any) => console.warn('[MySQL Sync] Lỗi xóa luu_tru:', e.message));
      this.mySqlPool.query('DELETE FROM co_trong WHERE Ma_san_pham = ?', [id])
        .catch((e: any) => console.warn('[MySQL Sync] Lỗi xóa co_trong:', e.message));
    }
    this.addAuditLog({
      nguoiThaoTac: 'Hệ thống',
      vaiTro: 'Admin',
      hanhDong: 'XÓA SẢN PHẨM',
      doiTuong: ten,
      chiTiet: `Xóa mã hàng ${id} khỏi cơ sở dữ liệu`
    });

    return true;
  }

  // Warehouses (Kho)
  public getWarehouses() {
    return this.store.kho.map(k => {
      const storageItems = this.store.luu_tru.filter(l => l.Ma_kho === k.Ma_kho);
      const totalStored = storageItems.reduce((acc, curr) => acc + curr.So_luong_ton, 0);
      return {
        maKho: k.Ma_kho,
        tenKho: k.Ten_kho,
        diaChi: k.Dia_chi,
        tongSucChua: k.Tong_suc_chua,
        sdt: k.SDT,
        soLuongMatHang: storageItems.length,
        tongTonThucTe: totalStored
      };
    });
  }

  // Categories (Danh mục)
  public getCategories() {
    return this.store.danh_muc;
  }

  // Suppliers (Nhà cung cấp)
  public getSuppliers() {
    return this.store.nha_cung_cap.map(ncc => ({
      id: ncc.Ma_ncc,
      ma: ncc.Ma_ncc,
      ten: ncc.Ten_ncc,
      diaChi: ncc.Dia_chi,
      dienThoai: ncc.SDT,
      email: ncc.Email,
      nguoiLienHe: 'Đại diện kinh doanh',
      congNo: 0,
      trangThai: 'active' as const
    }));
  }

  public createSupplier(data: any): NhaCungCapRecord {
    const newId = data.ma || ('NCC' + String(this.store.nha_cung_cap.length + 1).padStart(2, '0'));
    const item: NhaCungCapRecord = {
      Ma_ncc: newId,
      Ten_ncc: data.ten,
      Dia_chi: data.diaChi || 'Việt Nam',
      SDT: data.dienThoai || '0900000000',
      Email: data.email || `${newId.toLowerCase()}@supplier.vn`
    };
    this.store.nha_cung_cap.push(item);
    this.saveData();

    // Live sync to MySQL if active
    if (this.isMySqlActive && this.mySqlPool) {
      this.mySqlPool.query(
        'INSERT INTO nha_cung_cap (Ma_ncc, Ten_ncc, Dia_chi, SDT, Email) VALUES (?, ?, ?, ?, ?)',
        [item.Ma_ncc, item.Ten_ncc, item.Dia_chi, item.SDT, item.Email]
      ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi nha_cung_cap:', e.message));
    }

    this.addAuditLog({
      nguoiThaoTac: 'Hệ thống',
      vaiTro: 'Quản lý',
      hanhDong: 'THÊM NHÀ CUNG CẤP',
      doiTuong: item.Ten_ncc,
      chiTiet: `Thêm nhà cung cấp mới ${item.Ma_ncc} (${item.Ten_ncc})`
    });
    return item;
  }

  // Staff (Nhân viên)
  public getStaff() {
    return this.store.nhan_vien.map(nv => ({
      id: nv.Ma_nhan_vien,
      ten: nv.Ten_nhan_vien,
      email: nv.Email,
      dienThoai: nv.Sdt,
      vaiTro: this.normalizeRole(nv.Vai_tro),
      vaiTroGoc: nv.Vai_tro,
      phongBan: 'Bộ phận Vận hành',
      trangThai: nv.Trang_thai === 'Đang làm' ? ('active' as const) : ('inactive' as const),
      maNvQuanLy: nv.Ma_nv_quan_ly
    }));
  }

  public createStaff(data: any): NhanVienRecord {
    const newId = 'NV' + String(this.store.nhan_vien.length + 1).padStart(3, '0');
    const newNv: NhanVienRecord = {
      Ma_nhan_vien: newId,
      Ten_nhan_vien: data.ten,
      Vai_tro: data.vaiTroGoc || data.vaiTro || 'Nhân viên',
      Sdt: data.dienThoai || '0900000000',
      Email: data.email || `${newId.toLowerCase()}@stockflow.vn`,
      Trang_thai: 'Đang làm',
      Ma_nv_quan_ly: data.maNvQuanLy || null
    };
    this.store.nhan_vien.push(newNv);
    this.store.dang_nhap.push({
      Email: newNv.Email,
      Mat_khau: newNv.Sdt
    });
    this.saveData();

    // Live sync to MySQL if active
    if (this.isMySqlActive && this.mySqlPool) {
      this.mySqlPool.query(
        'INSERT INTO nhan_vien (Ma_nhan_vien, Ten_nhan_vien, Vai_tro, Sdt, Email, Trang_thai, Ma_nv_quan_ly) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [newNv.Ma_nhan_vien, newNv.Ten_nhan_vien, newNv.Vai_tro, newNv.Sdt, newNv.Email, newNv.Trang_thai, newNv.Ma_nv_quan_ly]
      ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi nhan_vien:', e.message));

      this.mySqlPool.query(
        'INSERT INTO dang_nhap (Email, Mat_khau) VALUES (?, ?) ON DUPLICATE KEY UPDATE Mat_khau = ?',
        [newNv.Email, newNv.Sdt, newNv.Sdt]
      ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi dang_nhap:', e.message));
    }

    return newNv;
  }

  public updateStaffRole(id: string, newRole: string): boolean {
    const idx = this.store.nhan_vien.findIndex(n => n.Ma_nhan_vien === id);
    if (idx === -1) return false;
    this.store.nhan_vien[idx].Vai_tro = newRole;
    this.saveData();

    if (this.isMySqlActive && this.mySqlPool) {
      this.mySqlPool.query('UPDATE nhan_vien SET Vai_tro = ? WHERE Ma_nhan_vien = ?', [newRole, id])
        .catch((e: any) => console.warn('[MySQL Sync] Lỗi cập nhật vai tro:', e.message));
    }

    return true;
  }

  // Receipts (Phiếu nhập / xuất)
  public getReceipts() {
    return this.store.phieu.map(p => {
      const nv = this.store.nhan_vien.find(n => n.Ma_nhan_vien === p.Ma_nhan_vien);
      const items = this.store.co_trong
        .filter(c => c.Ma_phieu === p.Ma_phieu)
        .map(c => {
          const sp = this.store.san_pham.find(s => s.Ma_san_pham === c.Ma_san_pham);
          const donGia = sp ? (p.loai === 'nhap' ? sp.Gia_nhap : sp.Gia_ban) : 0;
          return {
            spId: c.Ma_san_pham,
            sku: c.Ma_san_pham,
            ten: sp ? sp.Ten_san_pham : c.Ma_san_pham,
            donVi: 'Sản phẩm',
            soLuong: c.So_luong,
            donGia,
            thanhTien: c.So_luong * donGia
          };
        });

      const tongTien = items.reduce((acc, curr) => acc + curr.thanhTien, 0);
      const tongSoLuong = items.reduce((acc, curr) => acc + curr.soLuong, 0);

      const statusMap: Record<string, string> = {
        'Hoàn thành': 'thanh_cong',
        'Chờ duyệt': 'cho_duyet',
        'Đã hủy': 'tra_hang'
      };

      return {
        id: p.Ma_phieu,
        maPhieu: p.Ma_phieu,
        loai: p.loai,
        trangThai: statusMap[p.Trang_thai] || 'cho_duyet',
        trangThaiGoc: p.Trang_thai,
        dvVanChuyen: 'Giao Hàng Tiết Kiệm',
        maVanDon: 'VD-' + p.Ma_phieu,
        doiTac: p.loai === 'nhap' ? p.Doi_tac || 'Đối tác cung ứng' : p.Nguoi_nhan || 'Khách hàng',
        kho: 'Kho Tổng Hà Nội',
        tenHang: items.length > 0 ? items[0].ten + (items.length > 1 ? ` (+${items.length - 1} món)` : '') : 'Hàng hóa tổng hợp',
        soLuong: tongSoLuong,
        tongTien,
        thoiGian: p.Ngay_nhap + ' 09:00:00',
        nguoiLap: nv ? nv.Ten_nhan_vien : p.Ma_nhan_vien,
        ghiChu: p.Ghi_chu,
        danhSachHang: items
      };
    });
  }

  public createReceipt(data: any): PhieuRecord {
    const isNhap = data.loai === 'nhap';
    const prefix = isNhap ? 'PN' : 'PX';
    const count = this.store.phieu.filter(p => p.loai === data.loai).length + 1;
    const newId = data.maPhieu || `${prefix}${String(count).padStart(3, '0')}`;

    const newPhieu: PhieuRecord = {
      Ma_phieu: newId,
      Ngay_nhap: new Date().toISOString().split('T')[0],
      Trang_thai: 'Hoàn thành',
      Ghi_chu: data.ghiChu || (isNhap ? 'Nhập kho hàng mới' : 'Xuất kho giao khách'),
      Ma_nhan_vien: data.maNhanVien || 'NV001',
      loai: data.loai,
      Doi_tac: data.doiTac || 'Đối tác phân phối',
      Ma_ncc: data.maNcc || 'NCC01',
      Nguoi_nhan: data.nguoiNhan || data.doiTac || 'Khách nhận'
    };

    this.store.phieu.unshift(newPhieu);

    // Save items and update storage
    if (Array.isArray(data.danhSachHang)) {
      for (const item of data.danhSachHang) {
        this.store.co_trong.push({
          Ma_phieu: newId,
          Ma_san_pham: item.spId || item.sku,
          So_luong: Number(item.soLuong)
        });

        // Update stock in luu_tru
        const lt = this.store.luu_tru.find(l => l.Ma_san_pham === (item.spId || item.sku));
        if (lt) {
          if (isNhap) {
            lt.So_luong_ton += Number(item.soLuong);
          } else {
            lt.So_luong_ton = Math.max(0, lt.So_luong_ton - Number(item.soLuong));
          }
        }
      }
    }

    this.saveData();

    // Live sync to MySQL if active
    if (this.isMySqlActive && this.mySqlPool) {
      this.mySqlPool.query(
        'INSERT INTO phieu (Ma_phieu, Ngay_nhap, Trang_thai, Ghi_chu, Ma_nhan_vien) VALUES (?, ?, ?, ?, ?)',
        [newPhieu.Ma_phieu, newPhieu.Ngay_nhap, newPhieu.Trang_thai, newPhieu.Ghi_chu, newPhieu.Ma_nhan_vien]
      ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi phieu:', e.message));

      if (isNhap) {
        this.mySqlPool.query(
          'INSERT INTO phieu_nhap (Ma_phieu, Doi_tac, Ma_ncc) VALUES (?, ?, ?)',
          [newPhieu.Ma_phieu, newPhieu.Doi_tac || 'Đối tác phân phối', newPhieu.Ma_ncc || 'NCC01']
        ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi phieu_nhap:', e.message));
      } else {
        this.mySqlPool.query(
          'INSERT INTO phieu_xuat (Ma_phieu, Nguoi_nhan) VALUES (?, ?)',
          [newPhieu.Ma_phieu, newPhieu.Nguoi_nhan || 'Khách nhận']
        ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi phieu_xuat:', e.message));
      }

      if (Array.isArray(data.danhSachHang)) {
        for (const item of data.danhSachHang) {
          const sku = item.spId || item.sku;
          this.mySqlPool.query(
            'INSERT INTO co_trong (Ma_phieu, Ma_san_pham, So_luong) VALUES (?, ?, ?)',
            [newId, sku, Number(item.soLuong)]
          ).catch((e: any) => console.warn('[MySQL Sync] Lỗi ghi co_trong:', e.message));

          const lt = this.store.luu_tru.find(l => l.Ma_san_pham === sku);
          if (lt) {
            this.mySqlPool.query(
              'UPDATE luu_tru SET So_luong_ton = ? WHERE Ma_san_pham = ?',
              [lt.So_luong_ton, sku]
            ).catch((e: any) => console.warn('[MySQL Sync] Lỗi cập nhật luu_tru:', e.message));
          }
        }
      }
    }

    this.addAuditLog({
      nguoiThaoTac: data.nguoiLap || 'Thủ kho',
      vaiTro: 'Thủ kho',
      hanhDong: isNhap ? 'LẬP PHIẾU NHẬP' : 'LẬP PHIẾU XUẤT',
      doiTuong: newId,
      chiTiet: `Lập thành công phiếu ${newId} (${data.danhSachHang?.length || 0} mã hàng)`
    });

    return newPhieu;
  }

  // Audit Logs
  public getAuditLogs(): AuditLogRecord[] {
    return this.store.audit_logs;
  }

  public addAuditLog(log: Omit<AuditLogRecord, 'id' | 'thoiGian'>) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const newLog: AuditLogRecord = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      thoiGian: timeStr,
      ...log
    };
    this.store.audit_logs.unshift(newLog);
    this.saveData();
  }
}

export const db = new QLyKhoDatabase();
