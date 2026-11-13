import type { NewTrade } from "./journalApi";

/*
 * Reads closed positions from a MetaTrader report the user exports from the
 * terminal: MT5 "Report" HTML (UTF-16), MT4 statement HTML, or the same tables
 * saved as CSV. Rows are recognised by their shape, not by fixed headers, so
 * any interface language works:
 *   MT5 positions: time, position, symbol, type, volume, price, S/L, T/P, time, price, commission, swap, profit
 *   MT4 closed:    ticket, open time, type, size, item, price, S/L, T/P, close time, price, commission, taxes, swap, profit
 * Deals and orders sections (in/out, filled/canceled) are skipped.
 */

const DATE = /^\d{4}[.-]\d{2}[.-]\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/;

const toNumber = (value: string | undefined) => {
  if (value === undefined) return null;
  const clean = value.replace(/[\s ]/g, "").replace(",", ".");
  if (!clean || clean === "-") return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
};

const sideOf = (value: string | undefined) => {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === "buy") return "BUY" as const;
  if (v === "sell") return "SELL" as const;
  return null;
};

export const parseRows = (rows: string[][], account = ""): NewTrade[] => {
  const trades: NewTrade[] = [];
  for (const raw of rows) {
    const c = raw.map((cell) => String(cell ?? "").replace(/\s+/g, " ").trim());
    const t = c.findIndex((cell) => sideOf(cell) !== null);
    if (t < 0) continue;
    const j = c.findIndex((cell, index) => index > t && DATE.test(cell));
    if (j < 0) continue;
    const tail = c.slice(j + 1).filter((cell) => cell !== "");
    const before = c.slice(0, t).filter((cell) => cell !== "");
    const midRaw = c.slice(t + 1, j);
    const mid = midRaw.length === 4 ? midRaw : midRaw.filter((cell) => cell !== "");
    // Deals rows have in/out, orders rows have a state word: not closed positions.
    if (mid.some((cell) => /^(in|out|in\/out|out by)$/i.test(cell))) continue;
    if (tail.some((cell) => /^(filled|canceled|cancelled|expired|placed|rejected)$/i.test(cell))) continue;
    let base: Omit<NewTrade, "source" | "account"> | null = null;
    if (before.length >= 3 && DATE.test(before[before.length - 3]) && tail.length >= 4) {
      // MT5 positions: time, position, symbol, type, volume, price, S/L, T/P, time, price, commission, swap, profit
      base = {
        externalId: before[before.length - 2],
        symbol: before[before.length - 1].toUpperCase(),
        side: sideOf(c[t])!,
        openTime: before[before.length - 3],
        volume: toNumber(mid[0]),
        openPrice: toNumber(mid[1]),
        stopLoss: toNumber(mid[2]),
        takeProfit: toNumber(mid[3]),
        closeTime: c[j],
        closePrice: toNumber(tail[0]),
        commission: toNumber(tail[1]),
        swap: toNumber(tail[2]),
        profit: toNumber(tail[tail.length - 1]),
      };
    } else if (before.length >= 2 && DATE.test(before[before.length - 1]) && tail.length >= 5) {
      // MT4 closed: ticket, open time, type, size, item, price, S/L, T/P, close time, price, commission, taxes, swap, profit
      const m4 = midRaw.length === 5 ? midRaw : midRaw.filter((cell) => cell !== "");
      base = {
        externalId: before[before.length - 2],
        symbol: String(m4[1] ?? "").toUpperCase(),
        side: sideOf(c[t])!,
        openTime: before[before.length - 1],
        volume: toNumber(m4[0]),
        openPrice: toNumber(m4[2]),
        stopLoss: toNumber(m4[3]),
        takeProfit: toNumber(m4[4]),
        closeTime: c[j],
        closePrice: toNumber(tail[0]),
        commission: toNumber(tail[1]),
        swap: toNumber(tail[tail.length - 2]),
        profit: toNumber(tail[tail.length - 1]),
      };
    }
    if (!base || !base.symbol || base.profit === null || base.closePrice === null) continue;
    trades.push({ source: "mt5_report", account, ...base });
  }
  return trades;
};

const decode = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder("utf-16le").decode(bytes);
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder("utf-16be").decode(bytes);
  // UTF-16 without BOM: every second byte is zero in ASCII-heavy text.
  if (bytes.length > 4 && bytes[1] === 0 && bytes[3] === 0) return new TextDecoder("utf-16le").decode(bytes);
  return new TextDecoder("utf-8").decode(bytes);
};

const accountFrom = (text: string) => {
  const m = text.match(/(?:Account|Счёт|Счет|Сметка|Cuenta|Conta)\s*:?\s*<?[^0-9]{0,40}?(\d{5,12})/i);
  return m ? m[1] : "";
};

export const parseReportText = (text: string): NewTrade[] => {
  const account = accountFrom(text);
  if (/<table|<tr/i.test(text)) {
    const doc = new DOMParser().parseFromString(text, "text/html");
    const rows = Array.from(doc.querySelectorAll("tr")).map((tr) =>
      Array.from(tr.querySelectorAll("td,th"))
        // MT5 puts helper cells with class="hidden" inside position rows.
        .filter((td) => !/\bhidden\b/i.test(td.getAttribute("class") ?? ""))
        .map((td) => td.textContent ?? ""),
    );
    return parseRows(rows, account);
  }
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const separator = [";", "\t", ","].find((s) => (lines[0] ?? "").split(s).length >= 5) ?? ",";
  const rows = lines.map((line) => line.split(separator).map((cell) => cell.replace(/^"|"$/g, "")));
  return parseRows(rows, account);
};

/* ---- MT5 "Open XML" (.xlsx): a zip with sheet XML; read with the browser's own inflate ---- */

const inflateRaw = async (data: Uint8Array) => {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

const unzip = async (buffer: ArrayBuffer): Promise<Map<string, string>> => {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 70000); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("XLSX_INVALID");
  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const files = new Map<string, string>();
  for (let n = 0; n < count; n++) {
    if (view.getUint32(offset, true) !== 0x02014b50) break;
    const method = view.getUint16(offset + 10, true);
    const size = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const local = view.getUint32(offset + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(offset + 46, offset + 46 + nameLength)).replace(/\\/g, "/").toLowerCase();
    offset += 46 + nameLength + extraLength + commentLength;
    if (!/^xl\/(sharedstrings\.xml|worksheets\/sheet\d+\.xml)$/.test(name)) continue;
    const dataStart = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const raw = bytes.subarray(dataStart, dataStart + size);
    const content = method === 8 ? await inflateRaw(raw) : raw;
    files.set(name, new TextDecoder("utf-8").decode(content));
  }
  return files;
};

const columnIndex = (ref: string) => {
  const letters = ref.replace(/\d+/g, "").toUpperCase();
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
};

const parseXlsx = async (buffer: ArrayBuffer): Promise<NewTrade[]> => {
  const files = await unzip(buffer);
  const parser = new DOMParser();
  const shared: string[] = [];
  const sst = files.get("xl/sharedstrings.xml");
  if (sst) {
    const doc = parser.parseFromString(sst, "application/xml");
    for (const si of Array.from(doc.getElementsByTagNameNS("*", "si"))) {
      shared.push(Array.from(si.getElementsByTagNameNS("*", "t")).map((t) => t.textContent ?? "").join(""));
    }
  }
  const rows: string[][] = [];
  let account = "";
  for (const [name, xml] of files) {
    if (!name.startsWith("xl/worksheets/")) continue;
    const doc = parser.parseFromString(xml, "application/xml");
    for (const row of Array.from(doc.getElementsByTagNameNS("*", "row"))) {
      const cells: string[] = [];
      for (const c of Array.from(row.getElementsByTagNameNS("*", "c"))) {
        const index = columnIndex(c.getAttribute("r") ?? "");
        const type = c.getAttribute("t");
        const v = c.getElementsByTagNameNS("*", "v")[0]?.textContent ?? "";
        const text =
          type === "s" ? shared[Number(v)] ?? "" :
          type === "inlineStr" ? Array.from(c.getElementsByTagNameNS("*", "t")).map((t) => t.textContent ?? "").join("") :
          v;
        if (index >= 0) cells[index] = text;
        else cells.push(text);
      }
      const filled = Array.from(cells, (cell) => cell ?? "");
      if (!account) account = accountFrom(filled.join(" "));
      rows.push(filled);
    }
  }
  return parseRows(rows, account);
};

export const parseReportFile = async (file: File): Promise<NewTrade[]> => {
  const buffer = await file.arrayBuffer();
  const head = new Uint8Array(buffer.slice(0, 2));
  if (/\.xlsx$/i.test(file.name) || (head[0] === 0x50 && head[1] === 0x4b)) {
    if (typeof DecompressionStream === "undefined") throw new Error("XLSX_NOT_SUPPORTED");
    return parseXlsx(buffer);
  }
  return parseReportText(decode(buffer));
};
