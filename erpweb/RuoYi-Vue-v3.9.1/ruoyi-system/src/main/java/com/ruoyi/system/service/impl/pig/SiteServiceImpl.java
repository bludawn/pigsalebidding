package com.ruoyi.system.service.impl.pig;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;

import com.ruoyi.system.domain.pig.Site;
import com.ruoyi.system.mapper.pig.SiteMapper;
import com.ruoyi.system.service.pig.ISiteService;

/**
 * 场点 Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class SiteServiceImpl implements ISiteService
{
    @Autowired
    private SiteMapper siteMapper;

    @Override
    public List<Site> selectSiteList(Site site)
    {
        return siteMapper.selectSiteList(site);
    }

    @Override
    public Site selectSiteById(Long id)
    {
        return siteMapper.selectSiteById(id);
    }

    @Override
    public int insertSite(Site site)
    {
        return siteMapper.insertSite(site);
    }

    @Override
    public int updateSite(Site site)
    {
        return siteMapper.updateSite(site);
    }

    @Override
    public int deleteSiteById(Long id)
    {
        return siteMapper.deleteSiteById(id);
    }

    @Override
    public int deleteSiteByIds(Long[] ids)
    {
        return siteMapper.deleteSiteByIds(ids);
    }

    @Override
    public String importSite(List<Site> siteList, Boolean updateSupport, String operName)
    {
        if (StringUtils.isNull(siteList) || siteList.size() == 0)
        {
            throw new ServiceException("导入场点数据不能为空！");
        }
        int successNum = 0;
        int failureNum = 0;
        StringBuilder successMsg = new StringBuilder();
        StringBuilder failureMsg = new StringBuilder();
        for (Site site : siteList)
        {
            try
            {
                if (updateSupport != null && updateSupport && site.getId() != null && selectSiteById(site.getId()) != null)
                {
                    site.setUpdateBy(operName);
                    this.updateSite(site);
                    successNum++;
                }
                else
                {
                    site.setCreateBy(operName);
                    this.insertSite(site);
                    successNum++;
                }
            }
            catch (Exception e)
            {
                failureNum++;
                String msg = failureNum + "、" + site.getId() + " 导入失败：";
                failureMsg.append(msg).append(e.getMessage()).append("\n");
            }
        }
        if (failureNum > 0)
        {
            failureMsg.insert(0, "很抱歉，导入失败！共 " + failureNum + " 条数据格式不正确，错误如下：\n");
            throw new ServiceException(failureMsg.toString());
        }
        else
        {
            successMsg.insert(0, "恭喜您，数据已全部导入成功！共 " + successNum + " 条");
        }
        return successMsg.toString();
    }

}
