import {pool} from './database';
export const defaultSettings = { electricityTariffPerKwh: 0, defaultManagementFeePercent: 0, maintenanceReservePercent: 0, defaultPool: '', failoverPool: '', minPayoutBtc: 0, payoutSchedule: 'Admin review', multiSigThreshold: 'Not configured', maintenanceMode: false, autoCalculateDaily: true };
export async function getPlatformSettings(): Promise<typeof defaultSettings> {
 const [rows]=await pool.query<any[]>("SELECT settings FROM platform_settings WHERE id = 'global'");
 const saved=rows[0]?.settings; return {...defaultSettings,...(typeof saved==='string'?JSON.parse(saved):saved||{})};
}
export async function savePlatformSettings(input: Record<string, unknown>) {
 const next={...await getPlatformSettings()};
 for(const key of Object.keys(defaultSettings) as (keyof typeof defaultSettings)[]) { const value=input[key];if(value===undefined)continue;
 if(typeof value!==typeof defaultSettings[key]) throw new Error('Invalid '+key);
 if(typeof value==='number'&&(!Number.isFinite(value)||value<0||(key.endsWith('Percent')&&value>100)))throw new Error('Invalid '+key);
 if(typeof value==='string'&&value.length>255)throw new Error('Setting is too long.');
 (next as any)[key]=value; }
 await pool.query("INSERT INTO platform_settings(id,settings,updated_at) VALUES ('global',?,UTC_TIMESTAMP()) ON DUPLICATE KEY UPDATE settings=VALUES(settings),updated_at=VALUES(updated_at)",[JSON.stringify(next)]);return next;
}
