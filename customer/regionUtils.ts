import regionData from './data/pcas-code.json';
import { RegionItem } from './types';

const normalizeRegions = (items: any[], level: number): RegionItem[] => {
  return items.map(item => ({
    code: item.code,
    name: item.name,
    level,
    children: item.children ? normalizeRegions(item.children, level + 1) : undefined,
  }));
};

const REGION_TREE: RegionItem[] = normalizeRegions(regionData as any[], 1);

const normalizeRegionCodeValue = (value?: string | number) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const buildRegionPathMap = (items: RegionItem[], parentPath: string[] = [], map = new Map<string, string>()) => {
  items.forEach(item => {
    const currentPath = [...parentPath, item.name].filter(Boolean);
    map.set(normalizeRegionCodeValue(item.code), currentPath.join('/'));
    if (item.children?.length) {
      buildRegionPathMap(item.children, currentPath, map);
    }
  });
  return map;
};

const REGION_PATH_MAP = buildRegionPathMap(REGION_TREE);

const REGION_CODE_REGEXP = /^\d{2,12}$/;

const isRegionCode = (value?: string) => {
  if (!value) return false;
  return REGION_CODE_REGEXP.test(value.trim());
};

export const getRegionFullNameByCode = (code?: string | number) => {
  const normalized = normalizeRegionCodeValue(code);
  if (!normalized) return '';
  return REGION_PATH_MAP.get(normalized) || '';
};

export const normalizeRegionName = (regionName?: string, regionCode?: string) => {
  const name = (regionName || '').trim();

  const byNameCode = getRegionFullNameByCode(name);
  if (byNameCode) return byNameCode;

  if (name && !isRegionCode(name)) {
    return name;
  }

  const byCode = getRegionFullNameByCode(regionCode);
  if (byCode) return byCode;
  return name || (regionCode || '').trim();
};

export const normalizeAddressText = (address?: string) => {
  const value = (address || '').trim();
  if (!value) return '';

  const direct = getRegionFullNameByCode(value);
  if (direct) return direct;

  const matched = value.match(/^(\d{2,12})([\s,，/|-]*)(.*)$/);
  if (!matched) return value;

  const [, code, , rest] = matched;
  const path = getRegionFullNameByCode(code);
  if (!path) return value;
  const detail = (rest || '').trim();
  return detail ? `${path} ${detail}` : path;
};

export const composeRegionAddress = (regionName?: string, regionCode?: string, detailAddress?: string) => {
  const region = normalizeRegionName(regionName, regionCode).trim();
  const detail = (detailAddress || '').trim();
  if (region && detail) return `${region} ${detail}`;
  return region || detail;
};
