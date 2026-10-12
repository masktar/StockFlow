import fs from 'fs';
import path from 'path';

export function parseSqlDump(sqlContent: string) {
  function parseTable(tableName: string) {
    const marker = 'INSERT INTO `' + tableName + '` VALUES ';
    const idx = sqlContent.indexOf(marker);
    if (idx === -1) return [];
    const semiIdx = sqlContent.indexOf(';', idx);
    if (semiIdx === -1) return [];
    const valuesStr = sqlContent.substring(idx + marker.length, semiIdx).trim();

    const rows: any[][] = [];
    let inString = false;
    let stringChar = '';
    let currentTuple: any[] = [];
    let currentVal = '';
    let inTuple = false;

    for (let i = 0; i < valuesStr.length; i++) {
      const ch = valuesStr[i];
      if (inString) {
        if (ch === '\\') {
          currentVal += valuesStr[++i] || '';
        } else if (ch === stringChar) {
          if (valuesStr[i + 1] === stringChar) {
            currentVal += stringChar;
            i++;
          } else {
            inString = false;
          }
        } else {
          currentVal += ch;
        }
      } else {
        if (ch === "'" || ch === '"') {
          inString = true;
          stringChar = ch;
        } else if (ch === '(') {
          inTuple = true;
          currentTuple = [];
          currentVal = '';
        } else if (ch === ')') {
          if (inTuple) {
            currentTuple.push(cleanVal(currentVal));
            rows.push(currentTuple);
            inTuple = false;
            currentVal = '';
          }
        } else if (ch === ',') {
          if (inTuple) {
            currentTuple.push(cleanVal(currentVal));
            currentVal = '';
          }
        } else {
          currentVal += ch;
        }
      }
    }
    return rows;
  }

  function cleanVal(v: string) {
    const trimmed = v.trim();
    if (trimmed.toUpperCase() === 'NULL') return null;
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      return trimmed.slice(1, -1).replace(/''/g, "'").replace(/\\'/g, "'");
    }
    return trimmed;
  }

  return {
    danh_muc: parseTable('danh_muc').map(r => ({
      Ma_danh_muc: String(r[0] || ''),
      Ten_danh_muc: String(r[1] || '')
    })),
    kho: parseTable('kho').map(r => ({
      Ma_kho: String(r[0] || ''),
      Ten_kho: String(r[1] || ''),
      Dia_chi: String(r[2] || ''),
      Tong_suc_chua: Number(r[3] || 0),
      SDT: String(r[4] || '')
    })),
    nha_cung_cap: parseTable('nha_cung_cap').map(r => ({
      Ma_ncc: String(r[0] || ''),
      Ten_ncc: String(r[1] || ''),
      Dia_chi: String(r[2] || ''),
      SDT: String(r[3] || ''),
      Email: String(r[4] || '')
    })),
    nhan_vien: parseTable('nhan_vien').map(r => ({
      Ma_nhan_vien: String(r[0] || ''),
      Ten_nhan_vien: String(r[1] || ''),
      Vai_tro: String(r[2] || ''),
      Sdt: String(r[3] || ''),
      Email: String(r[4] || ''),
      Trang_thai: String(r[5] || 'Đang làm'),
      Ma_nv_quan_ly: r[6] ? String(r[6]) : null
    })),
    san_pham: parseTable('san_pham').map(r => ({
      Ma_san_pham: String(r[0] || ''),
      Ma_danh_muc: String(r[1] || ''),
      Ten_san_pham: String(r[2] || ''),
      Mo_ta: String(r[3] || ''),
      Nguong_ton_toi_thieu: Number(r[4] || 0),
      Gia_ban: Number(r[5] || 0),
      Gia_nhap: Number(r[6] || 0),
      Ma_ncc: String(r[7] || '')
    })),
    luu_tru: parseTable('luu_tru').map(r => ({
      Ma_kho: String(r[0] || ''),
      Ma_san_pham: String(r[1] || ''),
      Vi_tri: String(r[2] || ''),
      So_luong_ton: Number(r[3] || 0)
    })),
    phieu: parseTable('phieu').map(r => ({
      Ma_phieu: String(r[0] || ''),
      Ngay_nhap: String(r[1] || ''),
      Trang_thai: String(r[2] || 'Chờ duyệt'),
      Ghi_chu: String(r[3] || ''),
      Ma_nhan_vien: String(r[4] || ''),
      loai: (String(r[0] || '').startsWith('PX') ? 'xuat' : 'nhap') as 'nhap' | 'xuat'
    })),
    co_trong: parseTable('co_trong').map(r => ({
      Ma_phieu: String(r[0] || ''),
      Ma_san_pham: String(r[1] || ''),
      So_luong: Number(r[2] || 0)
    }))
  };
}

export function updateSqlDumpFile(store: any, filePath = 'qlykho_new.sql'): boolean {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) return false;

    let content = fs.readFileSync(fullPath, 'utf-8');

    function sqlEscape(val: any): string {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return String(val);
      const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      return `'${str}'`;
    }

    function replaceTableValues(tableName: string, rows: any[][]) {
      const marker = 'INSERT INTO `' + tableName + '` VALUES ';
      const idx = content.indexOf(marker);
      if (idx === -1) return;
      const semiIdx = content.indexOf(';', idx);
      if (semiIdx === -1) return;
      if (rows.length === 0) return;

      const valuesClause = rows
        .map(r => '(' + r.map(v => sqlEscape(v)).join(',') + ')')
        .join(',');

      content = content.substring(0, idx + marker.length) + valuesClause + content.substring(semiIdx);
    }

    // Update san_pham
    if (Array.isArray(store.san_pham) && store.san_pham.length > 0) {
      replaceTableValues(
        'san_pham',
        store.san_pham.map((s: any) => [
          s.Ma_san_pham,
          s.Ma_danh_muc,
          s.Ten_san_pham,
          s.Mo_ta,
          s.Nguong_ton_toi_thieu,
          s.Gia_ban,
          s.Gia_nhap,
          s.Ma_ncc
        ])
      );
    }

    // Update luu_tru
    if (Array.isArray(store.luu_tru) && store.luu_tru.length > 0) {
      replaceTableValues(
        'luu_tru',
        store.luu_tru.map((l: any) => [l.Ma_kho, l.Ma_san_pham, l.Vi_tri, l.So_luong_ton])
      );
    }

    // Update nha_cung_cap
    if (Array.isArray(store.nha_cung_cap) && store.nha_cung_cap.length > 0) {
      replaceTableValues(
        'nha_cung_cap',
        store.nha_cung_cap.map((n: any) => [n.Ma_ncc, n.Ten_ncc, n.Dia_chi, n.SDT, n.Email])
      );
    }

    // Update nhan_vien
    if (Array.isArray(store.nhan_vien) && store.nhan_vien.length > 0) {
      replaceTableValues(
        'nhan_vien',
        store.nhan_vien.map((u: any) => [
          u.Ma_nhan_vien,
          u.Ten_nhan_vien,
          u.Vai_tro,
          u.Sdt,
          u.Email,
          u.Trang_thai,
          u.Ma_nv_quan_ly
        ])
      );
    }

    // Update phieu
    if (Array.isArray(store.phieu) && store.phieu.length > 0) {
      replaceTableValues(
        'phieu',
        store.phieu.map((p: any) => [p.Ma_phieu, p.Ngay_nhap, p.Trang_thai, p.Ghi_chu, p.Ma_nhan_vien])
      );

      const nhapRows = store.phieu
        .filter((p: any) => p.loai === 'nhap' || String(p.Ma_phieu).startsWith('PN'))
        .map((p: any) => [p.Ma_phieu, p.Doi_tac || 'Kho trung tâm', p.Ma_ncc || 'NCC01']);
      if (nhapRows.length > 0) {
        replaceTableValues('phieu_nhap', nhapRows);
      }

      const xuatRows = store.phieu
        .filter((p: any) => p.loai === 'xuat' || String(p.Ma_phieu).startsWith('PX'))
        .map((p: any) => [p.Ma_phieu, p.Nguoi_nhan || p.Doi_tac || 'Khách nhận']);
      if (xuatRows.length > 0) {
        replaceTableValues('phieu_xuat', xuatRows);
      }
    }

    // Update dang_nhap
    if (Array.isArray(store.dang_nhap) && store.dang_nhap.length > 0) {
      replaceTableValues(
        'dang_nhap',
        store.dang_nhap.map((d: any) => [d.Email, d.Mat_khau])
      );
    }

    // Update co_trong
    if (Array.isArray(store.co_trong) && store.co_trong.length > 0) {
      replaceTableValues(
        'co_trong',
        store.co_trong.map((c: any) => [c.Ma_phieu, c.Ma_san_pham, c.So_luong])
      );
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    return true;
  } catch (err) {
    console.warn('[SQL Dump Update] Lỗi cập nhật file dump:', err);
    return false;
  }
}
