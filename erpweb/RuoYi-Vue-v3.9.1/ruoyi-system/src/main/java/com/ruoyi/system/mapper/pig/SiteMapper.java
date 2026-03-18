package com.ruoyi.system.mapper.pig;

import java.util.List;
import com.ruoyi.system.domain.pig.Site;

/**
 * 场点Mapper接口
 * 
 * @author ruoyi
 */
public interface SiteMapper
{
    /**
     * 查询场点列表
     * 
     * @param site 场点
     * @return 场点集合
     */
    public List<Site> selectSiteList(Site site);

    /**
     * 查询场点
     * 
     * @param id 场点主键
     * @return 场点
     */
    public Site selectSiteById(Long id);

    /**
     * 新增场点
     * 
     * @param site 场点
     * @return 结果
     */
    public int insertSite(Site site);

    /**
     * 修改场点
     * 
     * @param site 场点
     * @return 结果
     */
    public int updateSite(Site site);

    /**
     * 删除场点
     * 
     * @param id 场点主键
     * @return 结果
     */
    public int deleteSiteById(Long id);

    /**
     * 批量删除场点
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteSiteByIds(Long[] ids);
}
