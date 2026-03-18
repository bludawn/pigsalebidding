package com.ruoyi.system.service.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.Site;

/**
 * 场点 Service接口
 * 
 * @author ruoyi
 */
public interface ISiteService
{
    public List<Site> selectSiteList(Site site);
    public Site selectSiteById(Long id);
    public int insertSite(Site site);
    public int updateSite(Site site);
    public int deleteSiteById(Long id);
    public int deleteSiteByIds(Long[] ids);
    public String importSite(List<Site> siteList, Boolean updateSupport, String operName);
}
