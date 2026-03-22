package com.ruoyi.web.controller.customer;

import java.io.Serializable;

/**
 * 微信客户接口统一返回体
 *
 * @param <T> 数据类型
 */
public class CustomerApiResult<T> implements Serializable
{
    private static final long serialVersionUID = 1L;

    private int errcode;

    private String errmsg;

    private T data;

    public CustomerApiResult()
    {
    }

    public CustomerApiResult(int errcode, String errmsg, T data)
    {
        this.errcode = errcode;
        this.errmsg = errmsg;
        this.data = data;
    }

    public static <T> CustomerApiResult<T> success()
    {
        return new CustomerApiResult<T>(0, "ok", null);
    }

    public static <T> CustomerApiResult<T> success(T data)
    {
        return new CustomerApiResult<T>(0, "ok", data);
    }

    public static <T> CustomerApiResult<T> error(int errcode, String errmsg)
    {
        return new CustomerApiResult<T>(errcode, errmsg, null);
    }

    public int getErrcode()
    {
        return errcode;
    }

    public void setErrcode(int errcode)
    {
        this.errcode = errcode;
    }

    public String getErrmsg()
    {
        return errmsg;
    }

    public void setErrmsg(String errmsg)
    {
        this.errmsg = errmsg;
    }

    public T getData()
    {
        return data;
    }

    public void setData(T data)
    {
        this.data = data;
    }
}
