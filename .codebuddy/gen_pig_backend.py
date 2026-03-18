import os,re
root='/Users/baack/Desktop/CodeBuddy/pigsalebidding/erpweb/RuoYi-Vue-v3.9.1'
sql_path=os.path.join(root,'sql','business.sql')
with open(sql_path,'r',encoding='utf-8') as f:
    lines=f.readlines()

current=None
columns=[]
comment=None
auto_inc_id=False
tables={}
for line in lines:
    if line.strip().upper().startswith('CREATE TABLE'):
        m=re.search(r'CREATE TABLE\s+(\w+)', line, re.I)
        if m:
            current=m.group(1)
            columns=[]
            comment=None
            auto_inc_id=False
        continue
    if current:
        if 'COMMENT=' in line and line.strip().endswith(';'):
            m=re.search(r"COMMENT='([^']*)'", line)
            if m:
                comment=m.group(1)
            tables[current]=dict(columns=columns, comment=comment, auto_inc_id=auto_inc_id)
            current=None
            continue
        line_strip=line.strip().rstrip(',')
        if line_strip.startswith('f_'):
            parts=line_strip.split()
            col=parts[0]
            col_type=parts[1]
            base_type=col_type.split('(')[0].lower()
            if col=='f_id' and 'AUTO_INCREMENT' in line.upper():
                auto_inc_id=True
            columns.append((col, base_type))

class_map={
    't_pigType':'PigType',
    't_pigResource':'PigResource',
    't_bidProduct':'BidProduct',
    't_site':'Site',
    't_pigTag':'PigTag',
    't_userBidInfo':'UserBidInfo',
    't_userBid':'UserBid',
    't_enterpriseGroup':'EnterpriseGroup',
    't_order':'PigOrder',
    't_deliveryInfo':'DeliveryInfo',
    't_enterprise':'Enterprise',
    't_address':'Address',
    't_userExt':'UserExt',
    't_businessMessage':'BusinessMessage',
}

string_types={'varchar','text','char'}

def to_prop(col):
    if col=='f_creator':
        return 'createBy'
    if col=='f_createTime':
        return 'createTime'
    if col=='f_updator':
        return 'updateBy'
    if col=='f_updateTime':
        return 'updateTime'
    if col=='f_remark':
        return 'remark'
    if col.startswith('f_'):
        return col[2:]
    return col

def is_string(base_type):
    return base_type in string_types

service_dir=os.path.join(root,'ruoyi-system','src','main','java','com','ruoyi','system','service','pig')
service_impl_dir=os.path.join(root,'ruoyi-system','src','main','java','com','ruoyi','system','service','impl','pig')
controller_dir=os.path.join(root,'ruoyi-admin','src','main','java','com','ruoyi','web','controller','pig')
mapper_xml_dir=os.path.join(root,'ruoyi-system','src','main','resources','mapper','pig')

os.makedirs(service_dir, exist_ok=True)
os.makedirs(service_impl_dir, exist_ok=True)
os.makedirs(controller_dir, exist_ok=True)
os.makedirs(mapper_xml_dir, exist_ok=True)

import_tables={'PigType','PigResource','BidProduct','Site'}

for table, cls in class_map.items():
    if table not in tables:
        raise SystemExit(f'Table {table} not found in SQL')
    info=tables[table]
    cols=info['columns']
    comment=info['comment'] or cls
    title=comment[:-1] if comment.endswith('表') else comment
    module=cls[0].lower()+cls[1:]

    service_name=f'I{cls}Service'
    service_path=os.path.join(service_dir, f'{service_name}.java')
    methods=[
        f"    public List<{cls}> select{cls}List({cls} {module});",
        f"    public {cls} select{cls}ById(Long id);",
        f"    public int insert{cls}({cls} {module});",
        f"    public int update{cls}({cls} {module});",
        f"    public int delete{cls}ById(Long id);",
        f"    public int delete{cls}ByIds(Long[] ids);",
    ]
    if cls in import_tables:
        methods.append(f"    public String import{cls}(List<{cls}> {module}List, Boolean updateSupport, String operName);")

    service_content=f"""package com.ruoyi.system.service.pig;\n\nimport java.util.List;\nimport com.ruoyi.system.domain.pig.{cls};\n\n/**\n * {title} Service接口\n * \n * @author ruoyi\n */\npublic interface {service_name}\n{{\n{os.linesep.join(methods)}\n}}\n"""
    with open(service_path,'w',encoding='utf-8') as f:
        f.write(service_content)

    import_extra=""
    import_methods=""
    if cls in import_tables:
        import_extra="""\nimport com.ruoyi.common.exception.ServiceException;\nimport com.ruoyi.common.utils.StringUtils;\n"""
        import_methods=f"""\n    @Override\n    public String import{cls}(List<{cls}> {module}List, Boolean updateSupport, String operName)\n    {{\n        if (StringUtils.isNull({module}List) || {module}List.size() == 0)\n        {{\n            throw new ServiceException(\"导入{title}数据不能为空！\");\n        }}\n        int successNum = 0;\n        int failureNum = 0;\n        StringBuilder successMsg = new StringBuilder();\n        StringBuilder failureMsg = new StringBuilder();\n        for ({cls} {module} : {module}List)\n        {{\n            try\n            {{\n                if (updateSupport != null && updateSupport && {module}.getId() != null && select{cls}ById({module}.getId()) != null)\n                {{\n                    {module}.setUpdateBy(operName);\n                    this.update{cls}({module});\n                    successNum++;\n                }}\n                else\n                {{\n                    {module}.setCreateBy(operName);\n                    this.insert{cls}({module});\n                    successNum++;\n                }}\n            }}\n            catch (Exception e)\n            {{\n                failureNum++;\n                String msg = failureNum + \"、\" + {module}.getId() + \" 导入失败：\";\n                failureMsg.append(msg).append(e.getMessage()).append(\"\\n\");\n            }}\n        }}\n        if (failureNum > 0)\n        {{\n            failureMsg.insert(0, \"很抱歉，导入失败！共 \" + failureNum + \" 条数据格式不正确，错误如下：\\n\");\n            throw new ServiceException(failureMsg.toString());\n        }}\n        else\n        {{\n            successMsg.insert(0, \"恭喜您，数据已全部导入成功！共 \" + successNum + \" 条\");\n        }}\n        return successMsg.toString();\n    }}\n"""

    service_impl_name=f'{cls}ServiceImpl'
    service_impl_path=os.path.join(service_impl_dir, f'{service_impl_name}.java')
    service_impl_content=f"""package com.ruoyi.system.service.impl.pig;\n\nimport java.util.List;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.stereotype.Service;{import_extra}\nimport com.ruoyi.system.domain.pig.{cls};\nimport com.ruoyi.system.mapper.pig.{cls}Mapper;\nimport com.ruoyi.system.service.pig.I{cls}Service;\n\n/**\n * {title} Service业务层处理\n * \n * @author ruoyi\n */\n@Service\npublic class {service_impl_name} implements I{cls}Service\n{{\n    @Autowired\n    private {cls}Mapper {module}Mapper;\n\n    @Override\n    public List<{cls}> select{cls}List({cls} {module})\n    {{\n        return {module}Mapper.select{cls}List({module});\n    }}\n\n    @Override\n    public {cls} select{cls}ById(Long id)\n    {{\n        return {module}Mapper.select{cls}ById(id);\n    }}\n\n    @Override\n    public int insert{cls}({cls} {module})\n    {{\n        return {module}Mapper.insert{cls}({module});\n    }}\n\n    @Override\n    public int update{cls}({cls} {module})\n    {{\n        return {module}Mapper.update{cls}({module});\n    }}\n\n    @Override\n    public int delete{cls}ById(Long id)\n    {{\n        return {module}Mapper.delete{cls}ById(id);\n    }}\n\n    @Override\n    public int delete{cls}ByIds(Long[] ids)\n    {{\n        return {module}Mapper.delete{cls}ByIds(ids);\n    }}\n{import_methods}\n}}\n"""
    with open(service_impl_path,'w',encoding='utf-8') as f:
        f.write(service_impl_content)

    controller_name=f'{cls}Controller'
    controller_path=os.path.join(controller_dir, f'{controller_name}.java')
    import_imports=""
    import_methods_ctrl=""
    if cls in import_tables:
        import_imports="""\nimport org.springframework.web.multipart.MultipartFile;\n"""
        import_methods_ctrl=f"""\n    @Log(title = \"{title}\", businessType = BusinessType.IMPORT)\n    @PreAuthorize(\"@ss.hasPermi('pig:{module}:import')\")\n    @PostMapping(\"/importData\")\n    public AjaxResult importData(MultipartFile file, boolean updateSupport) throws Exception\n    {{\n        ExcelUtil<{cls}> util = new ExcelUtil<{cls}>({cls}.class);\n        List<{cls}> {module}List = util.importExcel(file.getInputStream());\n        String operName = String.valueOf(getUserId());\n        String message = {module}Service.import{cls}({module}List, updateSupport, operName);\n        return success(message);\n    }}\n\n    @PostMapping(\"/importTemplate\")\n    public void importTemplate(HttpServletResponse response)\n    {{\n        ExcelUtil<{cls}> util = new ExcelUtil<{cls}>({cls}.class);\n        util.importTemplateExcel(response, \"{title}\");\n    }}\n"""

    controller_content=f"""package com.ruoyi.web.controller.pig;\n\nimport java.util.List;\nimport javax.servlet.http.HttpServletResponse;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.security.access.prepost.PreAuthorize;\nimport org.springframework.validation.annotation.Validated;\nimport org.springframework.web.bind.annotation.DeleteMapping;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.PathVariable;\nimport org.springframework.web.bind.annotation.PostMapping;\nimport org.springframework.web.bind.annotation.PutMapping;\nimport org.springframework.web.bind.annotation.RequestBody;\nimport org.springframework.web.bind.annotation.RequestMapping;\nimport org.springframework.web.bind.annotation.RestController;{import_imports}\nimport com.ruoyi.common.annotation.Log;\nimport com.ruoyi.common.core.controller.BaseController;\nimport com.ruoyi.common.core.domain.AjaxResult;\nimport com.ruoyi.common.core.page.TableDataInfo;\nimport com.ruoyi.common.enums.BusinessType;\nimport com.ruoyi.common.utils.poi.ExcelUtil;\nimport com.ruoyi.system.domain.pig.{cls};\nimport com.ruoyi.system.service.pig.I{cls}Service;\n\n/**\n * {title}Controller\n * \n * @author ruoyi\n */\n@RestController\n@RequestMapping(\"/pig/{module}\")\npublic class {controller_name} extends BaseController\n{{\n    @Autowired\n    private I{cls}Service {module}Service;\n\n    /**\n     * 查询{title}列表\n     */\n    @PreAuthorize(\"@ss.hasPermi('pig:{module}:list')\")\n    @GetMapping(\"/list\")\n    public TableDataInfo list({cls} {module})\n    {{\n        startPage();\n        List<{cls}> list = {module}Service.select{cls}List({module});\n        return getDataTable(list);\n    }}\n\n    /**\n     * 导出{title}列表\n     */\n    @Log(title = \"{title}\", businessType = BusinessType.EXPORT)\n    @PreAuthorize(\"@ss.hasPermi('pig:{module}:export')\")\n    @PostMapping(\"/export\")\n    public void export(HttpServletResponse response, {cls} {module})\n    {{\n        List<{cls}> list = {module}Service.select{cls}List({module});\n        ExcelUtil<{cls}> util = new ExcelUtil<{cls}>({cls}.class);\n        util.exportExcel(response, list, \"{title}数据\");\n    }}\n{import_methods_ctrl}\n    /**\n     * 获取{title}详细信息\n     */\n    @PreAuthorize(\"@ss.hasPermi('pig:{module}:query')\")\n    @GetMapping(value = \"/{{id}}\")\n    public AjaxResult getInfo(@PathVariable(\"id\") Long id)\n    {{\n        return success({module}Service.select{cls}ById(id));\n    }}\n\n    /**\n     * 新增{title}\n     */\n    @PreAuthorize(\"@ss.hasPermi('pig:{module}:add')\")\n    @Log(title = \"{title}\", businessType = BusinessType.INSERT)\n    @PostMapping\n    public AjaxResult add(@Validated @RequestBody {cls} {module})\n    {{\n        {module}.setCreateBy(String.valueOf(getUserId()));\n        return toAjax({module}Service.insert{cls}({module}));\n    }}\n\n    /**\n     * 修改{title}\n     */\n    @PreAuthorize(\"@ss.hasPermi('pig:{module}:edit')\")\n    @Log(title = \"{title}\", businessType = BusinessType.UPDATE)\n    @PutMapping\n    public AjaxResult edit(@Validated @RequestBody {cls} {module})\n    {{\n        {module}.setUpdateBy(String.valueOf(getUserId()));\n        return toAjax({module}Service.update{cls}({module}));\n    }}\n\n    /**\n     * 删除{title}\n     */\n    @PreAuthorize(\"@ss.hasPermi('pig:{module}:remove')\")\n    @Log(title = \"{title}\", businessType = BusinessType.DELETE)\n    @DeleteMapping(\"/{{ids}}\")\n    public AjaxResult remove(@PathVariable Long[] ids)\n    {{\n        return toAjax({module}Service.delete{cls}ByIds(ids));\n    }}\n}}\n"""
    with open(controller_path,'w',encoding='utf-8') as f:
        f.write(controller_content)

    # mapper xml
    mapper_xml_path=os.path.join(mapper_xml_dir, f'{cls}Mapper.xml')

    select_cols=[col for col,_ in cols]

    result_lines=[]
    for col, _ in cols:
        prop=to_prop(col)
        if col=='f_id':
            result_lines.append(f"        <id property=\"{prop}\" column=\"{col}\" />")
        else:
            result_lines.append(f"        <result property=\"{prop}\" column=\"{col}\" />")

    where_lines=[]
    for col, base_type in cols:
        if col in ('f_creator','f_updator','f_createTime','f_updateTime'):
            continue
        prop=to_prop(col)
        if is_string(base_type):
            where_lines.append(f"            <if test=\"{prop} != null and {prop} != ''\">\n                AND {col} like concat('%', #{{{prop}}}, '%')\n            </if>")
        else:
            where_lines.append(f"            <if test=\"{prop} != null\">\n                AND {col} = #{{{prop}}}\n            </if>")

    insert_cols=[]
    insert_vals=[]
    for col, base_type in cols:
        prop=to_prop(col)
        if col=='f_id':
            if not info['auto_inc_id']:
                insert_cols.append(f"{col},")
                insert_vals.append(f"#{{{prop}}},")
            else:
                insert_cols.append(f"<if test=\"{prop} != null and {prop} != 0\">{col},</if>")
                insert_vals.append(f"<if test=\"{prop} != null and {prop} != 0\">#{{{prop}}},</if>")
            continue
        if col=='f_createTime':
            insert_cols.append(f"{col},")
            insert_vals.append("sysdate(),")
            continue
        if col=='f_updateTime':
            continue
        if col=='f_updator':
            continue
        if col=='f_creator':
            insert_cols.append(f"<if test=\"createBy != null and createBy != ''\">{col},</if>")
            insert_vals.append(f"<if test=\"createBy != null and createBy != ''\">#{{createBy}},</if>")
            continue
        if is_string(base_type):
            insert_cols.append(f"<if test=\"{prop} != null and {prop} != ''\">{col},</if>")
            insert_vals.append(f"<if test=\"{prop} != null and {prop} != ''\">#{{{prop}}},</if>")
        else:
            insert_cols.append(f"<if test=\"{prop} != null\">{col},</if>")
            insert_vals.append(f"<if test=\"{prop} != null\">#{{{prop}}},</if>")

    update_lines=[]
    for col, base_type in cols:
        prop=to_prop(col)
        if col in ('f_id','f_createTime','f_creator'):
            continue
        if col=='f_updateTime':
            update_lines.append(f"            {col} = sysdate()")
            continue
        if col=='f_updator':
            update_lines.append("            <if test=\"updateBy != null and updateBy != ''\">f_updator = #{updateBy},</if>")
            continue
        if is_string(base_type):
            update_lines.append(f"            <if test=\"{prop} != null and {prop} != ''\">{col} = #{{{prop}}},</if>")
        else:
            update_lines.append(f"            <if test=\"{prop} != null\">{col} = #{{{prop}}},</if>")

    insert_open=f"<insert id=\"insert{cls}\" parameterType=\"{cls}\""
    if info['auto_inc_id']:
        insert_open += " useGeneratedKeys=\"true\" keyProperty=\"id\""
    insert_open += ">"

    mapper_xml=f"""<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE mapper\nPUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\"\n\"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">\n<mapper namespace=\"com.ruoyi.system.mapper.pig.{cls}Mapper\">\n\n    <resultMap type=\"{cls}\" id=\"{cls}Result\">\n{os.linesep.join(result_lines)}\n    </resultMap>\n\n    <sql id=\"select{cls}Vo\">\n        select {', '.join(select_cols)}\n        from {table}\n    </sql>\n\n    <select id=\"select{cls}List\" parameterType=\"{cls}\" resultMap=\"{cls}Result\">\n        <include refid=\"select{cls}Vo\"/>\n        <where>\n{os.linesep.join(where_lines)}\n        </where>\n    </select>\n\n    <select id=\"select{cls}ById\" parameterType=\"Long\" resultMap=\"{cls}Result\">\n        <include refid=\"select{cls}Vo\"/>\n        where f_id = #{{id}}\n    </select>\n\n    {insert_open}\n        insert into {table}(\n            {os.linesep.join(insert_cols)}\n        ) values (\n            {os.linesep.join(insert_vals)}\n        )\n    </insert>\n\n    <update id=\"update{cls}\" parameterType=\"{cls}\">\n        update {table}\n        <set>\n{os.linesep.join(update_lines)}\n        </set>\n        where f_id = #{{id}}\n    </update>\n\n    <delete id=\"delete{cls}ById\" parameterType=\"Long\">\n        delete from {table} where f_id = #{{id}}\n    </delete>\n\n    <delete id=\"delete{cls}ByIds\" parameterType=\"Long\">\n        delete from {table} where f_id in\n        <foreach collection=\"array\" item=\"id\" open=\"(\" separator=\",\" close=\")\">\n            #{{id}}\n        </foreach>\n    </delete>\n\n</mapper>\n"""
    with open(mapper_xml_path,'w',encoding='utf-8') as f:
        f.write(mapper_xml)

print('generated', len(class_map), 'modules')
